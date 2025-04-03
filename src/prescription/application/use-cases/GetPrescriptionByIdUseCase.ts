// prescription/application/use-cases/GetPrescriptionByIdUseCase.ts
import { Prescription } from "../../domain/entities/Prescription";
import { PrescriptionRepository } from "../../domain/PrescriptionRepository";

export class GetPrescriptionByIdUseCase {
    constructor(
        readonly prescriptionRepository: PrescriptionRepository
    ) {}

    async run(id: string): Promise<Prescription | null> {
        try {
            if (!id) {
                console.warn("GetPrescriptionByIdUseCase called without ID.");
                return null;
            }

            const prescription = await this.prescriptionRepository.getPrescriptionById(id);

            // prescriptionRepository returns null if not found or on error handled within repo
            return prescription;

        } catch (error) {
            // Catch unexpected errors during use case execution
            console.error(`Error in GetPrescriptionByIdUseCase for ID ${id}:`, error);
            return null;
        }
    }
}