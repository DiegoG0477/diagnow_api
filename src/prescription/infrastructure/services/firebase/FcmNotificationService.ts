// prescription/infrastructure/services/firebase/FcmNotificationService.ts
import * as admin from 'firebase-admin';
import { INotificationService } from "../../../application/services/INotificationService";
import { Prescription } from "../../../domain/entities/Prescription";
// --- Importa la INTERFAZ del repositorio de tokens ---
import { DeviceTokenRepository } from '../../../../device-token/domain/DeviceTokenRepository';
import { FirebaseError } from 'firebase-admin/app'; // Para el type guard (recomendado)

// Helper function to ensure Firebase is initialized only once
let firebaseApp: admin.app.App | null = null;

// --- VERSIÓN SIMPLIFICADA para usar GOOGLE_APPLICATION_CREDENTIALS ---
function initializeFirebaseAdmin() {
    if (!firebaseApp) {
        try {
             // Check if already initialized (puede ocurrir en hot-reload o setups complejos)
             if (admin.apps.length > 0) {
                firebaseApp = admin.apps[0];
                console.log('Firebase Admin SDK already initialized.');
             } else {
                 // Inicializa usando las credenciales por defecto encontradas
                 // (GOOGLE_APPLICATION_CREDENTIALS o credenciales del entorno cloud)
                 firebaseApp = admin.initializeApp();
                 console.log('Firebase Admin SDK initialized successfully using default credentials.');
             }
        } catch (error) {
            console.error('Firebase Admin SDK initialization failed:', error);
            // Es crucial lanzar un error o manejarlo para que el servicio no funcione sin autenticación
             throw new Error(`Firebase Admin SDK initialization failed: ${error instanceof Error ? error.message : error}`);
        }
    }
    return firebaseApp;
}
// --- FIN VERSIÓN SIMPLIFICADA ---


// Type guard para verificar si un error es de tipo FirebaseError
function isFirebaseError(error: unknown): error is FirebaseError {
    // Comprueba propiedades clave de FirebaseError, incluyendo el método toJSON que TS suele señalar
    return typeof error === 'object' && error !== null && 'code' in error && 'message' in error && 'stack' in error && typeof (error as any).toJSON === 'function';
}

export class FcmNotificationService implements INotificationService {

    // --- Inyección del Repositorio de Tokens ---
    // El servicio AHORA DEPENDE del repositorio para funcionar
    constructor(private readonly deviceTokenRepository: DeviceTokenRepository) {
        initializeFirebaseAdmin(); // Asegura que Firebase esté listo al crear la instancia
    }
    // -----------------------------------------

    async sendNewPrescriptionNotification(prescription: Prescription): Promise<boolean> {
        if (!firebaseApp) {
             console.error("Firebase Admin SDK not initialized. Cannot send notification.");
             return false; // No se puede enviar si Firebase no está listo
        }

        const patientId = prescription.patientId;

        try {
            // --- USA EL REPOSITORIO REAL para obtener los tokens ---
            const deviceTokens = await this.deviceTokenRepository.getTokensByPatientId(patientId);
            // ----------------------------------------------------

            // --- Manejo de Casos de Retorno del Repositorio ---
            // Caso 1: Error en la base de datos al buscar tokens
            if (deviceTokens === null) {
                console.error(`Failed to retrieve device tokens for patient ${patientId} due to a database error.`);
                // No se puede continuar si no podemos obtener los tokens.
                // El error ya debería haberse logueado en el repositorio.
                return false;
            }
            // Caso 2: Búsqueda exitosa, pero el paciente no tiene tokens registrados
            if (deviceTokens.length === 0) {
                console.warn(`No FCM device token found for patient ID: ${patientId}. Cannot send notification.`);
                // Esto no es un error del sistema, pero no hay a quién notificar.
                return false;
            }
            // --- Fin Manejo de Casos ---


            // --- Lógica de Envío (igual que antes, pero ahora con tokens reales) ---
            // Crea una promesa para cada intento de envío
            const sendPromises = deviceTokens.map(token => {
                const message: admin.messaging.Message = {
                    notification: {
                        title: 'Nueva Receta Médica', // O 'New Medical Prescription'
                        body: `Se ha registrado una nueva receta para ti. Diagnóstico: ${prescription.diagnosis || 'No especificado'}.`,
                        // Considera añadir 'badge', 'sound', etc.
                    },
                    data: { // Payload de datos para que la app reaccione
                        prescriptionId: prescription.id,
                        patientId: prescription.patientId,
                        type: 'NEW_PRESCRIPTION' // Ayuda al cliente a saber qué hacer
                    },
                    token: token, // El token específico del dispositivo
                    // Configuración específica de plataforma (opcional pero útil)
                    android: {
                        priority: 'high', // Asegura entrega rápida
                        notification: {
                           // sound: 'default', // Sonido por defecto en Android
                            // channelId: 'new_prescriptions' // Si tienes canales de notificación
                        }
                    },
                    apns: { // Configuración para Apple Push Notification Service
                        payload: {
                            aps: {
                                alert: {
                                    title: 'Nueva Receta Médica',
                                    body: `Se ha registrado una nueva receta para ti. Diagnóstico: ${prescription.diagnosis || 'No especificado'}.`,
                                },
                                sound: 'default', // Sonido por defecto en iOS
                                badge: 1 // Actualiza el contador del ícono (si lo manejas)
                            }
                        }
                    }
                };
                console.log(`Attempting to send FCM notification to token: ${token.substring(0, 10)}... for patientId: ${patientId}`);
                return admin.messaging().send(message); // Devuelve la promesa de envío
            });

            // Espera a que todas las promesas de envío se completen (éxito o fallo)
            const results = await Promise.allSettled(sendPromises);
            let allSuccessful = true; // Asume éxito hasta que falle una

            results.forEach((result, index) => {
                const currentToken = deviceTokens[index]; // Token asociado a este resultado
            
                // --- Bloque 'fulfilled' ---
                if (result.status === 'fulfilled') {
                    // Asumimos que result.value es un string (message ID)
                    const messageId = result.value as string;
            
                    console.log(`Successfully sent FCM message to token ${currentToken.substring(0,10)}...: Message ID: ${messageId}`);
                } else { // result.status === 'rejected'
                    allSuccessful = false;
                    console.error(`Error sending FCM notification to token ${currentToken.substring(0,10)}... for patient ID ${patientId}:`, result.reason);
                    // LLAMA AL MANEJADOR DE ERRORES
                    this.handleFcmError(result.reason, currentToken, patientId);
                }
            });

            // Retorna true si *todos* los envíos fueron exitosos, false si alguno falló.
            // Puedes ajustar esta lógica si quieres retornar true si *al menos uno* fue exitoso.
            return allSuccessful;

        } catch (error) {
            // Captura errores inesperados *fuera* de las llamadas a send() o al repositorio
            // (ej. error en la lógica de construcción del mensaje, etc.)
            console.error(`Unexpected error in sendNewPrescriptionNotification for patient ID ${patientId}:`, error);
            return false;
        }
    }

    /**
     * Maneja errores específicos de Firebase Messaging, especialmente para eliminar tokens inválidos.
     * @param error El objeto de error recibido de admin.messaging().send()
     * @param token El token que causó el error.
     * @param patientId El ID del paciente asociado (para logging).
     */
    private async handleFcmError(error: any, token: string, patientId: string): Promise<void> {
         // Usa el type guard para verificar si es un error conocido de Firebase
         if (isFirebaseError(error)) {
            // Códigos de error comunes que indican que el token ya no es válido
            const invalidTokenCodes = [
                'messaging/registration-token-not-registered',
                'messaging/invalid-registration-token'
            ];

            if (invalidTokenCodes.includes(error.code)) {
                console.warn(`FCM token ${token.substring(0,10)}... for patient ${patientId} (Code: ${error.code}) is invalid. Removing it from database.`);
                try {
                    // --- LLAMA AL REPOSITORIO PARA BORRAR EL TOKEN INVÁLIDO ---
                    await this.deviceTokenRepository.deleteToken(token);
                    console.log(`Successfully deleted invalid token: ${token.substring(0, 10)}...`);
                    // --------------------------------------------------------
                } catch (deleteError) {
                    // Logea si falla el borrado, pero no detiene el flujo principal
                    console.error(`Failed to delete invalid token ${token.substring(0,10)}... from DB after FCM error:`, deleteError);
                }
            } else {
                 // Logea otros errores de Firebase que puedan ocurrir
                 console.error(`Unhandled Firebase Messaging error sending to ${token.substring(0,10)}...: Code: ${error.code}, Message: ${error.message}`);
            }
         } else if (error instanceof Error) {
             // Error genérico de Javascript
             console.error(`Non-Firebase error sending to ${token.substring(0,10)}...: ${error.message}`);
         } else {
             // Tipo de error desconocido
             console.error(`Unknown error type sending to ${token.substring(0,10)}...:`, error);
         }
    }

    // --- EL PLACEHOLDER 'fetchPlaceholderDeviceTokensForPatient' SE HA ELIMINADO ---
}