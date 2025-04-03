// doctor/infrastructure/routes/DoctorAuthRouter.ts
import express from "express";
import { loginDoctorController } from "../doctor.dependencies";

const doctorAuthRouter = express.Router();

// Route for doctor login
doctorAuthRouter.post("/auth/login", (req, res) => {
    loginDoctorController.run(req, res);
});

export { doctorAuthRouter };