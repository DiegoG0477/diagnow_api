// prescription/application/services/IFcmNotificationService.ts
import { Prescription } from "../../domain/entities/Prescription";

export interface INotificationService {
    /**
     * Sends a push notification about a newly created prescription to the relevant patient.
     * The implementation should handle fetching the patient's device token(s).
     * @param prescription The newly created prescription details.
     * @returns Promise<boolean> indicating success or failure of sending.
     */
    sendNewPrescriptionNotification(prescription: Prescription): Promise<boolean>;
}