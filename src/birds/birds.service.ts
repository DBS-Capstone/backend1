import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Bird } from '@prisma/client';

@Injectable()
export class BirdsService {
    constructor(private prisma: PrismaService) {}

<<<<<<< HEAD
  /**
   * take  semua data burung beserta foto-fotonya.
   */
  async findAll(): Promise<Bird[]> {
    return this.prisma.bird.findMany({
      include: {
        foto_voice: true, //  data relasional dari tabel foto_voice
      },
    });
  }

  /**
   * ngambil satu burung berdasarkan ID beserta foto-fotonya.
   */
  async findOne(id: number): Promise<Bird | null> {
    return this.prisma.bird.findUnique({
      where: { id },
      include: {
        foto_voice: true, // data relasional
      },
    });
  }

  /**
   * take satu burung berdasarkan nama umum (common_name).
   * ini maake findFirst karena common_name mungkin kurangg goodd~.
   */
  async findByCommonName(name: string): Promise<Bird | null> {
    return this.prisma.bird.findFirst({
      where: {
        common_name: {
          contains: name, // <-- PERUBAHAN DARI 'equals' MENJADI 'contains'
          mode: 'insensitive',
        },
      },
      include: {
        foto_voice: true, // ini buat data relasional
      },
    });
  }

  /**
   * [BARU] Mengambil daftar burung berdasarkan habitat.
   */
  async findByHabitat(habitat: string): Promise<Bird[]> {
    return this.prisma.bird.findMany({
      where: {
        habitat: {
          contains: habitat,
          mode: 'insensitive',
        },
      },
      include: {
        foto_voice: true,
      },
    });
  }
=======
    /**
   * take  semua data burung beserta foto-fotonya.
   */
    async findAll(): Promise<Bird[]> {
        return this.prisma.bird.findMany({
            include: {
                foto_voice: true, //  data relasional dari tabel foto_voice
            },
        });
    }

    /**
   * ngambil satu burung berdasarkan ID beserta foto-fotonya.
   */
    async findOne(id: number): Promise<Bird | null> {
        return this.prisma.bird.findUnique({
            where: { id },
            include: {
                foto_voice: true, // data relasional
            },
        });
    }

    /**
   * take satu burung berdasarkan nama umum (common_name).
   * ini maake findFirst karena common_name mungkin kurangg goodd~.
   */
    async findByCommonName(name: string): Promise<Bird | null> {
        return this.prisma.bird.findFirst({
            where: {
                common_name: {
                    equals: name,
                    mode: 'insensitive',
                },
            },
            include: {
                foto_voice: true, // ini buat data relasional
            },
        });
    }

    async findBySpeciesCode(species_code: string): Promise<Bird | null> {
        return this.prisma.bird.findFirst({
            where: {
                species_code: {
                    equals: species_code,
                    mode: 'insensitive',
                },
            },
            include: {
                foto_voice: true, // ini buat data relasional
            },
        });
    }

    /**
   * [BARU] Mengambil daftar burung berdasarkan habitat.
   */
    async findByHabitat(habitat: string): Promise<Bird[]> {
        return this.prisma.bird.findMany({
            where: {
                habitat: {
                    contains: habitat,
                    mode: 'insensitive',
                },
            },
            include: {
                foto_voice: true,
            },
        });
    }
>>>>>>> 732212eb21b1dea6e1d18cfa365a2d4f24e8399f
}
