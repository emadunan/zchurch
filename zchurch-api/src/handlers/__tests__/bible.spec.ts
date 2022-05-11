import supertest from "supertest";
import app from "../../server";

const request = supertest(app);

describe("Bible Endpoints Tests", () => {

    describe("GET /bible/books", () => {
        
        test("Return all (66) bible books", async () => {
            const response = await request.get("/bible/books");
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(66);
        });
    });

    afterAll(() => {
        app.close();
    });
});