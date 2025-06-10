import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Bird } from '@prisma/client';

@Injectable()
export class BirdsService {
  constructor(private prisma: PrismaService) {}

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
}
