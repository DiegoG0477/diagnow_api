import { MysqlDeviceTokenRepository } from "./adapters/MysqlDeviceTokenRepository";
import { RegisterDeviceTokenUseCase } from "../application/use-cases/RegisterDeviceTokenUseCase";
import { DeleteDeviceTokenUseCase } from "../application/use-cases/DeleteDeviceTokenUseCase";
import { RegisterDeviceTokenController } from "./controllers/RegisterDeviceTokenController";
import { DeleteDeviceTokenController } from "./controllers/DeleteDeviceTokenController";

// Instantiate Repository
// Nota: Si ya tienes una instancia de MysqlPrescriptionRepository, asegúrate de
// que ambas usen la misma conexión/configuración si es necesario.
// Aquí asumimos que pueden ser independientes o usar un pool compartido internamente por 'query'.
export const mysqlDeviceTokenRepository = new MysqlDeviceTokenRepository();

// Instantiate Use Cases
export const registerDeviceTokenUseCase = new RegisterDeviceTokenUseCase(mysqlDeviceTokenRepository);
export const deleteDeviceTokenUseCase = new DeleteDeviceTokenUseCase(mysqlDeviceTokenRepository);

// Instantiate Controllers
export const registerDeviceTokenController = new RegisterDeviceTokenController(registerDeviceTokenUseCase);
export const deleteDeviceTokenController = new DeleteDeviceTokenController(deleteDeviceTokenUseCase);