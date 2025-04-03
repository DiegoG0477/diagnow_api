// patient/infrastructure/adapters/mysql/MysqlPatientRepository.ts
import { query } from "../../../shared/database/mysqlAdapter"; // Adjust path as needed
import { Patient } from "../../domain/entities/Patient";
import { PatientRepository } from "../../domain/PatientRepository";

export class MysqlPatientRepository implements PatientRepository {

    async registerPatient(patient: Patient): Promise<Patient | null> {
        const sql = "INSERT INTO patients(email, password, name, last_name, age, height, weight) VALUES(?, ?, ?, ?, ?, ?, ?)";
        const params: any[] = [patient.email, patient.password, patient.name, patient.last_name, patient.age, patient.height, patient.weight];
        try {
            const [result]: any = await query(sql, params);
            // Check if insert was successful
            if (result.insertId) {
                // Return the patient object with the newly generated ID (converted to string)
                return new Patient(
                    result.insertId.toString(),
                    patient.email,
                    patient.password, // Technically returning the hash, maybe omit? Or keep for consistency.
                    patient.name,
                    patient.last_name,
                    patient.age,
                    patient.height,
                    patient.weight
                    // We don't fetch created_at here, could add another query if needed
                );
            }
            return null; // Insert failed
        } catch (error: any) {
            // Handle potential errors, like duplicate email
            console.error("Error in registerPatient:", error);
             // Check for duplicate entry error code (ER_DUP_ENTRY for MySQL)
             if (error.code === 'ER_DUP_ENTRY') {
                 console.error(`Attempted to register patient with duplicate email: ${patient.email}`);
                 // Optionally throw a specific domain error or return null
             }
            return null;
        }
    }

    async getPatients(): Promise<Patient[] | null> {
        const sql = "SELECT id, email, name, last_name, age, height, weight, created_at FROM patients"; // Exclude password
        try {
            const [rows]: any = await query(sql, []);
            if (!rows || rows.length === 0) {
                return []; // Return empty array if no patients found
            }
            // Map database rows to Patient objects
            const patients: Patient[] = rows.map((row: any) => {
                return new Patient(
                    row.id.toString(), // Convert ID to string
                    row.email,
                    '', // Don't include password hash in general listings
                    row.name,
                    row.last_name,
                    row.age,
                    row.height,
                    row.weight,
                    row.created_at
                );
            });
            return patients;
        } catch (error) {
            console.error("Error in getPatients:", error);
            return null;
        }
    }

    async getPassword(email: string): Promise<string | null> {
        const sql = "SELECT password FROM patients WHERE email = ?";
        const params: any[] = [email];
        try {
            const [rows]: any = await query(sql, params);
            if (rows && rows.length > 0) {
                return rows[0].password; // Return the hashed password
            }
            return null; // Patient not found
        } catch (error) {
            console.error("Error in getPassword:", error);
            return null;
        }
    }

    async changePassword(email: string, passwordHash: string): Promise<boolean | null> {
        const sql = "UPDATE patients SET password = ? WHERE email = ?";
        const params: any[] = [passwordHash, email];
        try {
            const [result]: any = await query(sql, params);
            // Check if any row was actually updated
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Error in changePassword:", error);
            return null; // Indicate error during update
        }
    }

    async getPatientByEmail(email: string): Promise<Patient | null> {
        const sql = "SELECT id, email, name, last_name, age, height, weight, created_at FROM patients WHERE email = ?"; // Exclude password
        const params: any[] = [email];
        try {
            const [rows]: any = await query(sql, params);
            if (rows && rows.length > 0) {
                const row = rows[0];
                return new Patient(
                    row.id.toString(), // Convert ID to string
                    row.email,
                    '', // Password hash is not needed here
                    row.name,
                    row.last_name,
                    row.age,
                    row.height,
                    row.weight,
                    row.created_at
                );
            }
            return null; // Patient not found
        } catch (error) {
            console.error("Error in getPatientByEmail:", error);
            return null;
        }
    }

     async getPatientById(id: string): Promise<Patient | null> {
        const sql = "SELECT id, email, name, last_name, age, height, weight, created_at FROM patients WHERE id = ?"; // Exclude password
        const params: any[] = [id]; // ID should be used directly if DB expects number, or keep as string if query handles it
        try {
            const [rows]: any = await query(sql, params);
            if (rows && rows.length > 0) {
                const row = rows[0];
                return new Patient(
                    row.id.toString(), // Ensure consistency
                    row.email,
                    '',
                    row.name,
                    row.last_name,
                    row.age,
                    row.height,
                    row.weight,
                    row.created_at
                );
            }
            return null; // Patient not found
        } catch (error) {
            console.error("Error in getPatientById:", error);
            return null;
        }
    }
}