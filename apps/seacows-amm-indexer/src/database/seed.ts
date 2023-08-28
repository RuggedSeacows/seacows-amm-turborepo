import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  if (process.env.NETWORK === 'mainnet') {
    throw new Error(
      'We only have seed data for the devnet. Please run this script on the devnet',
    );
  }

  console.log('start seeding');

  await Promise.all([
    prisma.contracts.create({
      data: {
        address: '0x4AA65D5886Cb59Df1616E86fEC1fFe01b7Ece5B7',
        genesis_block: 7725617, // contract deploy block
        type: 'SeacowsPairFactory',
        is_active: true,
      },
    }),
  ]);

  console.log('end seeding');
}

main()
  .catch((error) => {
    console.error('seeding db', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
