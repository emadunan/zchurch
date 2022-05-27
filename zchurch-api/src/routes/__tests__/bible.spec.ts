import supertest from "supertest";
import app from "../../server";
import prisma from "../../client";

const request = supertest(app);

describe("Bible Endpoints Tests", () => {
    afterAll(async () => {
        await prisma.$disconnect();
        return app.close();
    });

    describe("GET /bible", () => {
        test("Return array of books", async () => {
            const response = await request.get("/bible");

            // Response assertions
            expect.assertions(5);

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(66);
            expect(response.body[0].nam).toBe("genesis");
            expect(response.body[31].nam).toBe("jonah");
            expect(response.body[65].nam).toBe("revelation");
        });
    });

    describe("GET /bible/jonah", () => {
        test("Return jonah book JSON", async () => {
            const response = await request.get("/bible/jonah");

            // Response assertions
            expect.assertions(3);

            expect(response.status).toBe(200);
            expect(response.body.nam).toBe("jonah");
            expect(response.body.chapters.length).toBe(4);
        });

        test("Return 404", async () => {
            const response = await request.get("/bible/david");

            // Response assertions
            expect.assertions(2);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe(
                "the page that you were looking for doesn't exist"
            );
        });
    });
});
