// prescription/infrastructure/controllers/GetPrescriptionsByPatientIdController.ts
import { Request, Response } from 'express';
import { GetPrescriptionsByPatientIdUseCase } from '../../application/use-cases/GetPrescriptionsByPatientIdUseCase';

export class GetPrescriptionsByPatientIdController {
    constructor(readonly getPrescriptionsByPatientIdUseCase: GetPrescriptionsByPatientIdUseCase) {}

    async run(req: Request, res: Response): Promise<Response> {
        const patientId = req.params.patientId;

        if (!patientId) {
            return res.status(400).send({
                status: 'error',
                message: 'Missing patientId parameter in URL',
            });
        }

        try {
            const prescriptions = await this.getPrescriptionsByPatientIdUseCase.run(patientId);

            if (prescriptions === null) {
                 // Use case returned null -> Likely internal error
                 return res.status(500).send({
                    status: 'error',
                    message: `Failed to retrieve prescriptions for patientId ${patientId}`,
                 });
            }

            // If prescriptions is an empty array [], it means none found, which is a valid success case
             return res.status(200).send({
                 status: 'success',
                 message: `Prescriptions retrieved successfully for patientId ${patientId}`,
                 data: {
                     prescriptions, // Will be an array (possibly empty)
                 },
             });

        } catch (error) {
            console.error(`Error in GetPrescriptionsByPatientIdController for patientId ${patientId}:`, error);
            return res.status(500).send({
                status: 'error',
                message: 'An unexpected error occurred while retrieving prescriptions',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
}