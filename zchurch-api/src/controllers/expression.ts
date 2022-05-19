import { Router, Request, Response } from "express";
import prisma from "../client";

const router = Router();

// Define Expressions Routes
router.get("/", getAllExpressions);
router.post("/", createNewExpression);
router.get("/:id", getOneExpression);
router.put("/:id", updateExpression);
router.delete("/:id", destroyExpression);
router.put("/:id/verse/:verseId", connectVerse);
router.delete("/:id/verse/:verseId", disconnectVerse);
router.put("/:id/reaction", addReaction);
router.delete("/reactions/:id", destroyReaction);
router.put("/reactions/:id", updateReaction);

// Define Expressions Endpoints destroyReaction

/** GET /expressions
 * Retrieve all expressions */
async function getAllExpressions(req: Request, res: Response): Promise<void> {
    try {
        const expressions = await prisma.expression.findMany({
            orderBy: {
                id: "asc",
            },
        });
        res.status(200).json(expressions);
    } catch (error) {
        throw new Error(error as string);
    }
}

/** GET /expressions/:id
 * Retrieve one expression */
async function getOneExpression(req: Request, res: Response): Promise<void> {
    try {
        const id = +req.params.id;
        const expression = await prisma.expression.findFirst({
            where: {
                id: id,
            },
        });

        // Response with expression or 404
        if (expression) {
            res.status(200).json(expression);
        } else {
            res.status(404).json({
                message: "the page that you were looking for doesn't exist",
            });
        }
    } catch (error) {
        throw new Error(error as string);
    }
}

/** POST /expressions
 * Create a new expression */
async function createNewExpression(req: Request, res: Response) {
    try {
        const receivedExpression = req.body;
        const createdExpression = await prisma.expression.create({
            data: receivedExpression,
        });

        if (createdExpression) {
            res.status(201).json({
                message: "new expression has been created",
                data: createdExpression,
            });
        } else {
            res.status(400).json({
                message: "you have sent a bad request",
            });
        }
    } catch (error) {
        throw new Error(error as string);
    }
}

/** PUT /expressions/:id
 * Update expression data */
async function updateExpression(req: Request, res: Response) {
    try {
        const id = +req.params.id;
        const { textu, textf, definition } = req.body;
        const updatedExpression = await prisma.expression.update({
            where: {
                id: id,
            },
            data: {
                textu: textu,
                textf: textf,
                definition: definition,
            },
        });

        if (updatedExpression) {
            res.status(200).json({
                message: "expression has been updated",
                data: updatedExpression,
            });
        } else {
            res.status(400).json({
                message: "you have sent a bad request",
            });
        }
    } catch (error) {
        throw new Error(error as string);
    }
}

/** DELETE /expressions/:id
 * Delete expression */
async function destroyExpression(req: Request, res: Response) {
    try {
        const id = +req.params.id;
        const deletedExpression = await prisma.expression.delete({
            where: {
                id: id,
            },
        });

        if (deletedExpression) {
            res.status(200).json({
                message: "expression has been removed",
                data: deletedExpression,
            });
        } else {
            res.status(400).json({
                message: "failed to remove the expression",
            });
        }
    } catch (error) {
        throw new Error(error as string);
    }
}

/** PUT /expressions/:id/verse/:verseId
 * Connect expression to verse */
async function connectVerse(req: Request, res: Response) {
    try {
        const { id, verseId } = req.params;
        const expression = await prisma.expression.update({
            where: {
                id: +id,
            },
            data: {
                verses: {
                    connect: {
                        id: +verseId,
                    },
                },
            },
            include: {
                verses: true,
            },
        });
        res.status(200).json({
            message: "expression have been updated",
            data: expression,
        });
    } catch (error) {
        throw new Error(error as string);
    }
}

/** DELETE /expressions/:id/verse/:verseId */
async function disconnectVerse(req: Request, res: Response) {
    try {
        const { id, verseId } = req.params;
        const updatedExpression = await prisma.expression.update({
            where: {
                id: +id,
            },
            data: {
                verses: {
                    disconnect: {
                        id: +verseId,
                    },
                },
            },
            include: {
                verses: true,
            },
        });

        res.status(200).json({
            message: "expression has been updated",
            data: updatedExpression,
        });
    } catch (error) {
        throw new Error(error as string);
    }
}

/** PUT /expressions/1/reaction */
async function addReaction(req: Request, res: Response) {
    try {
        const id = +req.params.id;
        const content = req.body.content;
        const expression = await prisma.expression.update({
            where: {
                id: id,
            },
            data: {
                reactions: {
                    create: {
                        content: content,
                    },
                },
            },
            include: {
                reactions: true,
            },
        });
        res.status(200).json({
            message: "expression have been updated",
            data: expression,
        });
    } catch (error) {
        throw new Error(error as string);
    }
}

/** PUT /expressions/reactions/:id */
async function updateReaction(req: Request, res: Response) {
    try {
        const id = +req.params.id;
        const content = req.body.content;
        const updatedReaction = await prisma.reaction.update({
            where: {
                id: id,
            },
            data: {
                content: content,
            },
        });

        res.status(200).json({
            message: "reaction has been updated",
            data: updatedReaction,
        });
    } catch (error) {
        throw new Error(error as string);
    }
}

/** DELETE /expressions/reactions/:id */
async function destroyReaction(req: Request, res: Response) {
    try {
        const id = +req.params.id;
        const deletedReaction = await prisma.reaction.delete({
            where: {
                id: id,
            },
        });

        res.status(200).json({
            message: "reaction has been deleted",
            data: deletedReaction,
        });
    } catch (error) {
        throw new Error(error as string);
    }
}

export default router;
