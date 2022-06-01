import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

export const errorHandler = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
): void | Response => {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        switch (err.code) {
            case "P2025":
                return res.status(404).json({ message: err.meta?.cause });

            default:
                break;
        }
    }

    switch (err.message) {
        case "INVALID_PARAM":
            res.status(400).json({
                message: "the page that you were looking for doesn't exist",
            });
            break;

        default:
            res.status(500).json({ message: err.message });
            break;
    }
};

export const pageNotFoundHandler = (_req: Request, res: Response) => {
    res.status(404).json({
        message: "the page that you were looking for doesn't exist",
    });
};
