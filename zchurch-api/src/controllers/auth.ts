import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../client";

import * as dto from "../DTOs";

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    // Validate user inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json({ message: "ValidationError", errors: errors.array() });
    }

    try {
        // Extract inputs from request body
        const userToCreate = req.body;

        // Check if the user already exists
        const isExist = await prisma.user.findUnique({
            where: {
                email: userToCreate.email,
            },
        });

        // Respond with 409 if it's already taken
        if (isExist)
            return res
                .status(409)
                .json({ message: "this name has been already taken" });

        // Append the initial activity status to the user to be created
        userToCreate.isActive = true;

        // Hash the received password
        const password = await bcrypt.hash(userToCreate.password, 5);
        userToCreate.password = password;

        // Create a new user
        const createdUser = await prisma.user.create({
            data: userToCreate,
            select: { id: true, email: true, isActive: true, joinDate: true, lastLogin: true },
        });

        // Generate token and respond with user includes the generated token
        const token = jwt.sign(createdUser, "ennuba");
        const authenticatedUser: dto.AuthenticatedUser = {
            ...createdUser,
            token: token,
        };

        res.status(201).json(authenticatedUser);
    } catch (error) {
        next(error);
    }
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    try {
        // Validate user inputs
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json({ message: "ValidationError", errors: errors.array() });
        }

        // Extract the inputs from request body
        const { email, password } = req.body;

        // Fetch the user from database
        const userToVerify = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        // Check the user existance
        if (!userToVerify)
            return res.status(401).json({ message: "incorrect email" });

        // Check the password, and respond if any of them incorrect
        const verified = await bcrypt.compare(
            password,
            userToVerify?.password as string
        );
        if (!verified)
            return res.status(401).json({ message: "incorrect password" });

        // Prepare token data
        const tokenData = {
            id: userToVerify.id,
            email: userToVerify.email,
            isActive: userToVerify.isActive,
            joinDate: userToVerify.joinDate,
            lastLogin: userToVerify.lastLogin,
        };

        // Generate token and respond with user includes the generated token
        const token = jwt.sign(tokenData, "ennuba");
        const authenticatedUser: dto.AuthenticatedUser = {
            ...tokenData,
            token: token,
        };

        res.status(200).json(authenticatedUser);
    } catch (error) {
        next(error);
    }
};
