import { NextFunction, Request, Response } from "express";

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.log(err);
    res.status(500).json({ message: err.message });
}

export function pageNotFoundHandler(
    req: Request,
    res: Response,
    next: NextFunction
) {
    res.status(404).json({
        message: "the page that you were looking for doesn't exist",
    });
}
