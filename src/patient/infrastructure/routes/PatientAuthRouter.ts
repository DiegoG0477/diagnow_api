// patient/infrastructure/routes/PatientAuthRouter.ts
import express from "express";

// Import the specific login controller for patients
import { loginPatientController } from "../patient.dependencies";

const patientAuthRouter = express.Router();

// Define a specific login route for patients, e.g., /auth/patient/login
patientAuthRouter.post("/auth/login", async (req, res) => {
    // Consider adding rate limiting or other security middleware here
    await loginPatientController.run(req, res);
});

// Export the router
export { patientAuthRouter };