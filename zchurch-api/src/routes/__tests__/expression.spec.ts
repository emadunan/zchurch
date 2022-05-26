import supertest from "supertest";
import app from "../../server";
import prisma from "../../client";

const request = supertest(app);

describe("Expression Endpoints Tests", () => {
    afterAll(async () => {
        await prisma.$transaction([
            prisma.$executeRaw`TRUNCATE TABLE "Expression" CASCADE`,
            prisma.$executeRaw`ALTER SEQUENCE "Expression_id_seq" RESTART WITH 1`,
        ]);
        await prisma.$disconnect();
        app.close();
    });

    describe("POST /expressions", () => {
        test("Create invalid expression return 400", async () => {
            const response = await request.post("/expressions").send({
                textu: "أ",
                textf: "أ",
                definition: "",
            });
            expect(response.status).toBe(400);
            expect(response.body.errors[0].location).toBe("body");
            expect(response.body.errors[0].msg).toBe("Invalid value");
            expect(response.body.errors[0].param).toBe("textu");
        });

        test("Create new expression and return it", async () => {
            const response = await request.post("/expressions").send({
                textu: "ادم",
                textf: "ادَم",
                definition: "انسان خلقة الرب الاله في اليوم السادس",
            });
            expect(response.status).toBe(201);
            expect(response.body.data.textf).toBe("ادَم");
            expect(response.body.data.definition).toBe(
                "انسان خلقة الرب الاله في اليوم السادس"
            );
        });

        test("Create another expression and return it", async () => {
            const response = await request.post("/expressions").send({
                textu: "حواء",
                textf: "حَواء",
                definition: "انسانه خلقها الرب الاله من ضلع ادم",
            });
            expect(response.status).toBe(201);
            expect(response.body.data.textf).toBe("حَواء");
            expect(response.body.data.definition).toBe(
                "انسانه خلقها الرب الاله من ضلع ادم"
            );
        });
    });

    describe("PUT /expressions/1", () => {
        test("Update all expression's fields and return it", async () => {
            const response = await request.put("/expressions/1").send({
                textu: "أدم",
                textf: "أدَم",
                definition: "إنسان خلقة الرب الاله في اليوم السادس",
            });
            expect(response.status).toBe(200);
            expect(response.body.data.textf).toBe("أدَم");
            expect(response.body.data.definition).toBe(
                "إنسان خلقة الرب الاله في اليوم السادس"
            );
        });

        test("Update expression's one field and return it", async () => {
            const response = await request.put("/expressions/1").send({
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

    describe("GET /expressions/2", () => {
        test("Return one expression", async () => {
            const response = await request.get("/expressions/2");
            expect(response.status).toBe(200);
            expect(response.body.textu).toBe("حواء");
        });

        test("Throw Error for invalid input", async () => {
            const response = await request.get("/expressions/$");
            expect(response.status).toBe(400);
            expect(response.body.message).toBe("the page that you were looking for doesn't exist");
        });
    });

    describe("DELETE /expressions/2", () => {
        test("Return one expression", async () => {
            const response = await request.delete("/expressions/2");
            expect(response.status).toBe(200);
            expect(response.body.data.textu).toBe("حواء");
        });
    });

    describe("PUT /expressions/1/verse/38", () => {
        test("Return expression includes related verses after update", async () => {
            const response = await request.put("/expressions/1/verse/38");
            expect(response.status).toBe(200);
            expect(response.body.data.textu).toBe("أدم");
            expect(response.body.data.verses.length).toBe(1);
            expect(response.body.data.verses[0].textu).toBe(
                "وجبل الرب الإله آدم ترابا من الأرض، ونفخ في أنفه نسمة حياة. فصار آدم نفسا حية."
            );
        });
    });

    describe("DELETE /expressions/1/verse/38", () => {
        test("Disconnect the expression from the selected verse", async () => {
            const response = await request.delete("/expressions/1/verse/38");
            expect(response.status).toBe(200);
            expect(response.body.data.verses.length).toBe(0);
        });
    });

    describe("PUT /expressions/1/reaction", () => {
        test("Return expression includes reactions after update", async () => {
            const response = await request.put("/expressions/1/reaction").send({
                content: "سمع صوت امراته وكسر الوصيه",
            });
            expect(response.status).toBe(200);
            expect(response.body.data.textu).toBe("أدم");
            expect(response.body.data.reactions[0].content).toBe(
                "سمع صوت امراته وكسر الوصيه"
            );
        });
    });

    describe("PUT /reactions/1", () => {
        test("Update reaction and return it", async () => {
            const reaction = await prisma.reaction.findFirst({
                where: {
                    expressionId: 1,
                },
            });
            const reactionId = reaction?.id;

            const response = await request
                .put(`/expressions/reactions/${reactionId}`)
                .send({
                    content: "هللويا",
                });
            expect(response.status).toBe(200);
            expect(response.body.data.content).toBe("هللويا");
        });
    });

    describe("DELETE /reactions/1", () => {
        test("Delete reaction and return it", async () => {
            const reaction = await prisma.reaction.findFirst({
                where: {
                    expressionId: 1,
                },
            });
            const reactionId = reaction?.id;

            const response = await request.delete(
                `/expressions/reactions/${reactionId}`
            );
            expect(response.status).toBe(200);
            expect(response.body.data.id).toBe(reactionId);
        });
    });
});
