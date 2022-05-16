-- CreateTable
CREATE TABLE "Book" (
    "id" SERIAL NOT NULL,
    "nam" VARCHAR(50) NOT NULL,
    "symbol" VARCHAR(5) NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "titlef" VARCHAR(100) NOT NULL,
    "titlelng" VARCHAR(255) NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" SERIAL NOT NULL,
    "numbr" INTEGER NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "titlef" VARCHAR(50) NOT NULL,
    "bookId" INTEGER NOT NULL,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Verse" (
    "id" SERIAL NOT NULL,
    "numbr" INTEGER NOT NULL,
    "textu" TEXT NOT NULL,
    "textf" TEXT NOT NULL,
    "chapterId" INTEGER NOT NULL,

    CONSTRAINT "Verse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expression" (
    "id" SERIAL NOT NULL,
    "textu" VARCHAR(100) NOT NULL,
    "textf" VARCHAR(200) NOT NULL,
    "definition" TEXT NOT NULL,

    CONSTRAINT "Expression_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reaction" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReactionToExpression" (
    "id" SERIAL NOT NULL,
    "expressionId" INTEGER NOT NULL,
    "reactionId" INTEGER NOT NULL,
    "reactedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReactionToExpression_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ExpressionToVerse" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ExpressionToVerse_AB_unique" ON "_ExpressionToVerse"("A", "B");

-- CreateIndex
CREATE INDEX "_ExpressionToVerse_B_index" ON "_ExpressionToVerse"("B");

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verse" ADD CONSTRAINT "Verse_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReactionToExpression" ADD CONSTRAINT "ReactionToExpression_expressionId_fkey" FOREIGN KEY ("expressionId") REFERENCES "Expression"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReactionToExpression" ADD CONSTRAINT "ReactionToExpression_reactionId_fkey" FOREIGN KEY ("reactionId") REFERENCES "Reaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExpressionToVerse" ADD CONSTRAINT "_ExpressionToVerse_A_fkey" FOREIGN KEY ("A") REFERENCES "Expression"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExpressionToVerse" ADD CONSTRAINT "_ExpressionToVerse_B_fkey" FOREIGN KEY ("B") REFERENCES "Verse"("id") ON DELETE CASCADE ON UPDATE CASCADE;
