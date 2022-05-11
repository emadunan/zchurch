import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

/** Define Expression routes */
router.get("/", getAllExpressions);
router.get("/:expressionId", getOneExpression);
router.post("/", createNewExpression);
router.put("/", updateExpression);
router.delete("/:expressionId", destroyExpression);

/** Define expression handler */

// GET /expressions -> Retrieve all expressions
async function getAllExpressions(req: Request, res: Response): Promise<void> {
    try {
        const expressions = prisma.expression.findMany();
        res.status(200).json(expressions);
    } catch (error) {
        throw new Error(error as string);
    }
}

// GET /expressions/:expressionId -> Retrieve one expression
async function getOneExpression(req: Request, res: Response): Promise<void> {
    try {
        const expressionId = +req.params.expressionId;
        const expression = await prisma.expression.findFirst({
            where: {
                id: expressionId,
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

// POST /expressions -> Create a new expression
async function createNewExpression(req: Request, res: Response) {
    try {
        const receivedExpression = req.body;
        const createdExpression = await prisma.expression.create({
            data: receivedExpression
        });

        if (createdExpression) {
            res.status(201).json({
                message: "new expression has been created",
                data: createdExpression
            });
        } else {
            res.status(400).json({
                message: "you have sent a bad request"
            });
        }
    } catch (error) {
        throw new Error(error as string); 
    }
}

// PUT /expressions -> Update expression data
async function updateExpression(req: Request, res: Response) {
    try {
        const receivedExpression = req.body;
        const receivedExpressionId = +receivedExpression.id;
        const updatedExpression = await prisma.expression.update({
            where: {
                id: receivedExpressionId
            },
            data: {
                textu: receivedExpression.textu,
                textf: receivedExpression.textf,
                definition: receivedExpression.definition
            }
        });

        if (updatedExpression) {
            res.status(200).json({
                message: "expression has been updated",
                data: updatedExpression
            });
        } else {
            res.status(400).json({
                message: "you have sent a bad request"
            });
        }
        
    } catch (error) {
        throw new Error(error as string);
    }
}

// DELETE /expressions/:expressionId -> Delete expression
async function destroyExpression(req: Request, res: Response) {
    try {
        const expressionId = +req.params.expressionId;
        const deletedExpression = await prisma.expression.delete({
            where: {
                id: expressionId
            }
        });

        if (deletedExpression) {
            res.status(200).json({
                message: "expression has been removed",
                data: deletedExpression
            });
        } else {
            res.status(400).json({
                message: "failed to remove the expression"
            });
        }
    } catch (error) {
        throw new Error(error as string);
    }
}