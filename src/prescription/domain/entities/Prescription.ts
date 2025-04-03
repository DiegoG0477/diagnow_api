// prescription/domain/entities/Prescription.ts
export class Prescription {
    constructor(
        readonly id: string, // Keep ID as string for consistency
        readonly patientId: string, // Corresponds to patient_id
        readonly diagnosis: string | null,
        readonly notes: string | null,
        readonly createdAt?: Date // Optional, based on schema default
    ) {}
}