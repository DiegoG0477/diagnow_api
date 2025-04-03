import { query } from "../../../shared/database/mysqlAdapter"; // Ajusta la ruta
import { DeviceTokenRepository, DeviceType } from "../../domain/DeviceTokenRepository";

export class MysqlDeviceTokenRepository implements DeviceTokenRepository {

    async saveToken(patientId: string, token: string, deviceType?: DeviceType): Promise<void> {
        // Use INSERT ... ON DUPLICATE KEY UPDATE to handle both new tokens
        // and associating an existing token with a (potentially new) user,
        // or just updating the updated_at timestamp.
        const sql = `
            INSERT INTO device_tokens (patient_id, token, device_type)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE patient_id = VALUES(patient_id), device_type = VALUES(device_type), updated_at = CURRENT_TIMESTAMP
        `;
        // Convert patientId string to number for the database
        const params: any[] = [parseInt(patientId, 10), token, deviceType ?? null];

        try {
            await query(sql, params);
        } catch (error: any) {
            console.error(`Error saving device token for patient ${patientId}:`, error);
            // Re-throw the error to be caught by the use case
            throw new Error(`Database error saving token: ${error.message}`);
        }
    }

    async getTokensByPatientId(patientId: string): Promise<string[] | null> {
        const sql = "SELECT token FROM device_tokens WHERE patient_id = ?";
        const params: any[] = [parseInt(patientId, 10)]; // Convert to number

        try {
            const [rows]: any = await query(sql, params);
            if (!rows) {
                 // Should not happen with the query function returning [rows, fields]
                 // but good to check. If it happens, likely a DB connection issue upstream.
                console.error(`Query for tokens for patient ${patientId} returned undefined rows.`);
                return null; // Indicate DB error state
            }
             // If rows is an empty array, map returns empty array, which is correct (no tokens found)
            const tokens: string[] = rows.map((row: any) => row.token);
            return tokens;
        } catch (error: any) {
            console.error(`Error getting tokens for patient ${patientId}:`, error);
            return null; // Indicate failure to retrieve (DB error)
        }
    }

    async deleteToken(token: string): Promise<void> {
        const sql = "DELETE FROM device_tokens WHERE token = ?";
        const params: any[] = [token];

        try {
            const [result]: any = await query(sql, params);
             if (result.affectedRows === 0) {
                 // Optional: Log if you try to delete a token that doesn't exist
                 console.warn(`Attempted to delete non-existent token: ${token.substring(0, 10)}...`);
             }
        } catch (error: any) {
            console.error(`Error deleting device token ${token.substring(0, 10)}...:`, error);
            // Re-throw
            throw new Error(`Database error deleting token: ${error.message}`);
        }
    }
}