// prescription/application/use-cases/GetPrescriptionsByPatientIdUseCase.ts
import { Prescription } from "../../domain/entities/Prescription";
import { PrescriptionRepository } from "../../domain/PrescriptionRepository";

export class GetPrescriptionsByPatientIdUseCase {
    constructor(readonly prescriptionRepository: PrescriptionRepository) {}

    async run(patientId: string): Promise<Prescription[] | null> {
        try {
            // Basic validation
            if (!patientId) {
                console.warn("GetPrescriptionsByPatientIdUseCase called without patientId");
                return null;
            }
            const prescriptions = await this.prescriptionRepository.getPrescriptionsByPatientId(patientId);
            return prescriptions;
        } catch (error) {
            console.error(`Error in GetPrescriptionsByPatientIdUseCase for patientId ${patientId}:`, error);
            return null;
        }
    }
}