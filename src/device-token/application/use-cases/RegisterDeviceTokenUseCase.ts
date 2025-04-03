// --- START OF FILE device-token/application/use-cases/RegisterDeviceTokenUseCase.ts ---

import { DeviceTokenRepository, DeviceType } from "../../domain/DeviceTokenRepository";

export class RegisterDeviceTokenUseCase {
    constructor(private readonly deviceTokenRepository: DeviceTokenRepository) {}

    async run(patientId: string, token: string, deviceType?: DeviceType): Promise<boolean> {
        if (!patientId || !token) {
            console.warn("RegisterDeviceTokenUseCase: Missing patientId or token.");
            return false; // Indicate failure due to missing input
        }

        try {
            // The repository handles the "insert or update" logic
            await this.deviceTokenRepository.saveToken(patientId, token, deviceType);
            console.log(`Device token registered/updated successfully for patient ${patientId}. Token start: ${token.substring(0, 10)}...`);
            return true; // Indicate success
        } catch (error) {
            console.error(`Error in RegisterDeviceTokenUseCase for patient ${patientId}:`, error);
            return false; // Indicate failure
        }
    }
}
// --- END OF FILE device-token/application/use-cases/RegisterDeviceTokenUseCase.ts ---