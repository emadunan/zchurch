import supertest from "supertest";
import app from "../../server";
import prisma from "../../client";

const request = supertest(app);

describe("Auth Endpoints Tests", () => {
    afterAll(async () => {
        await prisma.$transaction([
            prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE`,
        ]);
        await prisma.$disconnect();
        return app.close();
    });

    describe("POST /auth/register", () => {
        test("Create a new user and return authenticated user", async () => {
            const response = await request.post("/auth/register").send({
                email: "emadunan@gmail.com",
                password: "password",
            });

            expect.assertions(3);
            expect(response.status).toBe(201);
            expect(response.body.email).toBe("emadunan@gmail.com");
            expect(response.body.isActive).toBe(true);
        });

        test("Return user is already exists", async () => {
            const response = await request.post("/auth/register").send({
                email: "emadunan@gmail.com",
                password: "password",
            });

            expect.assertions(4);
            expect(response.status).toBe(409);
            expect(response.body.email).toBeUndefined();
            expect(response.body.isActive).toBeUndefined();
            expect(response.body.message).toBe(
                "this name has been already taken"
            );
        });

        test("Return invalid email", async () => {
            const response = await request.post("/auth/register").send({
                email: "emadunan",
                password: "password",
            });

            expect.assertions(7);
            expect(response.status).toBe(400);
            expect(response.body.email).toBeUndefined();
            expect(response.body.isActive).toBeUndefined();
            expect(response.body.message).toBe("ValidationError");
            expect(response.body.errors[0].location).toBe("body");
            expect(response.body.errors[0].msg).toBe("Invalid value");
            expect(response.body.errors[0].param).toBe("email");
        });

        test("Return invalid password", async () => {
            const response = await request.post("/auth/register").send({
                email: "emadunan@gmail.com",
                password: "pass",
            });

            expect.assertions(7);
            expect(response.status).toBe(400);
            expect(response.body.email).toBeUndefined();
            expect(response.body.isActive).toBeUndefined();
            expect(response.body.message).toBe("ValidationError");
            expect(response.body.errors[0].location).toBe("body");
            expect(response.body.errors[0].msg).toBe("Invalid value");
            expect(response.body.errors[0].param).toBe("password");
        });
    });

    describe("POST /auth/login", () => {
        test("Login and return authenticated user", async () => {
            const response = await request.post("/auth/login").send({
                email: "emadunan@gmail.com",
                password: "password",
            });

            expect.assertions(3);
            expect(response.status).toBe(200);
            expect(response.body.email).toBe("emadunan@gmail.com");
            expect(response.body.isActive).toBe(true);
        });

        test("Return incorrect email", async () => {
            const response = await request.post("/auth/login").send({
                email: "emadoouf@gmail.com",
                password: "password",
            });

            expect.assertions(4);
            expect(response.status).toBe(401);
            expect(response.body.email).toBeUndefined();
            expect(response.body.isActive).toBeUndefined();
            expect(response.body.message).toBe("incorrect email");
        });

        test("Return incorrect password", async () => {
            const response = await request.post("/auth/login").send({
                email: "emadunan@gmail.com",
                password: "passWord",
            });

            expect.assertions(4);
            expect(response.status).toBe(401);
            expect(response.body.email).toBeUndefined();
            expect(response.body.isActive).toBeUndefined();
            expect(response.body.message).toBe("incorrect password");
        });

        test("Return ValidationError", async () => {
            const response = await request.post("/auth/login");

            expect.assertions(4);
            expect(response.status).toBe(400);
            expect(response.body.email).toBeUndefined();
            expect(response.body.isActive).toBeUndefined();
            expect(response.body.message).toBe("ValidationError");
        });
    });

    describe("PUT /auth/updatePassword", () => {
        test("Successfuly change password", async () => {
            const rahabResponse = await request.post("/auth/register").send({
                email: "rahab@gmail.com",
                password: "password",
            });

            const response = await request
                .put("/auth/updatePassword")
                .send({
                    oldPassword: "password",
                    newPassword: "PassWordX",
                })
                .set({ Authorization: rahabResponse.body.token });

            // expect.assertions()
            expect(response.status).toBe(200);
            expect(response.body.message).toBe(
                "password has been successfuly changed"
            );
        });

        test("Return 401 Un-authorized", async () => {
            const response = await request.put("/auth/updatePassword").send({
                oldPassword: "password",
                newPassword: "PassWordX",
            });

            // expect.assertions()
            expect(response.status).toBe(401);
            expect(response.body.message).toBe("unauthorized access");
        });

        test("Return ValidationError", async () => {
            const response = await request.put("/auth/updatePassword");

            expect.assertions(2);
            expect(response.status).toBe(400);
            expect(response.body.message).toBe("ValidationError");
        });
    });
});
