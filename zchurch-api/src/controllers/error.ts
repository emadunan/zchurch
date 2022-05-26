import { NextFunction, Request, Response } from "express";

export const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    console.log(err);
    res.status(500).json({ message: err.message });
};

export const pageNotFoundHandler = (req: Request, res: Response) => {
    res.status(404).json({
        message: "the page that you were looking for doesn't exist",
    });
};
