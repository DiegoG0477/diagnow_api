// prescription/application/use-cases/CreatePrescriptionUseCase.ts
import { Prescription } from "../../domain/entities/Prescription";
import { PrescriptionRepository } from "../../domain/PrescriptionRepository";
import { INotificationService } from "../services/INotificationService";

export class CreatePrescriptionUseCase {
    constructor(
        private prescriptionRepository: PrescriptionRepository,
        private notificationService: INotificationService // Inject the FCM service interface
    ) {}

    async run(
        patientId: string,
        diagnosis: string | null,
        notes: string | null
    ): Promise<Prescription | null> {
        try {
            // Create Prescription entity (ID generated by DB, createdAt handled by DB/Repo)
            const prescriptionObject = new Prescription(
                '', // ID will be assigned by repository/DB
                patientId,
                diagnosis,
                notes
                // createdAt will be set by DB default
            );

            const createdPrescription = await this.prescriptionRepository.createPrescription(prescriptionObject);

            if (createdPrescription) {
                // If prescription created successfully, attempt to send notification
                try {
                    const notificationSent = await this.notificationService.sendNewPrescriptionNotification(createdPrescription);
                    if (!notificationSent) {
                        // Log the failure, but don't necessarily fail the whole use case
                        // The prescription *was* created successfully.
                        console.warn(`Failed to send FCM notification for prescription ID: ${createdPrescription.id} to patient ID: ${createdPrescription.patientId}`);
                    } else {
                        console.log(`FCM notification sent successfully for prescription ID: ${createdPrescription.id}`);
                    }
                } catch (notificationError) {
                     console.error(`Error sending FCM notification for prescription ID: ${createdPrescription.id}`, notificationError);
                     // Again, log but don't fail the prescription creation itself
                }
            }

            return createdPrescription;

        } catch (error) {
            console.error("Error in CreatePrescriptionUseCase:", error);
            return null;
        }
    }
}