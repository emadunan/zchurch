import { Router } from "express";
import { param } from "express-validator";
import * as authController from "../controllers/auth";

const router = Router();

// http://127.0.0.1:3000/auth/register
router.post("/register", authController.register);

export default router;
