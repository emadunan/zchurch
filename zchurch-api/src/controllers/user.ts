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

export const getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {

    try {
        const {
            email,
            firstname,
            lastname,
            gender,
            countryId,
            mobile,
        } = req.body;

        const selectedUsers = await prisma.profile.findMany({
            where: {
                firstname: firstname || null,
                lastname: lastname || null,
                gender: gender || null,
                countryId: +countryId || null,
                mobile: mobile || null,
            },
            include: {
                user: true
            }
        });

        res.status(200).json(selectedUsers);

    } catch (error) {
        next(error);
    }

};
