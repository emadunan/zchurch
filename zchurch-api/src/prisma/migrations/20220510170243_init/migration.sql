-- CreateTable
CREATE TABLE "books" (
    "id" SERIAL NOT NULL,
    "nam" VARCHAR(50) NOT NULL,
    "symbol" VARCHAR(5) NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "titlef" VARCHAR(100) NOT NULL,
    "titlelng" VARCHAR(255) NOT NULL,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chapters" (
    "id" SERIAL NOT NULL,
    "numbr" INTEGER NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "titlef" VARCHAR(50) NOT NULL,
    "bookId" INTEGER NOT NULL,

    CONSTRAINT "chapters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verses" (
    "id" SERIAL NOT NULL,
    "numbr" INTEGER NOT NULL,
    "textu" TEXT NOT NULL,
    "textf" TEXT NOT NULL,
    "chapterId" INTEGER NOT NULL,

    CONSTRAINT "verses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expressions" (
    "id" SERIAL NOT NULL,
    "textu" VARCHAR(100) NOT NULL,
    "textf" VARCHAR(200) NOT NULL,
    "definition" TEXT NOT NULL,

    CONSTRAINT "expressions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reactions" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reactions_on_expressions" (
    "id" SERIAL NOT NULL,
    "expressionId" INTEGER NOT NULL,
    "reactionId" INTEGER NOT NULL,
    "reactedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reactions_on_expressions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_verses_on_expressions" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_verses_on_expressions_AB_unique" ON "_verses_on_expressions"("A", "B");

-- CreateIndex
CREATE INDEX "_verses_on_expressions_B_index" ON "_verses_on_expressions"("B");

-- AddForeignKey
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verses" ADD CONSTRAINT "verses_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "chapters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reactions_on_expressions" ADD CONSTRAINT "reactions_on_expressions_expressionId_fkey" FOREIGN KEY ("expressionId") REFERENCES "expressions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reactions_on_expressions" ADD CONSTRAINT "reactions_on_expressions_reactionId_fkey" FOREIGN KEY ("reactionId") REFERENCES "reactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_verses_on_expressions" ADD CONSTRAINT "_verses_on_expressions_A_fkey" FOREIGN KEY ("A") REFERENCES "expressions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_verses_on_expressions" ADD CONSTRAINT "_verses_on_expressions_B_fkey" FOREIGN KEY ("B") REFERENCES "verses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
