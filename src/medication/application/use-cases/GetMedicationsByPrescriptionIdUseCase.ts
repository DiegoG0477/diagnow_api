// medication/application/use-cases/GetMedicationsByPrescriptionIdUseCase.ts
import { Medication } from "../../domain/entities/Medication";
import { MedicationRepository } from "../../domain/MedicationRepository";
import { PrescriptionRepository } from "../../../prescription/domain/PrescriptionRepository"; // Import Prescription Repository Interface

// Define a specific response structure for this use case
export interface MedicationsByPrescriptionResponse {
    prescriptionCreatedAt: Date | undefined; // The creation date of the prescription
    medications: Medication[];               // The list of medications
}

export class GetMedicationsByPrescriptionIdUseCase {
    constructor(
        readonly medicationRepository: MedicationRepository,
        // Inject PrescriptionRepository to get the prescription's date
        readonly prescriptionRepository: PrescriptionRepository
    ) {}

    async run(prescriptionId: string): Promise<MedicationsByPrescriptionResponse | null> {
        try {
            if (!prescriptionId) {
                console.warn("GetMedicationsByPrescriptionIdUseCase called without prescriptionId");
                return null;
            }

            // 1. Fetch the medications for the given prescription ID
            const medications = await this.medicationRepository.getMedicationsByPrescriptionId(prescriptionId);

            if (medications === null) {
                // Indicates an error fetching medications
                console.error(`Error fetching medications for prescriptionId ${prescriptionId}`);
                return null;
            }

            // 2. Fetch the prescription details to get its creation date
            // Assumes PrescriptionRepository has getPrescriptionById method
            const prescription = await this.prescriptionRepository.getPrescriptionById(prescriptionId);

            if (prescription === null) {
                // Prescription not found, maybe log this, but can still return medications if they exist
                 console.warn(`Prescription with ID ${prescriptionId} not found while fetching medications.`);
                 // Decide if you *require* the prescription to exist. If so, return null here.
                 // If you just want the date if available, continue.
                 return {
                    prescriptionCreatedAt: undefined, // Indicate date couldn't be found
                    medications: medications // Return medications found even if prescription wasn't
                 };
            }


            // 3. Combine the results
            const response: MedicationsByPrescriptionResponse = {
                prescriptionCreatedAt: prescription.createdAt,
                medications: medications
            };

            return response;

        } catch (error) {
            console.error(`Error in GetMedicationsByPrescriptionIdUseCase for prescriptionId ${prescriptionId}:`, error);
            return null;
        }
    }
}