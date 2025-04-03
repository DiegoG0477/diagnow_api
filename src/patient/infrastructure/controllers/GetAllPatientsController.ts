// patient/infrastructure/controllers/GetAllPatientsController.ts
import { Request, Response } from 'express';
import { GetAllPatientsUseCase } from '../../application/use-cases/GetAllPatientsUseCase';
import { Patient } from '../../domain/entities/Patient'; // Import Patient if needed for response typing

export class GetAllPatientsController {
    constructor(readonly getAllPatientsUseCase: GetAllPatientsUseCase) {}

    async run(req: Request, res: Response): Promise<Response> {
        try {
            const patients = await this.getAllPatientsUseCase.run();

            if (patients) {
                 // Ensure password is not included (already handled by repository in this case)
                 const patientsResponse: Omit<Patient, 'password'>[] = patients.map(p => ({
                    id: p.id,
                    email: p.email,
                    name: p.name,
                    last_name: p.last_name,
                    age: p.age,
                    height: p.height,
                    weight: p.weight,
                    created_at: p.created_at
                }));

                return res.status(200).send({
                    status: 'success',
                    message: 'Patients retrieved successfully',
                    data: {
                        patients: patientsResponse,
                    },
                });
            } else {
                // Use case returning null likely indicates an internal error
                 return res.status(500).send({
                    status: 'error',
                    message: 'Failed to retrieve patients',
                });
            }
        } catch (error) {
            console.error("Error in GetAllPatientsController:", error);
            return res.status(500).send({ // Use 500 for unexpected errors
                status: 'error',
                message: 'An unexpected error occurred while retrieving patients',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
}