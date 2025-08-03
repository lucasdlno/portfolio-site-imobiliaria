// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'lucasaraujosud@gmail.com'; // SEU EMAIL DE LOGIN
  const password = 'senhaforte123'; // SUA SENHA

  // Criptografa a senha
  const hashedPassword = await bcrypt.hash(password, 10);

  // Deleta o usuário antigo se existir, para não dar erro ao rodar de novo
  await prisma.user.deleteMany({ where: { email } });

  // Cria o novo usuário no banco
  const user = await prisma.user.create({
    data: {
      email: email,
      password: hashedPassword,
    },
  });
  console.log(`Usuário admin criado com sucesso: ${user.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });