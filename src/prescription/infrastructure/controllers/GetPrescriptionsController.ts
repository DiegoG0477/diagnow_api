// prescription/infrastructure/controllers/GetPrescriptionsController.ts
import { Request, Response } from 'express';
import { GetPrescriptionsUseCase } from '../../application/use-cases/GetPrescriptionsUseCase';

export class GetPrescriptionsController {
    constructor(readonly getPrescriptionsUseCase: GetPrescriptionsUseCase) {}

    async run(req: Request, res: Response): Promise<Response> {
        try {
            const prescriptions = await this.getPrescriptionsUseCase.run();

            if (prescriptions) {
                return res.status(200).send({
                    status: 'success',
                    message: 'Prescriptions retrieved successfully',
                    data: {
                        prescriptions,
                    },
                });
            } else {
                // Use case returning null likely means a repository/DB error
                return res.status(500).send({
                    status: 'error',
                    message: 'Failed to retrieve prescriptions',
                });
            }
        } catch (error) {
            console.error("Error in GetPrescriptionsController:", error);
            return res.status(500).send({
                status: 'error',
                message: 'An unexpected error occurred while retrieving prescriptions',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
}