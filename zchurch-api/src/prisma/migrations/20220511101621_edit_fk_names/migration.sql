/*
  Warnings:

  - You are about to drop the column `bookId` on the `chapters` table. All the data in the column will be lost.
  - You are about to drop the column `expressionId` on the `reactions_on_expressions` table. All the data in the column will be lost.
  - You are about to drop the column `reactionId` on the `reactions_on_expressions` table. All the data in the column will be lost.
  - You are about to drop the column `chapterId` on the `verses` table. All the data in the column will be lost.
  - Added the required column `book_id` to the `chapters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expression_id` to the `reactions_on_expressions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reaction_id` to the `reactions_on_expressions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chapter_id` to the `verses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "chapters" DROP CONSTRAINT "chapters_bookId_fkey";

-- DropForeignKey
ALTER TABLE "reactions_on_expressions" DROP CONSTRAINT "reactions_on_expressions_expressionId_fkey";

-- DropForeignKey
ALTER TABLE "reactions_on_expressions" DROP CONSTRAINT "reactions_on_expressions_reactionId_fkey";

-- DropForeignKey
ALTER TABLE "verses" DROP CONSTRAINT "verses_chapterId_fkey";

-- AlterTable
ALTER TABLE "chapters" DROP COLUMN "bookId",
ADD COLUMN     "book_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "reactions_on_expressions" DROP COLUMN "expressionId",
DROP COLUMN "reactionId",
ADD COLUMN     "expression_id" INTEGER NOT NULL,
ADD COLUMN     "reaction_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "verses" DROP COLUMN "chapterId",
ADD COLUMN     "chapter_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verses" ADD CONSTRAINT "verses_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reactions_on_expressions" ADD CONSTRAINT "reactions_on_expressions_expression_id_fkey" FOREIGN KEY ("expression_id") REFERENCES "expressions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reactions_on_expressions" ADD CONSTRAINT "reactions_on_expressions_reaction_id_fkey" FOREIGN KEY ("reaction_id") REFERENCES "reactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
