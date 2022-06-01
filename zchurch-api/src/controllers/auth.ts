import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import jwt_decode from "jwt-decode";
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
        const password = await bcrypt.hash(userToCreate.password, 4);
        userToCreate.password = password;

        // Create a new user
        const createdUser = await prisma.user.create({
            data: userToCreate,
            select: {
                id: true,
                email: true,
                isActive: true,
                joinDate: true,
                lastLogin: true,
                profile: true,
            },
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
    // Validate user inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json({ message: "ValidationError", errors: errors.array() });
    }

    try {
        // Extract the inputs from request body
        const { email, password } = req.body;

        // Fetch the user from database
        const userToVerify = await prisma.user.findUnique({
            where: {
                email: email,
            },
            include: {
                profile: true,
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
            profile: userToVerify.profile,
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

export const updatePassword = async (
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
        // Extract inputs from request body and token from headers
        const { oldPassword, newPassword } = req.body;
        const token = req.headers.authorization as string;

        // Check if the request contains a token
        if (!token)
            return res.status(401).json({ message: "unauthorized access" });

        // Decode token to extract id
        const decodedToken = jwt_decode<dto.Token>(token);

        // Check if there is an id
        if (!decodedToken.id)
            return res.status(401).json({ message: "unauthorized access" });

        // Fetch the target user from database
        const user = await prisma.user.findUnique({
            where: {
                id: decodedToken.id,
            },
        });

        // Verify old password
        const isValidOld = await bcrypt.compare(
            oldPassword,
            user?.password as string
        );
        if (!isValidOld)
            return res.status(400).json("your old password is incorrect");

        // Update the password and return Authenticated user
        const hashNewPassword = await bcrypt.hash(newPassword, 4);
        await prisma.user.update({
            where: {
                id: decodedToken.id,
            },
            data: {
                password: hashNewPassword,
            },
            select: {
                id: true,
                email: true,
                isActive: true,
                joinDate: true,
                lastLogin: true,
            },
        });
        res.status(200).json({
            message: "password has been successfuly changed",
        });
    } catch (error) {
        next(error);
    }
};
