-- DropForeignKey
ALTER TABLE "Imagem" DROP CONSTRAINT "Imagem_imovelId_fkey";

-- AddForeignKey
ALTER TABLE "Imagem" ADD CONSTRAINT "Imagem_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "Imovel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
