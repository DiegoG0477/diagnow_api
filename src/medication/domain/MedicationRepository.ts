// medication/domain/MedicationRepository.ts
import { Medication } from "./entities/Medication";

export interface MedicationRepository {
    createMedication(medication: Medication): Promise<Medication | null>;
    getMedicationsByPrescriptionId(prescriptionId: string): Promise<Medication[] | null>;
    // Optional: get by ID might be useful later
    // getMedicationById(id: string): Promise<Medication | null>;
}