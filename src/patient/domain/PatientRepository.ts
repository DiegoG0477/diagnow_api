// patient/domain/PatientRepository.ts
import { Patient } from "./entities/Patient";

export interface PatientRepository {
    registerPatient(patient: Patient): Promise<Patient | null>;
    getPatients(): Promise<Patient[] | null>;
    getPassword(email: string): Promise<string | null>;
    changePassword(email: string, password: string): Promise<boolean | null>; // Changed ID to email for consistency with user feature
    getPatientByEmail(email: string): Promise<Patient | null>;
    getPatientById(id: string): Promise<Patient | null>; // Added for potential future use
}