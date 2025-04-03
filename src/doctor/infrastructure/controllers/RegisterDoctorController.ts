import { Request, Response } from 'express';
import { RegisterDoctorUseCase } from '../../application/use-cases/RegisterDoctorUseCase';
import { Doctor } from '../../domain/entities/Doctor';

export class RegisterDoctorController {
    constructor(readonly registerDoctorUseCase: RegisterDoctorUseCase) {}

    async run(req: Request, res: Response): Promise<Response> {
        // --- UPDATED: Extract email ---
        const { name, email, lastName, password } = req.body;

        // --- UPDATED: Basic validation including email ---
        if (!email || !password) { // Make name/lastName optional if desired
            return res.status(400).send({
                status: 'error',
                message: 'Missing required fields: email, password (name/lastName optional)',
            });
        }

        try {
            const doctor = await this.registerDoctorUseCase.run(
                name ?? null, // Handle optional fields
                email,        // <-- Pass email
                lastName ?? null,
                password
            );

            console.log('Datos de registro doctor:', { name, email, lastName }); // Don't log password

            if (doctor) {
                 const doctorResponse: Omit<Doctor, 'password'> = {
                    id: doctor.id,
                    name: doctor.name,
                    email: doctor.email, // <-- Include email
                    last_name: doctor.last_name,
                    created_at: doctor.created_at
                };
                return res.status(201).send({
                    status: 'success',
                    message: 'Doctor registered successfully',
                    data: { doctor: doctorResponse },
                });
            } else {
                // Use case returned null, likely duplicate email
                return res.status(409).send({ // 409 Conflict is suitable for duplicates
                    status: 'error',
                    message: 'Doctor not registered (email may already exist)',
                });
            }
        } catch (error) {
            console.error("Error in RegisterDoctorController:", error);
            return res.status(500).send({
                status: 'error',
                message: 'An unexpected error occurred during doctor registration',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
}