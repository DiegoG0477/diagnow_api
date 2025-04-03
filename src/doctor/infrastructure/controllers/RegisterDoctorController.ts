// doctor/infrastructure/controllers/RegisterDoctorController.ts
import { Request, Response } from 'express';
import { RegisterDoctorUseCase } from '../../application/use-cases/RegisterDoctorUseCase';
import { Doctor } from '../../domain/entities/Doctor'; // For response type hint

export class RegisterDoctorController {
    constructor(readonly registerDoctorUseCase: RegisterDoctorUseCase) {}

    async run(req: Request, res: Response): Promise<Response> {
        const { name, lastName, password } = req.body;

        // Basic validation
        if (!name || !lastName || !password) {
            return res.status(400).send({
                status: 'error',
                message: 'Missing required fields: name, lastName, password',
            });
        }

        try {
            const doctor = await this.registerDoctorUseCase.run(
                name,
                lastName, // Ensure correct mapping if request body uses different casing (e.g., last_name)
                password
            );

            console.log('Datos de registro doctor:', req.body);

            if (doctor) {
                 // Exclude password from the response
                 const doctorResponse: Omit<Doctor, 'password'> = {
                    id: doctor.id,
                    name: doctor.name,
                    last_name: doctor.last_name,
                    created_at: doctor.created_at
                };

                return res.status(201).send({
                    status: 'success',
                    message: 'Doctor registered successfully',
                    data: {
                        doctor: doctorResponse,
                    },
                });
            } else {
                return res.status(400).send({ // Or 500 if it's likely a server/DB issue
                    status: 'error',
                    message: 'Doctor not registered (possibly due to database error)',
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