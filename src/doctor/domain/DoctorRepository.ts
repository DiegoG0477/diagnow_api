// doctor/domain/DoctorRepository.ts
import { Doctor } from "./entities/Doctor";

export interface DoctorRepository {
    registerDoctor(doctor: Doctor): Promise<Doctor | null>;
    // --- UPDATED/ADDED Methods ---
    getPasswordByEmail(email: string): Promise<string | null>; // <-- Changed from name/lastName
    getDoctorByEmail(email: string): Promise<Doctor | null>;    // <-- Added for lookup
    getDoctorById(id: string): Promise<Doctor | null>;
}