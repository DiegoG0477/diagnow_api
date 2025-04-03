import express from "express";
import morgan from "morgan";
import { Signale } from "signale";
import dotenv from "dotenv";

import { doctorAuthRouter } from "./doctor/infrastructure/routes/DoctorAuthRouter";
import { doctorRouter } from "./doctor/infrastructure/routes/DoctorRouter";
import { patientAuthRouter } from "./patient/infrastructure/routes/PatientAuthRouter";
import { patientRouter } from "./patient/infrastructure/routes/PatientRouter";
import { prescriptionRouter } from "./prescription/infrastructure/routes/PrescriptionRouter";

dotenv.config();

const PORT = process.env.SERVER_PORT ?? 8080;

const app = express();

const signale = new Signale();

app.use(express.json());
app.use(morgan("dev"));
app.use("/patients", patientAuthRouter);
app.use("/patients", patientRouter);
app.use("/doctors", doctorAuthRouter);
app.use("/doctors", doctorRouter);
app.use("/prescriptions", prescriptionRouter);

app.listen(PORT, async () => {
    signale.success("Server online in port " + PORT);
});