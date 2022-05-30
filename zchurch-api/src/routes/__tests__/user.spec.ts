import supertest from "supertest";
import app from "../../server";
import prisma from "../../client";

const request = supertest(app);

describe("Expression Endpoints Tests", () => {
    afterAll(async () => {
        await prisma.$transaction([
            prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE`,
            // prisma.$executeRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1`,
        ]);
        await prisma.$disconnect();
        return app.close();
    });

    describe("POST /users", () => {
        let mariamId: string;
        test("Create a new empty user profile", async () => {
            const mariamResponse = await request.post("/auth/register").send({
                email: "mariam@gmail.com",
                password: "password",
            });

            mariamId = mariamResponse.body.id;

            const response = await request
                .post("/users")
                .send({ userId: mariamId });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe(
                "new expression has been created"
            );
        });

        test("Create a new empty user profile (pass null params)", async () => {
            const response = await request.post("/users").send({
                firstname: null,
                lastname: null,
                gender: null,
                userId: mariamId,
            });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe(
                "new expression has been created"
            );
        });

        test("Create a new empty user profile (pass empty string)", async () => {
            const response = await request.post("/users").send({
                firstname: "",
                lastname: "",
                gender: "",
                userId: mariamId,
            });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe(
                "new expression has been created"
            );
        });

        test("Return Invalid input 400", async () => {
            const response = await request.post("/users").send({
                firstname: "m",
                lastname: "z",
                gender: "FEMALE",
                userId: mariamId,
            });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe(
                "ValidationError"
            );
        });

        test("Not passing userId returns invalid input 400", async () => {
            const response = await request.post("/users").send({
                firstname: "mariam",
                lastname: "zelinesky",
                gender: "FEMALE"
            });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe(
                "ValidationError"
            );
        });
    });
});
