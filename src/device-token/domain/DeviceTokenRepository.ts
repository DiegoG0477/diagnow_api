// --- START OF FILE device-token/domain/DeviceTokenRepository.ts ---

export type DeviceType = 'android' | 'ios' | 'web';

export interface DeviceTokenRepository {
    /**
     * Saves or updates a device token for a given patient.
     * If the token already exists, it updates the patient_id association and updated_at.
     * @param patientId The ID of the patient (as string, consistent with other features).
     * @param token The FCM device token.
     * @param deviceType Optional type of the device.
     * @returns Promise<void> Resolves on success, rejects on error.
     */
    saveToken(patientId: string, token: string, deviceType?: DeviceType): Promise<void>;

    /**
     * Retrieves all active FCM tokens associated with a patient.
     * @param patientId The ID of the patient.
     * @returns Promise<string[]> An array of token strings. Returns empty array if none found. Returns null on database error.
     */
    getTokensByPatientId(patientId: string): Promise<string[] | null>;

    /**
     * Deletes a specific device token from the database.
     * Typically called when a user logs out or the token becomes invalid.
     * @param token The FCM device token to delete.
     * @returns Promise<void> Resolves on success, rejects on error.
     */
    deleteToken(token: string): Promise<void>;
}
// --- END OF FILE device-token/domain/DeviceTokenRepository.ts ---