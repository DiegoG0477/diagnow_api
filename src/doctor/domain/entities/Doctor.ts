// doctor/domain/entities/Doctor.ts
export class Doctor {
    constructor(
        readonly id: string, // Keep ID as string for consistency
        readonly name: string | null,
        readonly last_name: string | null,
        readonly password: string, // Password hash
        readonly created_at?: Date // Optional, based on schema default
    ) {}
}