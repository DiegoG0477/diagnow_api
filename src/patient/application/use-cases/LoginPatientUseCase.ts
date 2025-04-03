// patient/application/use-cases/LoginPatientUseCase.ts
import { PatientRepository } from "../../domain/PatientRepository";
import { IEncryptPasswordService } from "../../../shared/domain/services/IEncryptPasswordService";
import { ITokenService } from "../../../shared/application/services/ITokenService";

export class LoginPatientUseCase {
    constructor(
        readonly patientRepository: PatientRepository,
        readonly tokenService: ITokenService,
        readonly encryptService: IEncryptPasswordService
    ) {}

    async run(email: string, password: string): Promise<string | null> {
        try {
            const encodedPassword = await this.patientRepository.getPassword(email);
            if (encodedPassword === null) {
                console.warn(`Login attempt for non-existent patient: ${email}`);
                return null; // Patient not found
            }

            const isPasswordValid = await this.encryptService.verifyPassword(
                password,
                encodedPassword
            );

            if (!isPasswordValid) {
                console.warn(`Invalid password attempt for patient: ${email}`);
                return null; // Invalid password
            }

            // Password is valid, get patient details to include ID in token
            const patient = await this.patientRepository.getPatientByEmail(email);
            if (!patient || !patient.id) {
                // This shouldn't happen if getPassword returned a value, but check defensively
                console.error(`Could not retrieve patient details after successful password check for email: ${email}`);
                return null;
            }

            const token = await this.tokenService.generateToken(patient.id);

            return token;
        } catch (error) {
            console.error("Error in LoginPatientUseCase:", error);
            return null;
        }
    }
}