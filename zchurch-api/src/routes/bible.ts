import { Router } from "express";
import { param } from "express-validator";
import * as bibleController from "../controllers/bible";

const router = Router();

/** Define Bible Routes */
router.get("/", bibleController.getAllBooks);
router.get(
    "/:bookName",
    param("bookName").isAlphanumeric(),
    bibleController.getOneBook
);

export default router;
