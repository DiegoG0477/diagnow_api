// doctor/domain/DoctorRepository.ts
import { Doctor } from "./entities/Doctor";

export interface DoctorRepository {
    registerDoctor(doctor: Doctor): Promise<Doctor | null>;
    // Login requires identifying the doctor. Since there's no unique email/username,
    // we'll use name and last_name, acknowledging potential ambiguity if names are not unique.
    getPasswordByNameAndLastName(name: string, lastName: string): Promise<string | null>;
    getDoctorByNameAndLastName(name: string, lastName: string): Promise<Doctor | null>;
    // Optional: Get by ID might be useful later
    getDoctorById(id: string): Promise<Doctor | null>;
}