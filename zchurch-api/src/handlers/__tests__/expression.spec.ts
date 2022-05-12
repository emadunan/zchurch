import supertest from "supertest";
import app from "../../server";
import {
    initializeZchurchTestDatabaseAsync,
    clearZchurchTestDatabaseAsync,
} from "../../helpers/test-db-prep";

const request = supertest(app);

describe("Expression Endpoints Tests", () => {
    beforeAll(async () => {
        await initializeZchurchTestDatabaseAsync();
    });

    afterAll(async () => {
        await clearZchurchTestDatabaseAsync();
        app.close();
    });

    describe("POST /expressions", () => {
        test("Create new expression and return it", async () => {
            const response = await (await request.post("/expressions")).body({
                textu: "ادم",
                textf: "أدَم",
                definition: "انسان خلقة الرب الاله في اليوم السادس"
            });
            expect(response.status).toBe(201);
            expect(response.body.data.textf).toBe("أدَم");
            expect(response.body.data.definition).toBe("انسان خلقة الرب الاله في اليوم السادس");
        });
    });
});