// prescription/application/use-cases/GetPrescriptionsUseCase.ts
import { Prescription } from "../../domain/entities/Prescription";
import { PrescriptionRepository } from "../../domain/PrescriptionRepository";

export class GetPrescriptionsUseCase {
    constructor(readonly prescriptionRepository: PrescriptionRepository) {}

    async run(): Promise<Prescription[] | null> {
        try {
            const prescriptions = await this.prescriptionRepository.getPrescriptions();
            return prescriptions;
        } catch (error) {
            console.error("Error in GetPrescriptionsUseCase:", error);
            return null;
        }
    }
}