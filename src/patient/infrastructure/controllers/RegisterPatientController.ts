// patient/infrastructure/controllers/RegisterPatientController.ts
import { Request, Response } from 'express';
import { RegisterPatientUseCase } from '../../application/use-cases/RegisterPatientUseCase';
import { Patient } from '../../domain/entities/Patient'; // Import Patient if needed for response typing

export class RegisterPatientController {
    constructor(readonly registerPatientUseCase: RegisterPatientUseCase) {}

    async run(req: Request, res: Response): Promise<Response> {
        const data = req.body;
        try {
            const patient = await this.registerPatientUseCase.run(
                data.email,
                data.password,
                data.name ?? null, // Use nullish coalescing for optional fields
                data.last_name ?? null,
                data.age ? parseInt(data.age) : null, // Ensure correct types
                data.height ? parseInt(data.height) : null,
                data.weight ? parseInt(data.weight) : null
            );

            console.log('Datos de registro paciente:', req.body);

            if (patient) {
                // Exclude password from response
                const patientResponse: Omit<Patient, 'password'> = {
                     id: patient.id,
                     email: patient.email,
                     name: patient.name,
                     last_name: patient.last_name,
                     age: patient.age,
                     height: patient.height,
                     weight: patient.weight,
                     created_at: patient.created_at
                 };

                return res.status(201).send({
                    status: 'success',
                    message: 'Patient registered successfully',
                    data: {
                        patient: patientResponse,
                    },
                });
            } else {
                // More specific error? Maybe check if patient was null due to duplicate email
                return res.status(400).send({
                    status: 'error',
                    message: 'Patient not registered (possibly duplicate email or server error)',
                });
            }
        } catch (error) {
            console.error("Error in RegisterPatientController:", error)
            // Determine if it's a known error (like validation) vs internal server error
            return res.status(500).send({ // Use 500 for unexpected errors
                status: 'error',
                message: 'An unexpected error occurred during registration',
                error: error instanceof Error ? error.message : 'Unknown error', // Avoid sending full error object in production
            });
        }
    }
}