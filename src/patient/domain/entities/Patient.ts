// patient/domain/entities/Patient.ts
export class Patient {
    constructor(
        readonly id: string, // Keep ID as string for consistency with User domain, repository will handle conversion
        readonly email: string,
        readonly password: string, // Password hash
        readonly name: string | null,
        readonly last_name: string | null,
        readonly age: number | null,
        readonly height: number | null, // Assuming cm
        readonly weight: number | null, // Assuming kg
        readonly created_at?: Date // Optional, based on schema default
    ) {}
}