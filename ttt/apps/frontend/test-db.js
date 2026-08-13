const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log("Users:", users.length);
  
  const roomParticipants = await prisma.roomParticipant.findMany({ include: { finalResult: true } });
  console.log("Participants:", roomParticipants);
}
main().catch(console.error).finally(() => prisma.$disconnect());
