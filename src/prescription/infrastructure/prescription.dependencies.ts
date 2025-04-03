// prescription/infrastructure/prescription.dependencies.ts

// Use Cases
import { CreatePrescriptionUseCase } from "../application/use-cases/CreatePrescriptionUseCase";
import { GetPrescriptionsUseCase } from "../application/use-cases/GetPrescriptionsUseCase";
import { GetPrescriptionsByPatientIdUseCase } from "../application/use-cases/GetPrescriptionsByPatientIdUseCase";
import { GetPrescriptionByIdUseCase } from "../application/use-cases/GetPrescriptionByIdUseCase"; // <-- Import new use case

// Controllers
import { CreatePrescriptionController } from "./controllers/CreatePrescriptionController";
import { GetPrescriptionsController } from "./controllers/GetPrescriptionsController";
import { GetPrescriptionsByPatientIdController } from "./controllers/GetPrescriptionsByPatientIdController";
import { GetPrescriptionByIdController } from "./controllers/GetPrescriptionByIdController";

// Repository Implementation
import { MysqlPrescriptionRepository } from "./adapters/MysqlPrescriptionRepository";

// Service Implementation
import { FcmNotificationService } from "./services/firebase/FcmNotificationService";

// Instantiate Repository
export const mysqlPrescriptionRepository = new MysqlPrescriptionRepository();

// Instantiate Services
// Firebase Admin SDK initialization happens inside the service constructor or a shared setup
export const fcmNotificationService = new FcmNotificationService();

// Instantiate Use Cases (Inject dependencies)
export const createPrescriptionUseCase = new CreatePrescriptionUseCase(
    mysqlPrescriptionRepository,
    fcmNotificationService // Inject FCM service instance
);

export const getPrescriptionsUseCase = new GetPrescriptionsUseCase(mysqlPrescriptionRepository);

export const getPrescriptionsByPatientIdUseCase = new GetPrescriptionsByPatientIdUseCase(mysqlPrescriptionRepository);

export const getPrescriptionByIdUseCase = new GetPrescriptionByIdUseCase(mysqlPrescriptionRepository);

// Instantiate Controllers
export const createPrescriptionController = new CreatePrescriptionController(createPrescriptionUseCase);
export const getPrescriptionsController = new GetPrescriptionsController(getPrescriptionsUseCase);
export const getPrescriptionsByPatientIdController = new GetPrescriptionsByPatientIdController(getPrescriptionsByPatientIdUseCase);
export const getPrescriptionByIdController = new GetPrescriptionByIdController(getPrescriptionByIdUseCase);