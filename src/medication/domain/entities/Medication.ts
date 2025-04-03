// medication/domain/entities/Medication.ts
export class Medication {
    constructor(
        readonly id: string, // Keep ID as string
        readonly prescriptionId: string, // Corresponds to prescription_id
        readonly name: string | null,
        readonly dosage: string | null,
        readonly frequency: number | null, // e.g., times per day
        readonly days: number | null,      // e.g., duration
        readonly administrationRoute: string | null, // e.g., 'Oral', 'Topical'
        readonly instructions: string | null,
        readonly createdAt?: Date // Optional, from DB default
    ) {}
}