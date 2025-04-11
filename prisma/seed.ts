import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.bird.createMany({
    data: [
      {
        name: 'Merpati',
        description:
          'Burung yang indah, sering ditemukan di daerah tropis dan perkotaan.',
        habitat: 'Perkotaan dan hutan tropis',
        sound: 'Kukuruyuk lembut',
        image: 'bird-a.png',
      },
      {
        name: 'Elang',
        description:
          'Burung pemangsa yang sangat mahir, dikenal sebagai puncak rantai makanan.',
        habitat: 'Pegunungan dan hutan',
        sound: 'Jeritan tajam',
        image: 'bird.png',
      },
      {
        name: 'Kakak Tua',
        description:
          'Burung yang sering bisa menirukan bahasa manusia, dan paling sering dipelihara manusia.',
        habitat: 'Hutan hujan tropis',
        sound: 'Suara meniru manusia',
        image: 'bird-c.png',
      },
    ],
  });
  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
