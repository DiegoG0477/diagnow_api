// doctor/domain/entities/Doctor.ts
export class Doctor {
    constructor(
        readonly id: string,
        readonly name: string | null,
        readonly email: string, // <-- ADDED email
        readonly last_name: string | null,
        readonly password: string, // Password hash
        readonly created_at?: Date
    ) {}
}