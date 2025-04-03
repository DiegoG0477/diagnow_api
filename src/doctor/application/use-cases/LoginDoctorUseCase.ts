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

    async run(name: string, lastName: string, password: string): Promise<string | null> {
        try {
            // Get password hash using name and lastName (potential ambiguity)
            const encodedPassword = await this.doctorRepository.getPasswordByNameAndLastName(name, lastName);

            if (encodedPassword === null) {
                console.warn(`Login attempt for non-existent or ambiguous doctor: ${name} ${lastName}`);
                return null; // Doctor not found or name/lastName combination not unique/found
            }

            const isPasswordValid = await this.encryptService.verifyPassword(
                password,
                encodedPassword
            );

            if (!isPasswordValid) {
                console.warn(`Invalid password attempt for doctor: ${name} ${lastName}`);
                return null; // Invalid password
            }

            // Password is valid, get doctor details to obtain the ID for the token
            const doctor = await this.doctorRepository.getDoctorByNameAndLastName(name, lastName);

            if (!doctor || !doctor.id) {
                // This shouldn't happen if getPasswordByNameAndLastName returned a value, but check defensively
                console.error(`Could not retrieve doctor details after successful password check for: ${name} ${lastName}`);
                return null;
            }

            // Generate token using the doctor's unique ID
            const token = await this.tokenService.generateToken(doctor.id);

            return token;

        } catch (error) {
            console.error("Error in LoginDoctorUseCase:", error);
            return null;
        }
    }
}