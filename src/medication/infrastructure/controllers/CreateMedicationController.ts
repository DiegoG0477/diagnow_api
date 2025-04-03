// medication/infrastructure/controllers/CreateMedicationController.ts
import { Request, Response } from 'express';
import { CreateMedicationUseCase } from '../../application/use-cases/CreateMedicationUseCase';
import { Medication } from '../../domain/entities/Medication'; // For response type hint

export class CreateMedicationController {
    constructor(readonly createMedicationUseCase: CreateMedicationUseCase) {}

    async run(req: Request, res: Response): Promise<Response> {
        const {
            prescriptionId, name, dosage, frequency, days,
            administrationRoute, instructions
        } = req.body;

        // Basic validation
        if (!prescriptionId || !name) { // Add other required field checks as needed
            return res.status(400).send({
                status: 'error',
                message: 'Missing required fields (prescriptionId, name, etc.)',
            });
        }

        try {
            // Convert numeric fields from string if necessary (Express body parser might handle this)
             const freqNum = frequency ? parseInt(frequency, 10) : 0;
             const daysNum = days ? parseInt(days, 10) : 0;

             if (frequency && isNaN(freqNum)) {
                 return res.status(400).send({ status: 'error', message: 'Invalid frequency value' });
             }
             if (days && isNaN(daysNum)) {
                  return res.status(400).send({ status: 'error', message: 'Invalid days value' });
             }

            const medication = await this.createMedicationUseCase.run(
                prescriptionId.toString(),
                name,
                dosage ?? null,
                freqNum,
                daysNum,
                administrationRoute ?? null,
                instructions ?? null
            );

            if (medication) {
                // Return the created medication data
                const responseData: Medication = {
                    id: medication.id,
                    prescriptionId: medication.prescriptionId,
                    name: medication.name,
                    dosage: medication.dosage,
                    frequency: medication.frequency,
                    days: medication.days,
                    administrationRoute: medication.administrationRoute,
                    instructions: medication.instructions,
                    createdAt: medication.createdAt // May be undefined if not fetched back
                };

                return res.status(201).send({ // 201 Created
                    status: 'success',
                    message: 'Medication created successfully',
                    data: {
                        medication: responseData,
                    },
                });
            } else {
                // More specific error checking (e.g., invalid prescriptionId foreign key)
                return res.status(400).send({ // Or 500 if DB error
                    status: 'error',
                    message: 'Medication not created (possibly invalid prescriptionId or database error)',
                });
            }
        } catch (error) {
            console.error("Error in CreateMedicationController:", error);
            return res.status(500).send({
                status: 'error',
                message: 'An unexpected error occurred while creating the medication',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
}