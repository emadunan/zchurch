import { PrismaClient } from "@prisma/client";
import supertest from "supertest";
import app from "../../server";

const prisma = new PrismaClient();
const request = supertest(app);

describe("Expression Endpoints Tests", () => {

    afterAll(async () => {
        await prisma.$executeRaw`TRUNCATE TABLE expressions CASCADE`;
        await prisma.$executeRaw`ALTER SEQUENCE expressions_id_seq RESTART WITH 1`;
        app.close();
    });

    describe("POST /expressions", () => {
        test("Create new expression and return it", async () => {
            const response = await request.post("/expressions").send({
                "textu": "ادم",
                "textf": "ادَم",
                "definition": "انسان خلقة الرب الاله في اليوم السادس"
            });
            expect(response.status).toBe(201);
            expect(response.body.data.textf).toBe("ادَم");
            expect(response.body.data.definition).toBe(
                "انسان خلقة الرب الاله في اليوم السادس"
            );
        });

        test("Create another expression and return it", async () => {
            const response = await request.post("/expressions").send({
                "textu": "حواء",
                "textf": "حَواء",
                "definition": "انسانه خلقها الرب الاله من ضلع ادم"
            });
            expect(response.status).toBe(201);
            expect(response.body.data.textf).toBe("حَواء");
            expect(response.body.data.definition).toBe(
                "انسانه خلقها الرب الاله من ضلع ادم"
            );
        });
    });

    describe("PUT /expressions", () => {
        test("Update all expression's fields and return it", async () => {
            const response = await request.put("/expressions").send({
                id: 1,
                textu: "أدم",
                textf: "أدَم",
                definition: "إنسان خلقة الرب الاله في اليوم السادس"
            });
            expect(response.status).toBe(200);
            expect(response.body.data.textf).toBe("أدَم");
            expect(response.body.data.definition).toBe(
                "إنسان خلقة الرب الاله في اليوم السادس"
            );
        });

        test("Update expression's one field and return it", async () => {
            const response = await request.put("/expressions").send({
                id: 1,
                textf: "أدَمُ",
            });
            expect(response.status).toBe(200);
            expect(response.body.data.textf).toBe("أدَمُ");
            expect(response.body.data.definition).toBe(
                "إنسان خلقة الرب الاله في اليوم السادس"
            );
        });
    });

    describe("GET /expressions", () => {
        test("Return array of expressions", async () => {
            const response = await request.get("/expressions");
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(2);
            expect(response.body[0].textu).toBe("أدم");
            expect(response.body[1].textu).toBe("حواء");
        });
    });
});
