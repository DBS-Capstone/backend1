import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Bird } from '@prisma/client';

@Injectable()
export class BirdsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Bird[]> {
    return this.prisma.bird.findMany();
  }

  async findOne(id: number): Promise<Bird | null> {
    return this.prisma.bird.findUnique({
      where: { id },
    });
  }

  async findByName(name: string): Promise<Bird | null> {
    return this.prisma.bird.findUnique({
      where: { name },
    });
  }
}
