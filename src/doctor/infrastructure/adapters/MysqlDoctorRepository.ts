import { query } from "../../../shared/database/mysqlAdapter"; // Adjust path
import { Doctor } from "../../domain/entities/Doctor";
import { DoctorRepository } from "../../domain/DoctorRepository";

export class MysqlDoctorRepository implements DoctorRepository {

    async registerDoctor(doctor: Doctor): Promise<Doctor | null> {
        // --- UPDATED SQL and params ---
        const sql = "INSERT INTO doctors(name, email, last_name, password) VALUES(?, ?, ?, ?)";
        const params: any[] = [doctor.name, doctor.email, doctor.last_name, doctor.password];
        try {
            const [result]: any = await query(sql, params);
            if (result.insertId) {
                return new Doctor(
                    result.insertId.toString(),
                    doctor.name,
                    doctor.email, // <-- Include email in returned object
                    doctor.last_name,
                    '', // Don't return hash
                    undefined
                );
            }
            return null;
        } catch (error: any) {
            console.error("Error in registerDoctor:", error);
             // Check for duplicate entry error code specifically for email if it's UNIQUE
             if (error.code === 'ER_DUP_ENTRY') {
                 console.error(`Attempted to register doctor with duplicate email: ${doctor.email}`);
             }
            return null;
        }
    }

    // --- REMOVED Methods based on name/lastName ---
    // async getPasswordByNameAndLastName(...) { ... }
    // async getDoctorByNameAndLastName(...) { ... }

    // --- ADDED/UPDATED Methods for email ---
    async getPasswordByEmail(email: string): Promise<string | null> {
        const sql = "SELECT password FROM doctors WHERE email = ?";
        const params: any[] = [email];
        try {
            const [rows]: any = await query(sql, params);
            if (rows && rows.length > 0) {
                return rows[0].password;
            }
            return null; // Doctor not found with this email
        } catch (error) {
            console.error("Error in getPasswordByEmail:", error);
            return null;
        }
    }

    async getDoctorByEmail(email: string): Promise<Doctor | null> {
        const sql = "SELECT id, name, email, last_name, created_at FROM doctors WHERE email = ?"; // Exclude password
        const params: any[] = [email];
        try {
            const [rows]: any = await query(sql, params);
            if (rows && rows.length > 0) {
                const row = rows[0];
                return new Doctor(
                    row.id.toString(),
                    row.name,
                    row.email, // <-- Map email
                    row.last_name,
                    '', // Password hash not needed here
                    row.created_at
                );
            }
            return null; // Doctor not found
        } catch (error) {
            console.error("Error in getDoctorByEmail:", error);
            return null;
        }
    }

    // --- UPDATED getDoctorById to include email ---
    async getDoctorById(id: string): Promise<Doctor | null> {
        const sql = "SELECT id, name, email, last_name, created_at FROM doctors WHERE id = ?"; // Exclude password
        const params: any[] = [id];
        try {
            const [rows]: any = await query(sql, params);
            if (rows && rows.length > 0) {
                const row = rows[0];
                return new Doctor(
                    row.id.toString(),
                    row.name,
                    row.email, // <-- Map email
                    row.last_name,
                    '',
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