import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import prisma from "../client";

// Define Expressions Endpoints destroyReaction

/** GET /expressions
 * Retrieve all expressions */
export async function getAllExpressions(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const expressions = await prisma.expression.findMany({
            orderBy: {
                id: "asc",
            },
        });
        res.status(200).json(expressions);
    } catch (error) {
        next(error);
    }
}

/** GET /expressions/:id
 * Retrieve one expression */
export async function getOneExpression(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
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
        next(error);
    }
}

/** POST /expressions
 * Create a new expression */
export async function createNewExpression(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

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
        next(error);
    }
}

/** PUT /expressions/:id
 * Update expression data */
export async function updateExpression(
    req: Request,
    res: Response,
    next: NextFunction
) {
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
        next(error);
    }
}

/** DELETE /expressions/:id
 * Delete expression */
export async function destroyExpression(
    req: Request,
    res: Response,
    next: NextFunction
) {
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
        next(error);
    }
}

/** PUT /expressions/:id/verse/:verseId
 * Connect expression to verse */
export async function connectVerse(
    req: Request,
    res: Response,
    next: NextFunction
) {
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
        next(error);
    }
}

/** DELETE /expressions/:id/verse/:verseId */
export async function disconnectVerse(
    req: Request,
    res: Response,
    next: NextFunction
) {
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
        next(error);
    }
}

/** PUT /expressions/1/reaction */
export async function addReaction(
    req: Request,
    res: Response,
    next: NextFunction
) {
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
        next(error);
    }
}

/** PUT /expressions/reactions/:id */
export async function updateReaction(
    req: Request,
    res: Response,
    next: NextFunction
) {
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
        next(error);
    }
}

/** DELETE /expressions/reactions/:id */
export async function destroyReaction(
    req: Request,
    res: Response,
    next: NextFunction
) {
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
        next(error);
    }
}
