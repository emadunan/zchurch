import { Router } from "express";
import * as bibleController from "../controllers/bible";

const router = Router();

/** Define Bible Routes */
router.get("/", bibleController.getAllBooks);
router.get("/:bookName", bibleController.getOneBook);

export default router;
