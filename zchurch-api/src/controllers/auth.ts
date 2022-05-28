import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import prisma from "../client";

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Validate user inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const userToCreate = req.body;
        userToCreate.isActive = true;

        const createdUser = await prisma.user.create({
            data: userToCreate,
        });

        createdUser.password = null;
        const token = jwt.sign(createdUser, "smmbwm");

        res.status(201).json({ user: createdUser, token: token });
    } catch (error) {
        next(error);
    }
};
