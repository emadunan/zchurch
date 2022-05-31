import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import prisma from "../client";

export const getUsers = async (
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
        // Extract inputs from request querystring
        const { email, firstname, lastname, gender, mobile } = req.query;

        // Extract INT inputs from request querystring
        const countryId = parseInt(req.query.countryId as string);

        // Fetch users from database
        const selectedUsers = await prisma.profile.findMany({
            where: {
                firstname: firstname as string,
                lastname: lastname as string,
                gender: gender as string,
                countryId: countryId || undefined,
                mobile: mobile as string,
                user: { email: email as string },
            },
            include: {
                user: true,
            },
        });

        res.status(200).json(selectedUsers);
    } catch (error) {
        next(error);
    }
};

export const createNewUserProfile = async (
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
        const {
            firstname,
            lastname,
            gender,
            countryId,
            mobile,
            birthDate,
            userId,
        } = req.body;

        const createdProfile = await prisma.profile.create({
            data: {
                firstname: firstname,
                lastname: lastname,
                gender: gender,
                countryId: countryId,
                mobile: mobile,
                birthDate: birthDate,
                userId: userId,
            },
        });

        if (!createdProfile)
            return res.status(400).json({
                message: "invalid inputs, profile has not been created",
            });

        res.status(201).json({
            message: "new profile has been created",
            data: createdProfile,
        });
    } catch (error) {
        next(error);
    }
};
