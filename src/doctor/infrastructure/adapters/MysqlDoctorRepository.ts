// doctor/infrastructure/adapters/mysql/MysqlDoctorRepository.ts
import { query } from "../../../shared/database/mysqlAdapter"; // Adjust path as needed
import { Doctor } from "../../domain/entities/Doctor";
import { DoctorRepository } from "../../domain/DoctorRepository";

export class MysqlDoctorRepository implements DoctorRepository {

    async registerDoctor(doctor: Doctor): Promise<Doctor | null> {
        const sql = "INSERT INTO doctors(name, last_name, password) VALUES(?, ?, ?)";
        const params: any[] = [doctor.name, doctor.last_name, doctor.password];
        try {
            const [result]: any = await query(sql, params);

            if (result.insertId) {
                // Return the doctor object with the generated ID
                return new Doctor(
                    result.insertId.toString(),
                    doctor.name,
                    doctor.last_name,
                    '', // Don't return hash on successful registration response
                    undefined // created_at not fetched back, could add another query if needed
                );
            }
            return null; // Insert failed
        } catch (error: any) {
            console.error("Error in registerDoctor:", error);
            // Consider checking for specific error codes if needed
            return null;
        }
    }

    async getPasswordByNameAndLastName(name: string, lastName: string): Promise<string | null> {
        // WARNING: Querying by non-unique fields. Add LIMIT 1 to ensure only one result.
        // If multiple doctors have the same name/lastName, this will arbitrarily pick one.
        const sql = "SELECT password FROM doctors WHERE name = ? AND last_name = ? LIMIT 1";
        const params: any[] = [name, lastName];
        try {
            const [rows]: any = await query(sql, params);
            if (rows && rows.length > 0) {
                return rows[0].password; // Return the hashed password
            }
            return null; // Doctor not found or name combination not unique
        } catch (error) {
            console.error("Error in getPasswordByNameAndLastName:", error);
            return null;
        }
    }

    async getDoctorByNameAndLastName(name: string, lastName: string): Promise<Doctor | null> {
        // WARNING: Querying by non-unique fields. Add LIMIT 1.
        const sql = "SELECT id, name, last_name, created_at FROM doctors WHERE name = ? AND last_name = ? LIMIT 1"; // Exclude password
        const params: any[] = [name, lastName];
        try {
            const [rows]: any = await query(sql, params);
            if (rows && rows.length > 0) {
                const row = rows[0];
                return new Doctor(
                    row.id.toString(),
                    row.name,
                    row.last_name,
                    '', // Password hash is not needed here
                    row.created_at
                );
            }
            return null; // Doctor not found
        } catch (error) {
            console.error("Error in getDoctorByNameAndLastName:", error);
            return null;
        }
    }

    async getDoctorById(id: string): Promise<Doctor | null> {
        const sql = "SELECT id, name, last_name, created_at FROM doctors WHERE id = ?"; // Exclude password
        const params: any[] = [id];
        try {
            const [rows]: any = await query(sql, params);
            if (rows && rows.length > 0) {
                const row = rows[0];
                return new Doctor(
                    row.id.toString(),
                    row.name,
                    row.last_name,
                    '', // Password hash not needed
                    row.created_at
                );
            }
            return null; // Doctor not found
        } catch (error) {
            console.error("Error in getDoctorById:", error);
            return null;
        }
    }
}