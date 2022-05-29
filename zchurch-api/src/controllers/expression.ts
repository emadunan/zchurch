import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import prisma from "../client";

/** Retrieve all expressions */
export const getAllExpressions = async (
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Fetch all expressions from database
        const expressions = await prisma.expression.findMany({
            orderBy: {
                id: "asc",
            },
        });
        res.status(200).json(expressions);
    } catch (error) {
        next(error);
    }
};

/** Retrieve one expression */
export const getOneExpression = async (
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
        const id = +req.params.id;

        // Fetch the wanted expression from database
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
};

/** Create a new expression */
export const createNewExpression = async (
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
        // Extract inputs from the request body
        const receivedExpression = req.body;

        // Create a new expression and save it in database
        const createdExpression = await prisma.expression.create({
            data: receivedExpression,
        });

        // Response with the created Expression or 400 (Bad request)
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
};

/** Update expression data */
export const updateExpression = async (
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
        const id = +req.params.id;

        // Extract inputs from request body
        const { textu, textf, definition } = req.body;

        // Update selected expression and save it in database
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

        // Response with the updated Expression or 400 (Bad request)
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
};

/** Delete expression */
export const destroyExpression = async (
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
        const id = +req.params.id;

        // Delete selected expression from database
        const deletedExpression = await prisma.expression.delete({
            where: {
                id: id,
            },
        });

        // Response with the deleted Expression or 400 (Bad request)
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
};

/** Connect expression to verse */
export const connectVerse = async (
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
        const { id, verseId } = req.params;

        // Connect a verse with an expression
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
};

/** Delete relation between expression and verse */
export const disconnectVerse = async (
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
        const { id, verseId } = req.params;

        // Update selected expression and save it in database
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
};

/** Add a reaction on an expression */
export const addReaction = async (
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
        const id = +req.params.id;

        // Extract inputs from request body
        const content = req.body.content;

        // Create reaction and save it in database
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
};

/** Edit a reaction on an expression */
export const updateReaction = async (
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
        const id = +req.params.id;

        // Extract inputs from request body
        const content = req.body.content;

        // Update reaction content and save it in database
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
};

/** Delete a reaction */
export const destroyReaction = async (
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
        const id = +req.params.id;

        // Delete selected reaction from database
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
};
