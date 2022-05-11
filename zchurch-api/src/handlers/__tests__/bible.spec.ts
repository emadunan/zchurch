import supertest from "supertest";
import app from "../../server";

const request = supertest(app);

describe("Bible Endpoints Tests", () => {
    describe("GET /bible", () => {
        test("Return all (66) bible books", async () => {
            const response = await request.get("/bible");
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(66);
        });
    });

    describe("GET /bible/jonah", () => {
        test("Return jonah book JSON", async () => {
            const response = await request.get("/bible/jonah");
            expect(response.status).toBe(200);
            expect(response.body.nam).toBe("jonah");
            expect(response.body.chapters.length).toBe(4);
        });

        test("Return 404", async () => {
            const response = await request.get("/bible/david");
            expect(response.status).toBe(404);
            expect(response.body.message).toBe(
                "the page that you were looking for doesn't exist"
            );
        });
    });

    afterAll(() => {
        app.close();
    });
});
