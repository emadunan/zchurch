import { Router } from "express";
import { body, query } from "express-validator";
import * as userController from "../controllers/user";

const router = Router();

// Define Users Routes
router
    .route("/")
    .post(
        [
            body("firstname")
                .optional({ checkFalsy: true })
                .isString()
                .isLength({ min: 2, max: 50 }),
            body("lastname")
                .optional({ checkFalsy: true })
                .isString()
                .isLength({ min: 2, max: 50 }),
            body("gender")
                .optional({ checkFalsy: true })
                .isString()
                .isIn(["MALE", "FEMALE"]),
            body("countryId").optional().isInt({ min: 1, max: 240 }),
            body("birthdate")
                .optional({ checkFalsy: true })
                .isDate()
                .isAfter("1900-01-01T00:00:01.000Z")
                .isBefore(new Date().toISOString()),
            body("userId").isUUID(),
        ],
        userController.createNewUserProfile
    )
    .get(
        [
            query("firstname")
                .optional({ checkFalsy: true })
                .isString()
                .isLength({ min: 2, max: 50 }),
            query("lastname")
                .optional({ checkFalsy: true })
                .isString()
                .isLength({ min: 2, max: 50 }),
            query("gender")
                .optional({ checkFalsy: true })
                .isString()
                .isIn(["MALE", "FEMALE"]),
            query("countryId").optional().isInt({ min: 1, max: 240 }),
            query("birthdate")
                .optional({ checkFalsy: true })
                .isDate()
                .isAfter("1900-01-01T00:00:01.000Z")
                .isBefore(new Date().toISOString()),
        ],
        userController.getUsers
    );

router.put(
    "/:id",
    [
        body("firstname")
            .optional({ checkFalsy: true })
            .isString()
            .isLength({ min: 2, max: 50 }),
        body("lastname")
            .optional({ checkFalsy: true })
            .isString()
            .isLength({ min: 2, max: 50 }),
        body("gender")
            .optional({ checkFalsy: true })
            .isString()
            .isIn(["MALE", "FEMALE"]),
        body("countryId").optional().isInt({ min: 1, max: 240 }),
        body("birthdate")
            .optional({ checkFalsy: true })
            .isDate()
            .isAfter("1900-01-01T00:00:01.000Z")
            .isBefore(new Date().toISOString()),
    ],
    userController.updateUserProfile
);

export default router;
