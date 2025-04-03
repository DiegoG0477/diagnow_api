import { Doctor } from "../../domain/entities/Doctor";
import { DoctorRepository } from "../../domain/DoctorRepository";

export class GetDoctorByEmailUseCase {
    constructor(
        readonly doctorRepository: DoctorRepository
    ) {}

    async run(email: string): Promise<Doctor | null> {
        try {
            if (!email) {
                console.warn("GetDoctorByEmailUseCase called without email.");
                return null;
            }
            const doctor = await this.doctorRepository.getDoctorByEmail(email);
            return doctor; // Repository handles not found case by returning null
        } catch (error) {
            console.error(`Error in GetDoctorByEmailUseCase for email ${email}:`, error);
            return null;
        }
    }
}