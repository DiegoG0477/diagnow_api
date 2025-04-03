// medication/infrastructure/controllers/GetMedicationsByPrescriptionIdController.ts
import { Request, Response } from 'express';
import { GetMedicationsByPrescriptionIdUseCase, MedicationsByPrescriptionResponse } from '../../application/use-cases/GetMedicationsByPrescriptionIdUseCase';

export class GetMedicationsByPrescriptionIdController {
    constructor(readonly getMedicationsUseCase: GetMedicationsByPrescriptionIdUseCase) {}

    async run(req: Request, res: Response): Promise<Response> {
        const prescriptionId = req.params.prescriptionId;

        if (!prescriptionId) {
            return res.status(400).send({
                status: 'error',
                message: 'Missing prescriptionId parameter in URL',
            });
        }

        try {
            const result: MedicationsByPrescriptionResponse | null = await this.getMedicationsUseCase.run(prescriptionId);

            if (result === null) {
                // Use case returning null implies an internal error during fetching
                return res.status(500).send({
                    status: 'error',
                    message: `Failed to retrieve medication data for prescriptionId ${prescriptionId}`,
                });
            }

            // Success case: result contains medications and potentially the prescription date
            return res.status(200).send({
                status: 'success',
                message: `Medications retrieved successfully for prescriptionId ${prescriptionId}`,
                data: {
                    prescription_created_at: result.prescriptionCreatedAt, // Include the date here
                    medications: result.medications,
                },
            });

        } catch (error) {
            console.error(`Error in GetMedicationsByPrescriptionIdController for prescriptionId ${prescriptionId}:`, error);
            return res.status(500).send({
                status: 'error',
                message: 'An unexpected error occurred while retrieving medications',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
}