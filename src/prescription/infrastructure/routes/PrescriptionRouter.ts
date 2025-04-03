// prescription/infrastructure/routes/PrescriptionRouter.ts
import express from 'express';
import { authMiddleware } from '../../../middlewares/authMiddleware'; // Adjust path as needed

// Import prescription-specific controllers
import {
    createPrescriptionController,
    getPrescriptionsController,
    getPrescriptionsByPatientIdController,
    getPrescriptionByIdController
} from '../prescription.dependencies';

const prescriptionRouter = express.Router();

// Apply auth middleware to all prescription routes (assuming only logged-in users can interact)
prescriptionRouter.use(authMiddleware);

// GET all prescriptions (e.g., for admin or specific roles - needs authorization check)
prescriptionRouter.get('/', (req, res) => getPrescriptionsController.run(req, res));

// GET prescriptions for a specific patient
prescriptionRouter.get('/patient/:patientId', (req, res) => getPrescriptionsByPatientIdController.run(req, res));

prescriptionRouter.get('/:id', (req, res) => getPrescriptionByIdController.run(req, res));

// POST to create a new prescription for a patient
prescriptionRouter.post('/', (req, res) => createPrescriptionController.run(req, res));


export { prescriptionRouter };