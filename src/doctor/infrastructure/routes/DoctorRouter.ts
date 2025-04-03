// doctor/infrastructure/routes/DoctorRouter.ts
import express from 'express';
// Import authMiddleware if any doctor routes need protection later
// import { authMiddleware } from '../../../middlewares/authMiddleware';
import { registerDoctorController } from '../doctor.dependencies';

const doctorRouter = express.Router();

// Public route for doctor registration
doctorRouter.post('/register', (req, res) => registerDoctorController.run(req, res));

// Add other doctor-specific routes here if needed in the future.
// Example (if you add a GetDoctorById use case):
// import { getDoctorByIdController } from '../doctor.dependencies';
// doctorRouter.get('/:id', authMiddleware, (req, res) => getDoctorByIdController.run(req, res));


export { doctorRouter };