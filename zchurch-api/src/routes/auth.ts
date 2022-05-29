import { Router } from "express";
import { body } from "express-validator";
import * as authController from "../controllers/auth";

const router = Router();

router.post(
    "/register",
    body("email").isEmail(),
    body("password").isLength({ min: 6, max: 40 }),
    authController.register
);
router.post(
    "/login",
    body("email").isEmail(),
    body("password").isLength({ min: 6, max: 40 }),
    authController.login
);

export default router;
