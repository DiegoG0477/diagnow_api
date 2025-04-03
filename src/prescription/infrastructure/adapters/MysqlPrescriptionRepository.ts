// prescription/infrastructure/adapters/mysql/MysqlPrescriptionRepository.ts
import { query } from "../../../shared/database/mysqlAdapter"; // Adjust path as needed
import { Prescription } from "../../domain/entities/Prescription";
import { PrescriptionRepository } from "../../domain/PrescriptionRepository";

export class MysqlPrescriptionRepository implements PrescriptionRepository {

    async createPrescription(prescription: Prescription): Promise<Prescription | null> {
        const sql = "INSERT INTO prescriptions(patient_id, diagnosis, notes) VALUES(?, ?, ?)";
        // Ensure patientId is converted to number if the DB column expects INT
        const params: any[] = [parseInt(prescription.patientId, 10), prescription.diagnosis, prescription.notes];
        try {
            const [result]: any = await query(sql, params);

            if (result.insertId) {
                // Return a new Prescription object with the generated ID
                // We don't get createdAt back directly, could query again if needed
                return new Prescription(
                    result.insertId.toString(),
                    prescription.patientId,
                    prescription.diagnosis,
                    prescription.notes
                    // createdAt would be undefined here unless fetched separately
                );
            }
            return null; // Insert failed
        } catch (error: any) {
            console.error("Error in createPrescription:", error);
            // Could check for foreign key constraint errors (e.g., invalid patient_id)
            return null;
        }
    }

    async getPrescriptions(): Promise<Prescription[] | null> {
        const sql = "SELECT id, patient_id, diagnosis, notes, created_at FROM prescriptions ORDER BY created_at DESC";
        try {
            const [rows]: any = await query(sql, []);
            if (!rows) {
                return [];
            }
            // Map database rows to Prescription domain objects
            const prescriptions: Prescription[] = rows.map((row: any) => new Prescription(
                row.id.toString(),
                row.patient_id.toString(), // Ensure patientId is string in domain object
                row.diagnosis,
                row.notes,
                row.created_at
            ));
            return prescriptions;
        } catch (error) {
            console.error("Error in getPrescriptions:", error);
            return null;
        }
    }

    async getPrescriptionsByPatientId(patientId: string): Promise<Prescription[] | null> {
        const sql = "SELECT id, patient_id, diagnosis, notes, created_at FROM prescriptions WHERE patient_id = ? ORDER BY created_at DESC";
        // Convert patientId to number for the query parameter
        const params: any[] = [parseInt(patientId, 10)];
        try {
            const [rows]: any = await query(sql, params);
            if (!rows) {
                return []; // Return empty array if none found
            }
            // Map database rows to Prescription domain objects
            const prescriptions: Prescription[] = rows.map((row: any) => new Prescription(
                row.id.toString(),
                row.patient_id.toString(), // Ensure patientId is string in domain object
                row.diagnosis,
                row.notes,
                row.created_at
            ));
            return prescriptions;
        } catch (error) {
            console.error("Error in getPrescriptionsByPatientId:", error);
            return null;
        }
    }

    async getPrescriptionById(id: string): Promise<Prescription | null> {
        const sql = "SELECT id, patient_id, diagnosis, notes, created_at FROM prescriptions WHERE id = ?";
        const params: any[] = [parseInt(id, 10)]; // Convert id to number for the query
        try {
            const [rows]: any = await query(sql, params);

            if (rows && rows.length > 0) {
                const row = rows[0];
                // Map row data to Prescription domain object
                return new Prescription(
                    row.id.toString(),           // Convert DB ID back to string for domain
                    row.patient_id.toString(),   // Convert patient_id back to string
                    row.diagnosis,
                    row.notes,
                    row.created_at
                );
            }
            // No prescription found with that ID
            return null;
        } catch (error) {
            console.error(`Error in getPrescriptionById for ID ${id}:`, error);
            return null; // Indicate failure
        }
    }
}