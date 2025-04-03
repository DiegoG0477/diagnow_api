// doctor/infrastructure/controllers/LoginDoctorController.ts
import { Request, Response } from "express";
import { LoginDoctorUseCase } from "../../application/use-cases/LoginDoctorUseCase";

export class LoginDoctorController {
    constructor(private loginDoctorUseCase: LoginDoctorUseCase) {}

    async run(req: Request, res: Response): Promise<Response> {
        const { name, lastName, password } = req.body;

        // Basic validation
        if (!name || !lastName || !password) {
            return res.status(400).json({
                status: "error",
                message: "Name, lastName, and password are required",
            });
        }

        try {
            const token = await this.loginDoctorUseCase.run(name, lastName, password);

            if (token) {
                return res.status(200).json({
                    status: "success",
                    message: "Doctor logged in successfully",
                    token // Send the JWT token
                });
            } else {
                // Use case returned null, indicating invalid credentials or doctor not found/ambiguous
                return res.status(401).json({ // 401 Unauthorized
                    status: "error",
                    message: "Invalid credentials or doctor not found",
                });
            }
        } catch (error) {
            console.error("Error in LoginDoctorController:", error);
            return res.status(500).json({ // 500 Internal Server Error
                status: "error",
                message: "An unexpected error occurred during login",
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
}