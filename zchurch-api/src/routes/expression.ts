import { Router } from "express";
import { body } from "express-validator";
import * as expressionController from "../controllers/expression";

const router = Router();

// Define Expressions Routes
router
    .route("/")
    .get(expressionController.getAllExpressions)
    .post(
        body("textu").isLength({ min: 2, max: 100 }),
        body("textf").isLength({ min: 2, max: 200 }),
        expressionController.createNewExpression
    );

router
    .route("/:id")
    .get(expressionController.getOneExpression)
    .put(expressionController.updateExpression)
    .delete(expressionController.destroyExpression);

router
    .route("/:id/verse/:verseId")
    .put(expressionController.connectVerse)
    .delete(expressionController.disconnectVerse);

router.put("/:id/reaction", expressionController.addReaction);

router
    .route("/reactions/:id")
    .put(expressionController.updateReaction)
    .delete(expressionController.destroyReaction);

export default router;
