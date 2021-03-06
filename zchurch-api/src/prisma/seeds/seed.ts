import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

// Import books and chapters from data folder
import { arBooks } from "../../../data/ar-books";
import { arChapters } from "../../../data/ar-chapters";
import countries from "../../../data/countries";

const prisma = new PrismaClient();

/** Seed Chapters and Verses data */
async function seedChaptersAndVersesAsync(bookId: number) {
    // Read content from a file (.txt)
    const data = fs.readFileSync(
        path.join(
            __dirname,
            "../../../..",
            "plain-content",
            "bible-verses-unformatted",
            `${bookId}.txt`
        )
    );

    // Split the content into lines
    const content = data.toString();
    const lines = content.split(/\r?\n/);

    let idx = 0;
    let currentChapterId = 0;
    // Check if the line contains a verse - insert it in the verses table, or a chapter - insert it in the chapters table
    for (const line of lines) {
        if (line === "+++") {
            // Get the chapter data
            const chapterNumbr = arChapters[idx][0];
            const chapterTextu = arChapters[idx][1];
            const chapterTextf = arChapters[idx][2];

            // Insert a new record into chapters table
            const createdChapter = await prisma.chapter.create({
                data: {
                    numbr: chapterNumbr,
                    title: chapterTextu,
                    titlef: chapterTextf,
                    bookId: bookId,
                },
            });

            // Extract the chapter Id
            currentChapterId = createdChapter.id;
            idx++;
        } else {
            // Get the verse data
            const verseNumbr = line.substring(0, line.indexOf(" "));
            const verse = line.substring(line.indexOf(" ") + 1);

            // Insert a new record into the verses table
            await prisma.verse.create({
                data: {
                    numbr: +verseNumbr,
                    textu: verse,
                    textf: "placeholder",
                    chapterId: currentChapterId,
                },
            });
        }
    }

    return `Book#${bookId} was migrated`;
}

/** Update the formatted verses in the verses table */
const seedFormattedVersesAsync = async () => {
    let idx = 0;
    for (let i = 1; i < 67; i++) {
        const data = fs.readFileSync(
            path.join(
                __dirname,
                "../../../..",
                "plain-content",
                "bible-verses-formatted",
                `${i}.txt`
            )
        );

        // Split the content into lines
        const content = data.toString();
        const lines = content.split(/\r?\n/);

        // Check if the line contains a verse - update the verses table, or a chapter - increase the chapters' index by 1
        for (const line of lines) {
            if (line === "+++") {
                // Increase the chapters' index by 1
                idx++;
            } else {
                // Get the verse data
                const verseNumbr = line.substring(0, line.indexOf(" "));
                const verse = line.substring(line.indexOf(" ") + 1);

                // Update textf record into the verses table
                await prisma.verse.updateMany({
                    where: {
                        numbr: +verseNumbr,
                        chapterId: idx,
                    },
                    data: {
                        textf: verse,
                    },
                });
            }
        }

        console.log(`Textf in book#${i} was updated`);
    }
};

/** Seed Books data */
async function seedBooksAsync() {
    await prisma.book.createMany({
        data: arBooks,
    });

    const books = await prisma.book.findMany({
        orderBy: {
            id: "asc",
        },
    });

    for (const book of books) {
        const result = await seedChaptersAndVersesAsync(book.id);
        console.log(result);
    }
}

(async () => {
    await seedBooksAsync();
    await seedFormattedVersesAsync();

    await prisma.country.createMany({
        data: countries,
    });
})();
