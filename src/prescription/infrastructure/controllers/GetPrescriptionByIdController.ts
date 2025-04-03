// prescription/infrastructure/controllers/GetPrescriptionByIdController.ts
import { Request, Response } from 'express';
import { GetPrescriptionByIdUseCase } from '../../application/use-cases/GetPrescriptionByIdUseCase';

export class GetPrescriptionByIdController {
    constructor(
        readonly getPrescriptionByIdUseCase: GetPrescriptionByIdUseCase
    ) {}

    async run(req: Request, res: Response): Promise<Response> {
        const prescriptionId = req.params.id; // Get ID from URL parameter

        if (!prescriptionId) {
            return res.status(400).send({
                status: 'error',
                message: 'Missing prescription ID parameter in URL',
            });
        }

        try {
            const prescription = await this.getPrescriptionByIdUseCase.run(prescriptionId);

            if (prescription) {
                // Prescription found, return 200 OK
                return res.status(200).send({
                    status: 'success',
                    message: 'Prescription retrieved successfully',
                    data: {
                        prescription,
                    },
                });
            } else {
                // Use case returned null (not found or internal error occurred)
                // Log within use case/repo should differentiate, return 404 for not found
                return res.status(404).send({
                    status: 'error',
                    message: `Prescription with ID ${prescriptionId} not found`,
                });
            }
        } catch (error) {
            // Catch unexpected errors from the use case/controller execution
            console.error(`Error in GetPrescriptionByIdController for ID ${prescriptionId}:`, error);
            return res.status(500).send({
                status: 'error',
                message: 'An unexpected error occurred while retrieving the prescription',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
}