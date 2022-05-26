import { Request, Response, NextFunction } from "express";
import prisma from "../client";

/** Define Bible Endpoints */

// GET /bible -> Retrieve all books
export async function getAllBooks(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const books = await prisma.book.findMany();
        res.status(200).json(books);
    } catch (error) {
        next(error);
    }
}

// GET /bible/:bookName -> Retrieve one book
export async function getOneBook(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const bookName = req.params.bookName;
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
}
