import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import prisma from "../client";

// Retrieve all books
export const getAllBooks = async (
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Fetch all books from database
        const books = await prisma.book.findMany();
        res.status(200).json(books);
    } catch (error) {
        next(error);
    }
};

// Retrieve one book
export const getOneBook = async (
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
        // Extract inputs from params
        const bookName = req.params.bookName;

        // Fetch selected book data from database
        const book = await prisma.book.findFirst({
            where: {
                nam: bookName,
            },
            include: {
                chapters: {
                    include: {
                        verses: true,
                    },
                },
            },
        });

        // Response with book content or 404
        if (book) {
            res.status(200).json(book);
        } else {
            res.status(404).json({
                message: "the page that you were looking for doesn't exist",
            });
        }
    } catch (error) {
        next(error);
    }
};
