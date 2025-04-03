// medication/application/use-cases/CreateMedicationUseCase.ts
import { Medication } from "../../domain/entities/Medication";
import { MedicationRepository } from "../../domain/MedicationRepository";

export class CreateMedicationUseCase {
    constructor(
        readonly medicationRepository: MedicationRepository
    ) {}

    async run(
        prescriptionId: string,
        name: string | null,
        dosage: string | null,
        frequency: number | null,
        days: number | null,
        administrationRoute: string | null,
        instructions: string | null
    ): Promise<Medication | null> {
        try {
            // ID and createdAt handled by DB/repository
            const medicationObject = new Medication(
                '', // ID assigned by DB
                prescriptionId,
                name,
                dosage,
                frequency,
                days,
                administrationRoute,
                instructions
                // createdAt assigned by DB default
            );

            const createdMedication = await this.medicationRepository.createMedication(medicationObject);
            return createdMedication;

        } catch (error) {
            console.error("Error in CreateMedicationUseCase:", error);
            // Consider logging specific errors, e.g., foreign key constraint violation
            return null;
        }
    }
}