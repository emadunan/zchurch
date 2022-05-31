import supertest from "supertest";
import app from "../../server";
import prisma from "../../client";

const request = supertest(app);

describe("Expression Endpoints Tests", () => {
    let mariamId: string;
    let rahabId: string;

    afterAll(async () => {
        await prisma.$transaction([
            prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE`,
            prisma.$executeRaw`TRUNCATE TABLE "Profile" CASCADE`,
            prisma.$executeRaw`ALTER SEQUENCE "Profile_id_seq" RESTART WITH 1`,
        ]);
        await prisma.$disconnect();
        return app.close();
    });

    afterEach(async () => {
        await prisma.profile.deleteMany({
            where: {
                user: { email: "mariam@gmail.com" },
            },
        });
    });

    describe("POST /users", () => {
        test("Create a new user profile", async () => {
            const rahabResponse = await request.post("/auth/register").send({
                email: "rahab@gmail.com",
                password: "password",
            });

            rahabId = rahabResponse.body.id;

            const response = await request.post("/users").send({
                firstname: "Rahab",
                lastname: "Younan",
                gender: "FEMALE",
                countryId: 101,
                mobile: "1003379933",
                birthDate: "1996-01-01T07:40:00.000Z",
                userId: rahabId,
            });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe("new profile has been created");
        });

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
            expect(response.body.message).toBe("new profile has been created");
        });

        test("Create a new empty user profile (pass null params)", async () => {
            const response = await request.post("/users").send({
                firstname: null,
                lastname: null,
                gender: null,
                userId: mariamId,
            });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe("new profile has been created");
        });

        test("Create a new empty user profile (pass empty string)", async () => {
            const response = await request.post("/users").send({
                firstname: "",
                lastname: "",
                gender: "",
                userId: mariamId,
            });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe("new profile has been created");
        });

        test("Return Invalid input 400", async () => {
            const response = await request.post("/users").send({
                firstname: "m",
                lastname: "z",
                gender: "FEMALE",
                userId: mariamId,
            });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("ValidationError");
        });

        test("Not passing userId returns invalid input 400", async () => {
            const response = await request.post("/users").send({
                firstname: "mariam",
                lastname: "zelinesky",
                gender: "FEMALE",
            });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("ValidationError");
        });
    });

    describe("GET /users", () => {
        test("Return array of users", async () => {
            const response = await request.get("/users");

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(1);
            expect(response.body[0].user.email).toBe("rahab@gmail.com");
        });

        test("Return array contains one user", async () => {
            const response = await request
                .get("/users")
                .query({ email: "rahab@gmail.com" });

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(1);
            expect(response.body[0].user.email).toBe("rahab@gmail.com");
        });

        test("Return empty array of users", async () => {
            const response = await request
                .get("/users")
                .query({ email: "rahab@gmail" });

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(0);
        });
    });
});
