// medication/infrastructure/routes/MedicationRouter.ts
import express from 'express';
import { authMiddleware } from '../../../middlewares/authMiddleware'; // Adjust path

// Import medication controllers
import {
    createMedicationController,
    getMedicationsByPrescriptionIdController
} from '../medication.dependencies';

const medicationRouter = express.Router();

// Apply authentication middleware (assuming these actions require login)
medicationRouter.use(authMiddleware);

// POST to create a new medication associated with a prescription
medicationRouter.post('/', (req, res) => createMedicationController.run(req, res));

// GET all medications for a specific prescription ID
medicationRouter.get('/prescription/:prescriptionId', (req, res) => getMedicationsByPrescriptionIdController.run(req, res));

export { medicationRouter };