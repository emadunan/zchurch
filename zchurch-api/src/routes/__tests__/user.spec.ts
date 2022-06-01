import supertest from "supertest";
import app from "../../server";
import prisma from "../../client";

const request = supertest(app);

describe("Expression Endpoints Tests", () => {
    let mariamId: string;
    let mariamToken: string;

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

            const response = await request
                .post("/users")
                .send({
                    firstname: "Rahab",
                    lastname: "Younan",
                    gender: "FEMALE",
                    countryId: 101,
                    mobile: "1003379933",
                    birthDate: "1996-01-01T07:40:00.000Z",
                    userId: rahabId,
                })
                .set({ Authorization: rahabResponse.body.token });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe("new profile has been created");
        });

        test("Create a new empty user profile", async () => {
            const mariamResponse = await request.post("/auth/register").send({
                email: "mariam@gmail.com",
                password: "password",
            });

            mariamId = mariamResponse.body.id;
            mariamToken = mariamResponse.body.token;

            const response = await request
                .post("/users")
                .send({ userId: mariamId })
                .set({ Authorization: mariamResponse.body.token });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe("new profile has been created");
        });

        test("Create a new empty user profile (pass null params)", async () => {
            const response = await request
                .post("/users")
                .send({
                    firstname: null,
                    lastname: null,
                    gender: null,
                    userId: mariamId,
                })
                .set({ Authorization: mariamToken });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe("new profile has been created");
        });

        test("Create a new empty user profile (pass empty string)", async () => {
            const response = await request
                .post("/users")
                .send({
                    firstname: "",
                    lastname: "",
                    gender: "",
                    userId: mariamId,
                })
                .set({ Authorization: mariamToken });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe("new profile has been created");
        });

        test("Return Invalid input 400", async () => {
            const response = await request
                .post("/users")
                .send({
                    firstname: "m",
                    lastname: "z",
                    gender: "FEMALE",
                    userId: mariamId,
                })
                .set({ Authorization: mariamToken });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("ValidationError");
        });

        test("Not passing userId returns invalid input 400", async () => {
            const response = await request
                .post("/users")
                .send({
                    firstname: "mariam",
                    lastname: "zelinesky",
                    gender: "FEMALE",
                })
                .set({ Authorization: mariamToken });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("ValidationError");
        });
    });

    describe("PUT /users/1", () => {
        test("Successfuly update profile and return it", async () => {
            // Login
            const rahabResponse = await request.post("/auth/login").send({
                email: "rahab@gmail.com",
                password: "password",
            });
            // Get a token to use in tests
            const rahabToken = rahabResponse.body.token;

            // Test update user data
            const response = await request
                .put("/users/1")
                .send({
                    firstname: "Rahab",
                    lastname: "Yona",
                    birthDate: "1996-06-01T07:40:00.000Z",
                })
                .set({ Authorization: rahabToken });

            expect(response.status).toBe(200);
            expect(response.body.data.firstname).toBe("Rahab");
            expect(response.body.data.lastname).toBe("Yona");
            expect(response.body.data.birthDate).toBe(
                "1996-06-01T07:40:00.000Z"
            );
            expect(response.body.data.gender).toBe("FEMALE");
        });

        test("Return ValidationError", async () => {
            // Login
            const rahabResponse = await request.post("/auth/login").send({
                email: "rahab@gmail.com",
                password: "password",
            });
            // Get a token to use in tests
            const rahabToken = rahabResponse.body.token;

            // Test update user data
            const response = await request
                .put("/users/1")
                .send({
                    firstname: "R",
                    lastname: "Yona",
                    birthDate: "1996-06-01T07:40:00.000Z",
                })
                .set({ Authorization: rahabToken });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("ValidationError");
        });

        test("Return invalid inputs", async () => {
            // Login
            const rahabResponse = await request.post("/auth/login").send({
                email: "rahab@gmail.com",
                password: "password",
            });
            // Get a token to use in tests
            const rahabToken = rahabResponse.body.token;

            // Test update user data
            const response = await request
                .put("/users/11")
                .send({
                    firstname: "Rana",
                    lastname: "Jonah",
                    birthDate: "1996-06-01T07:40:00.000Z",
                })
                .set({ Authorization: rahabToken });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe("unauthorized access");
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
