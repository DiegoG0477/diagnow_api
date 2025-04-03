// prescription/domain/PrescriptionRepository.ts
import { Prescription } from "./entities/Prescription";

export interface PrescriptionRepository {
    createPrescription(prescription: Prescription): Promise<Prescription | null>;
    getPrescriptions(): Promise<Prescription[] | null>;
    getPrescriptionsByPatientId(patientId: string): Promise<Prescription[] | null>;
    getPrescriptionById(id: string): Promise<Prescription | null>;
}