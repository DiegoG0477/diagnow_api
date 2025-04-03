import { Request, Response } from 'express';
import { DeleteDeviceTokenUseCase } from '../../application/use-cases/DeleteDeviceTokenUseCase';

export class DeleteDeviceTokenController {
    constructor(readonly deleteDeviceTokenUseCase: DeleteDeviceTokenUseCase) {}

    async run(req: Request, res: Response): Promise<Response> {
        const { token } = req.params; // Get token from URL parameter

        if (!token) {
            return res.status(400).send({
                status: 'error',
                message: 'Missing token parameter in URL',
            });
        }

        // Optional Security Check: You might want to ensure the authenticated user
        // is somehow associated with the token being deleted, although deleting
        // by the unique token is often sufficient, especially on logout/uninstall.
        // const patientId = req.user?.id;
        // if (!patientId) { ... return 401 ... }
        // // Add logic here if you need to verify ownership before deleting

        try {
            const success = await this.deleteDeviceTokenUseCase.run(token);

            if (success) {
                // 204 No Content is standard for successful DELETE with no body response
                return res.status(204).send();
            } else {
                 // Use case returned false, likely internal error logged there
                return res.status(500).send({
                    status: 'error',
                    message: 'Failed to delete device token due to an internal error.',
                });
            }
        } catch (error) {
            console.error("Error in DeleteDeviceTokenController:", error);
            return res.status(500).send({
                status: 'error',
                message: 'An unexpected error occurred while deleting the device token.',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
}