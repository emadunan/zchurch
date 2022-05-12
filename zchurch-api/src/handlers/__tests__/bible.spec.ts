import supertest from "supertest";
import app from "../../server";
import {
    initializeZchurchTestDatabaseAsync,
    clearZchurchTestDatabaseAsync,
} from "../../helpers/test-db-prep";

const request = supertest(app);

describe("Bible Endpoints Tests", () => {
    beforeAll(async () => {
        await initializeZchurchTestDatabaseAsync();
    });

    afterAll(async () => {
        await clearZchurchTestDatabaseAsync();
        app.close();
    });

    describe("GET /bible", () => {
        test("Return array of books", async () => {
            const response = await request.get("/bible");
            expect(response.status).toBe(200);
            expect(response.body[0].nam).toBe("jonah");
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
});
