import { Request, Response } from "express";
import { LoginDoctorUseCase } from "../../application/use-cases/LoginDoctorUseCase";

export class LoginDoctorController {
    constructor(private loginDoctorUseCase: LoginDoctorUseCase) {}

    async run(req: Request, res: Response): Promise<Response> {
        // --- UPDATED: Extract email ---
        const { email, password } = req.body;

        // --- UPDATED: Basic validation ---
        if (!email || !password) {
            return res.status(400).json({
                status: "error",
                message: "Email and password are required",
            });
        }

        try {
            // --- UPDATED: Pass email ---
            const token = await this.loginDoctorUseCase.run(email, password);

            if (token) {
                return res.status(200).json({
                    status: "success",
                    message: "Doctor logged in successfully",
                    token
                });
            } else {
                return res.status(401).json({ // 401 Unauthorized
                    status: "error",
                    message: "Invalid credentials", // Keep message generic
                });
            }
        } catch (error) {
            console.error("Error in LoginDoctorController:", error);
            return res.status(500).json({
                status: "error",
                message: "An unexpected error occurred during login",
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
}
