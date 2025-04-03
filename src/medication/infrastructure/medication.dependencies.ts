// medication/infrastructure/medication.dependencies.ts

// Use Cases
import { CreateMedicationUseCase } from "../application/use-cases/CreateMedicationUseCase";
import { GetMedicationsByPrescriptionIdUseCase } from "../application/use-cases/GetMedicationsByPrescriptionIdUseCase";

// Controllers
import { CreateMedicationController } from "./controllers/CreateMedicationController";
import { GetMedicationsByPrescriptionIdController } from "./controllers/GetMedicationsByPrescriptionIdController";

// Repository Implementation
import { MysqlMedicationRepository } from "./adapters//MysqlMedicationRepository";

// Import *instance* of Prescription Repository dependency
// Make sure mysqlPrescriptionRepository is exported from prescription.dependencies.ts
import { mysqlPrescriptionRepository } from "../../prescription/infrastructure/prescription.dependencies";

// Instantiate Medication Repository
export const mysqlMedicationRepository = new MysqlMedicationRepository();

// Instantiate Use Cases (Inject dependencies)
export const createMedicationUseCase = new CreateMedicationUseCase(
    mysqlMedicationRepository
);

export const getMedicationsByPrescriptionIdUseCase = new GetMedicationsByPrescriptionIdUseCase(
    mysqlMedicationRepository,
    mysqlPrescriptionRepository // Inject the PRESCRIPTION repository instance here
);

// Instantiate Controllers
export const createMedicationController = new CreateMedicationController(createMedicationUseCase);
export const getMedicationsByPrescriptionIdController = new GetMedicationsByPrescriptionIdController(getMedicationsByPrescriptionIdUseCase);