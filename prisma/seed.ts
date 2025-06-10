//Update schema prisma seed

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Menghapus data lama (opsional, tapi bagus untuk konsistensi)
  await prisma.fotoVoice.deleteMany({});
  await prisma.bird.deleteMany({});

  // Membuat data burung baru
  const sikatanParuhPerahu = await prisma.bird.create({
    data: {
      species_code: 'bobfly1',
      ebird_url: 'https://ebird.org/species/bobfly1',
      common_name: 'Sikatan Paruh-Perahu',
      scientific_name: 'Megarynchus pitangua',
      family: 'Tyrannidae',
      order_name: 'Passeriformes',
      conservation_status: 'Risiko Rendah',
      habitat: 'Hutan dan area berhutan tropis dan subtropis...',
      description: 'Burung sikatan yang besar dan mencolok...',
      cool_facts: [
        'Dinamai karena paruhnya yang besar, lebar, dan berkait kuat.',
        'Memukulkan mangsa serangga dengan keras ke dahan sebelum memakannya.',
      ],
      // Kolom lain bisa ditambahkan sesuai kebutuhan
    },
  });

  const sikatanTopiKusam = await prisma.bird.create({
    data: {
      species_code: 'ducfly',
      ebird_url: 'https://ebird.org/species/ducfly',
      common_name: 'Sikatan Topi-Kusam',
      scientific_name: 'Myiarchus tuberculifer',
      family: 'Tyrannidae',
      order_name: 'Passeriformes',
      conservation_status: 'Risiko Rendah',
      habitat: 'Tersebar luas di berbagai habitat berhutan...',
      description: 'Sikatan berukuran sedang dan ramping...',
      cool_facts: [
        'Identifikasi paling baik dikonfirmasi melalui panggilannya yang khas dan sedih, bukan dari penglihatan.',
      ],
      // Kolom lain bisa ditambahkan sesuai kebutuhan
    },
  });

  // (Anda bisa menambahkan data burung lainnya di sini...)

  // Menambahkan data foto
  await prisma.fotoVoice.createMany({
    data: [
      {
        bird_id: sikatanParuhPerahu.id,
        foto_url:
          'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjtp_gQAcPSlPk6TZqRU4F9KeZgOUtywXqXfAp4_lXeLqccTvKkRpwOPmkmlxeJE0li53T49XojAzKYzLq4nMvONYfqI8fEm3_-lLCpfZsAGjLnd0U9V0vOMi55ZrEXyMtC6EASBjKsnzo/s2048/17DSCF7604.jpg',
      },
      {
        bird_id: sikatanTopiKusam.id,
        foto_url:
          'https://www.birdguides-cdn.com/cdn/gallery/birdguides/d42c9c30-0445-474d-a906-fdd63ec77c93.jpg?&format=webp&webp.quality=85&scale=down',
      },
      // Tambahkan URL foto lain sesuai ID burungnya
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
