// medication/infrastructure/adapters/mysql/MysqlMedicationRepository.ts
import { query } from "../../../shared/database/mysqlAdapter"; // Adjust path
import { Medication } from "../../domain/entities/Medication";
import { MedicationRepository } from "../../domain/MedicationRepository";

export class MysqlMedicationRepository implements MedicationRepository {

    async createMedication(medication: Medication): Promise<Medication | null> {
        const sql = `INSERT INTO medications(
                        prescription_id, name, dosage, frequency, days,
                        administration_route, instructions
                     ) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const params: any[] = [
            parseInt(medication.prescriptionId, 10), // Convert FK to number
            medication.name,
            medication.dosage,
            medication.frequency,
            medication.days,
            medication.administrationRoute,
            medication.instructions
        ];
        try {
            const [result]: any = await query(sql, params);

            if (result.insertId) {
                // Return the created medication with its new ID
                return new Medication(
                    result.insertId.toString(),
                    medication.prescriptionId,
                    medication.name,
                    medication.dosage,
                    medication.frequency,
                    medication.days,
                    medication.administrationRoute,
                    medication.instructions
                    // createdAt is handled by DB, not fetched back here
                );
            }
            return null; // Insert failed
        } catch (error: any) {
            console.error("Error in createMedication:", error);
            // Check for specific errors like foreign key constraint violation (ER_NO_REFERENCED_ROW)
            if (error.code === 'ER_NO_REFERENCED_ROW' || error.code === 'ER_NO_REFERENCED_ROW_2') {
                console.error(`Foreign key constraint violation: Prescription ID ${medication.prescriptionId} likely does not exist.`);
            }
            return null;
        }
    }

    async getMedicationsByPrescriptionId(prescriptionId: string): Promise<Medication[] | null> {
        const sql = `SELECT id, prescription_id, name, dosage, frequency, days,
                            administration_route, instructions, created_at
                     FROM medications
                     WHERE prescription_id = ?
                     ORDER BY created_at ASC`; // Or order by name, etc.
        const params: any[] = [parseInt(prescriptionId, 10)]; // Convert FK to number for query
        try {
            const [rows]: any = await query(sql, params);
            if (!rows) {
                // Query executed but might have returned undefined/null rows object
                return []; // Return empty array if no medications found for that prescription
            }

            // Map database rows to Medication domain objects
            const medications: Medication[] = rows.map((row: any) => new Medication(
                row.id.toString(),
                row.prescription_id.toString(), // Convert FK back to string for domain
                row.name,
                row.dosage,
                row.frequency,
                row.days,
                row.administration_route,
                row.instructions,
                row.created_at
            ));
            return medications;
        } catch (error) {
            console.error("Error in getMedicationsByPrescriptionId:", error);
            return null; // Indicate an error occurred during fetch
        }
    }

    // --- Helper needed by GetMedicationsByPrescriptionIdUseCase ---
    // Ensure the PrescriptionRepository used has this method available
    // This method belongs in prescription/infrastructure/adapters/mysql/MysqlPrescriptionRepository.ts
    /*
    async getPrescriptionById(id: string): Promise<Prescription | null> {
        const sql = "SELECT id, patient_id, diagnosis, notes, created_at FROM prescriptions WHERE id = ?";
        const params: any[] = [parseInt(id, 10)];
        try {
            const [rows]: any = await query(sql, params);
            if (rows && rows.length > 0) {
                const row = rows[0];
                return new Prescription(
                    row.id.toString(),
                    row.patient_id.toString(),
                    row.diagnosis,
                    row.notes,
                    row.created_at
                );
            }
            return null; // Prescription not found
        } catch (error) {
            console.error("Error in getPrescriptionById:", error);
            return null;
        }
    }
    */
     // --- End Helper ---
}