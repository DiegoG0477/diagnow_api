
import { GetAllPatientsUseCase } from "../application/use-cases/GetAllPatientsUseCase";
import { RegisterPatientUseCase } from "../application/use-cases/RegisterPatientUseCase";
import { LoginPatientUseCase } from "../application/use-cases/LoginPatientUseCase";

import { GetAllPatientsController } from "./controllers/GetAllPatientsController";
import { RegisterPatientController } from "./controllers/RegisterPatientController";
import { LoginPatientController } from "./controllers/LoginPatientController";

import { BcryptService } from "../../security/bcrypt"; // Adjust path

// Repository Implementation
import { MysqlPatientRepository } from "./adapters/MysqlPatientRepository";

import { EncryptPasswordService } from "../../shared/infrastructure/services/EncryptPasswordService";
import { TokenService } from "../../shared/infrastructure/services/TokenService";


// Instantiate Repository
export const mysqlPatientRepository = new MysqlPatientRepository();

// Instantiate Services (if not reusing shared instances)
const bcryptService = new BcryptService(); // If needed locally
export const localEncryptPasswordService = new EncryptPasswordService(bcryptService); // If needed locally
export const localTokenService = new TokenService(); // If needed locally

// Instantiate Use Cases (using shared/imported services)
export const loginPatientUseCase = new LoginPatientUseCase(
    mysqlPatientRepository,
    localTokenService, // Use shared/imported instance
    localEncryptPasswordService // Use shared/imported instance (assuming it wraps Bcrypt)
);

export const registerPatientUseCase = new RegisterPatientUseCase(
    mysqlPatientRepository,
    localEncryptPasswordService // Use shared/imported instance
);

export const getAllPatientsUseCase = new GetAllPatientsUseCase(mysqlPatientRepository);

// Instantiate Controllers
export const registerPatientController = new RegisterPatientController(registerPatientUseCase);

export const getAllPatientsController = new GetAllPatientsController(getAllPatientsUseCase);

export const loginPatientController = new LoginPatientController(loginPatientUseCase);