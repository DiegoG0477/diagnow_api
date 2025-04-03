// doctor/application/use-cases/LoginDoctorUseCase.ts
import { DoctorRepository } from "../../domain/DoctorRepository";
import { IEncryptPasswordService } from "../../../shared/domain/services/IEncryptPasswordService";
import { ITokenService } from "../../../shared/application/services/ITokenService";

export class LoginDoctorUseCase {
    constructor(
        readonly doctorRepository: DoctorRepository,
        readonly tokenService: ITokenService,
        readonly encryptService: IEncryptPasswordService
    ) {}

    // --- UPDATED parameters ---
    async run(email: string, password: string): Promise<string | null> {
        try {
            // --- UPDATED to use email ---
            const encodedPassword = await this.doctorRepository.getPasswordByEmail(email);

            if (encodedPassword === null) {
                console.warn(`Login attempt for non-existent doctor email: ${email}`);
                return null; // Doctor not found
            }

            const isPasswordValid = await this.encryptService.verifyPassword(
                password,
                encodedPassword
            );

            if (!isPasswordValid) {
                console.warn(`Invalid password attempt for doctor email: ${email}`);
                return null; // Invalid password
            }

            // --- UPDATED to use email ---
            const doctor = await this.doctorRepository.getDoctorByEmail(email);

            if (!doctor || !doctor.id) {
                console.error(`Could not retrieve doctor details after successful password check for email: ${email}`);
                return null;
            }

            const token = await this.tokenService.generateToken(doctor.id);
            return token;

        } catch (error) {
            console.error("Error in LoginDoctorUseCase:", error);
            return null;
        }
    }
}