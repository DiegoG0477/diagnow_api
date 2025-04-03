// prescription/infrastructure/services/firebase/FcmNotificationService.ts
import * as admin from 'firebase-admin';
import { INotificationService } from "../../../application/services/INotificationService";
import { Prescription } from "../../../domain/entities/Prescription";

// Helper function to ensure Firebase is initialized only once
let firebaseApp: admin.app.App | null = null;

function initializeFirebaseAdmin() {
    if (!firebaseApp) {
        try {
             // Check if already initialized (might happen in hot-reloads or complex setups)
             if (admin.apps.length > 0) {
                firebaseApp = admin.apps[0];
                console.log('Firebase Admin SDK already initialized.');
             } else {
                 // Option 1: Use Application Default Credentials (recommended for production)
                 // Ensure GOOGLE_APPLICATION_CREDENTIALS env var is set to the path of your service account key file
                 // admin.initializeApp();

                 // Option 2: Explicitly use service account file path (replace with your actual path or env var)
                 const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
                 if (!serviceAccountPath) {
                     throw new Error("FIREBASE_SERVICE_ACCOUNT_PATH environment variable not set.");
                 }
                 const serviceAccount = require(serviceAccountPath); // Use require for JSON
                 firebaseApp = admin.initializeApp({
                     credential: admin.credential.cert(serviceAccount),
                     // databaseURL: "YOUR_DATABASE_URL" // Optional: If using Realtime Database
                 });
                 console.log('Firebase Admin SDK initialized successfully.');
             }
        } catch (error) {
            console.error('Firebase Admin SDK initialization failed:', error);
            // Prevent service from working if initialization fails
             throw new Error(`Firebase Admin SDK initialization failed: ${error instanceof Error ? error.message : error}`);
        }
    }
    return firebaseApp;
}

export class FcmNotificationService implements INotificationService {

    constructor() {
        // Ensure Firebase is initialized when the service is instantiated
        initializeFirebaseAdmin();
    }

    async sendNewPrescriptionNotification(prescription: Prescription): Promise<boolean> {
        if (!firebaseApp) {
             console.error("Firebase Admin SDK not initialized. Cannot send notification.");
             return false;
        }

        const patientId = prescription.patientId;

        try {
            // --- Placeholder for fetching device token ---
            // In a real application, you would query your database here
            // based on the patientId to get their FCM registration token(s).
            // Example:
            // const deviceToken = await deviceTokenRepository.getTokenByUserId(patientId);
            const deviceToken = await this.fetchDeviceTokenForPatient(patientId); // Simulate fetch
            // --- End Placeholder ---

            if (!deviceToken) {
                console.warn(`No FCM device token found for patient ID: ${patientId}. Cannot send notification.`);
                return false; // Cannot send without a token
            }

            // Construct the notification message
            const message: admin.messaging.Message = {
                notification: {
                    title: 'Nueva Receta Médica',
                    body: `Se ha registrado una nueva receta para ti. Diagnóstico: ${prescription.diagnosis || 'No especificado'}.`,
                    // You can add more options like 'icon', 'sound', 'click_action' etc.
                },
                // Optional: Add custom data payload if the app needs to process it
                data: {
                    prescriptionId: prescription.id,
                    patientId: prescription.patientId,
                    type: 'NEW_PRESCRIPTION' // Custom type for app logic
                },
                token: deviceToken, // Target specific device token
                // Or use 'topic: topicName' or 'condition: conditionExpression'
            };

             // Send the message using Firebase Admin SDK
             console.log(`Attempting to send FCM notification to token: ${deviceToken.substring(0, 10)}... for patientId: ${patientId}`); // Log masked token
             const response = await admin.messaging().send(message);
             console.log('Successfully sent FCM message:', response);
             return true; // Indicate success

        } catch (error) {
            console.error(`Error sending FCM notification to patient ID ${patientId}:`, error);
             // Check for specific FCM errors (e.g., 'messaging/registration-token-not-registered')
             if (error instanceof Error && 'code' in error) {
                const firebaseError = error as admin.FirebaseError;
                if (firebaseError.code === 'messaging/registration-token-not-registered') {
                    console.warn(`FCM token for patient ${patientId} is invalid or unregistered. Consider removing it.`);
                    // Add logic here to potentially delete the invalid token from your DB
                }
             }
            return false; // Indicate failure
        }
    }

    // --- Placeholder Implementation ---
    /**
     * **Placeholder:** Simulates fetching a device token for a patient.
     * Replace this with actual database logic to retrieve the token.
     * @param patientId The ID of the patient.
     * @returns A fake device token or null.
     */
    private async fetchDeviceTokenForPatient(patientId: string): Promise<string | null> {
        console.warn(`[Placeholder] Fetching device token for patientId: ${patientId}`);
        // Simulate lookup. Replace with DB query.
        // Example: return await query("SELECT fcm_token FROM device_tokens WHERE user_id = ? AND user_type = 'patient' LIMIT 1", [patientId]);
        // Returning a fake token for demonstration:
        if (patientId === '1') { // Example: Patient 1 has a token
             return 'FAKE_DEVICE_TOKEN_REPLACE_ME_PATIENT_' + patientId;
        }
        return null; // Simulate patient not having a token
    }
    // --- End Placeholder ---
}