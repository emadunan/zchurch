import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import prisma from "../client";

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

        const createdProfile = prisma.profile.create({
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
            message: "new expression has been created",
            data: createdProfile,
        });
    } catch (error) {
        next(error);
    }
};
