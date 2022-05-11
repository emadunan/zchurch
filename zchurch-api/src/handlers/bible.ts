import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

/* Define bible routes */
router.get("/books", getAllBooks);
router.get("/books/:id", getOneBook);

/* Define bible handlers */

// GET /bible/books -> Retrieve all books
async function getAllBooks(req: Request, res: Response): Promise<void> {
  try {
    const books = await prisma.book.findMany();
    res.status(200).json(books);
  } catch (error) {
    throw new Error(error as string);
  }
}

// GET /bible/books/:id -> Retrieve one book
async function getOneBook(req: Request, res: Response): Promise<void> {
  try {
    const id = +req.params.id;
    const books = await prisma.book.findFirst({
      where: {
        id: id,
      },
      include: {
        chapters: {
          include: {
            verses: true
          }
        }
      }
    });
    res.status(200).json(books);
  } catch (error) {
    throw new Error(error as string);
  }
}
export default router;
