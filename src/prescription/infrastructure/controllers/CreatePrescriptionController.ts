// prescription/infrastructure/controllers/CreatePrescriptionController.ts
import { Request, Response } from 'express';
import { CreatePrescriptionUseCase } from '../../application/use-cases/CreatePrescriptionUseCase';
import { Prescription } from '../../domain/entities/Prescription';

export class CreatePrescriptionController {
    constructor(readonly createPrescriptionUseCase: CreatePrescriptionUseCase) {}

    async run(req: Request, res: Response): Promise<Response> {
        const { patientId, diagnosis, notes } = req.body;

        // Basic validation
        if (!patientId) {
            return res.status(400).send({
                status: 'error',
                message: 'Missing required field: patientId',
            });
        }

        try {
            const prescription = await this.createPrescriptionUseCase.run(
                patientId.toString(), // Ensure it's a string for the use case
                diagnosis ?? null,    // Handle optional fields
                notes ?? null
            );

            if (prescription) {
                 // Return the created prescription data
                 const responseData: Prescription = {
                     id: prescription.id,
                     patientId: prescription.patientId,
                     diagnosis: prescription.diagnosis,
                     notes: prescription.notes,
                     createdAt: prescription.createdAt // May be undefined if not fetched back
                 }

                return res.status(201).send({ // 201 Created
                    status: 'success',
                    message: 'Prescription created successfully (notification attempt initiated)',
                    data: {
                        prescription: responseData,
                    },
                });
            } else {
                return res.status(400).send({ // Or 500 if it's likely a server/DB issue
                    status: 'error',
                    message: 'Prescription not created (possibly invalid patientId or database error)',
                });
            }
        } catch (error) {
            console.error("Error in CreatePrescriptionController:", error);
            return res.status(500).send({ // 500 Internal Server Error
                status: 'error',
                message: 'An unexpected error occurred while creating the prescription',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
}