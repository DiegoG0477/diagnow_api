import { Request, Response } from 'express';
import { GetDoctorByEmailUseCase } from '../../application/use-cases/GetDoctorByEmailUseCase';
import { Doctor } from '../../domain/entities/Doctor'; // For response type hint

export class GetDoctorByEmailController {
    constructor(
        readonly getDoctorByEmailUseCase: GetDoctorByEmailUseCase
    ) {}

    async run(req: Request, res: Response): Promise<Response> {
        const email = req.params.email; // Get email from URL parameter

        if (!email) {
            return res.status(400).send({
                status: 'error',
                message: 'Missing email parameter in URL',
            });
        }

        try {
            const doctor = await this.getDoctorByEmailUseCase.run(email);

            if (doctor) {
                // Exclude password from response
                const doctorResponse: Omit<Doctor, 'password'> = {
                    id: doctor.id,
                    name: doctor.name,
                    email: doctor.email,
                    last_name: doctor.last_name,
                    created_at: doctor.created_at
                };
                return res.status(200).send({
                    status: 'success',
                    message: 'Doctor retrieved successfully',
                    data: { doctor: doctorResponse },
                });
            } else {
                // Use case returns null if not found
                return res.status(404).send({
                    status: 'error',
                    message: `Doctor with email ${email} not found`,
                });
            }
        } catch (error) {
            console.error(`Error in GetDoctorByEmailController for email ${email}:`, error);
            return res.status(500).send({
                status: 'error',
                message: 'An unexpected error occurred while retrieving the doctor',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
}