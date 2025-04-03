// doctor/infrastructure/doctor.dependencies.ts

// Use Cases
import { RegisterDoctorUseCase } from "../application/use-cases/RegisterDoctorUseCase";
import { LoginDoctorUseCase } from "../application/use-cases/LoginDoctorUseCase";

// Controllers
import { RegisterDoctorController } from "./controllers/RegisterDoctorController";
import { LoginDoctorController } from "./controllers/LoginDoctorController";

// Repository Implementation
import { MysqlDoctorRepository } from "./adapters/MysqlDoctorRepository";

import { BcryptService } from "../../security/bcrypt"; // Adjust path

import { EncryptPasswordService } from "../../shared/infrastructure/services/EncryptPasswordService";
import { TokenService } from "../../shared/infrastructure/services/TokenService";

const bcryptService = new BcryptService(); // If needed locally
export const localEncryptPasswordService = new EncryptPasswordService(bcryptService); // If needed locally
export const localTokenService = new TokenService(); // If needed locally


// Instantiate Repository
export const mysqlDoctorRepository = new MysqlDoctorRepository();

// Instantiate Use Cases (Inject repository and shared services)
export const registerDoctorUseCase = new RegisterDoctorUseCase(
    mysqlDoctorRepository,
    localEncryptPasswordService // Use shared instance
);

export const loginDoctorUseCase = new LoginDoctorUseCase(
    mysqlDoctorRepository,
    localTokenService,           // Use shared instance
    localEncryptPasswordService  // Use shared instance
);

// Instantiate Controllers
export const registerDoctorController = new RegisterDoctorController(registerDoctorUseCase);
export const loginDoctorController = new LoginDoctorController(loginDoctorUseCase);