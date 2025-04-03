// patient/infrastructure/routes/PatientRouter.ts
import express from 'express';
import { authMiddleware } from '../../../middlewares/authMiddleware'; // Adjust path as needed

// Import patient-specific controllers from patient dependencies
import {
    registerPatientController,
    getAllPatientsController
} from '../patient.dependencies';

const patientRouter = express.Router();

// Public route for registration
patientRouter.post('/register', (req, res) => registerPatientController.run(req, res));

// Protected routes (require authentication via authMiddleware)
// NOTE: Adjust authorization logic within authMiddleware or specific controllers if needed
//       (e.g., only admin can get all patients, patient can only change their own password)

// Get all patients (Protected)
patientRouter.get('/', authMiddleware, (req, res) => getAllPatientsController.run(req, res));

// Maybe add routes for getting a specific patient by ID (protected)
// patientRouter.get('/:id', authMiddleware, (req, res) => getPatientByIdController.run(req, res)); // Requires GetPatientByIdUseCase/Controller

// Maybe add routes for updating patient details (protected)
// patientRouter.put('/:id', authMiddleware, (req, res) => updatePatientController.run(req, res)); // Requires UpdatePatientUseCase/Controller


export { patientRouter };