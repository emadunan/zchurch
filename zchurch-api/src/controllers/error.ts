import { NextFunction, Request, Response } from "express";

export const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    switch (err.message) {
        case "INVALID_PARAM":
            res.status(400).json({ message: "the page that you were looking for doesn't exist" });
            break;

        default:
            res.status(500).json({ message: err.message });
            break;
    }
};

export const pageNotFoundHandler = (req: Request, res: Response) => {
    res.status(404).json({
        message: "the page that you were looking for doesn't exist",
    });
};
