/*
  Warnings:

  - You are about to drop the column `recieverId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the `Chat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserChats` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `receiverId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_recieverId_fkey";

-- DropForeignKey
ALTER TABLE "_UserChats" DROP CONSTRAINT "_UserChats_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserChats" DROP CONSTRAINT "_UserChats_B_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "recieverId",
ADD COLUMN     "receiverId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Chat";

-- DropTable
DROP TABLE "_UserChats";

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
