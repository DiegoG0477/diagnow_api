// patient/application/use-cases/GetAllPatientsUseCase.ts
import { Patient } from "../../domain/entities/Patient";
import { PatientRepository } from "../../domain/PatientRepository";

export class GetAllPatientsUseCase {
    constructor(readonly patientRepository: PatientRepository) {}

    async run(): Promise<Patient[] | null> {
        try {
            const patients = await this.patientRepository.getPatients();
            return patients;
        } catch (error) {
            console.error("Error in GetAllPatientsUseCase:", error);
            return null;
        }
    }
}