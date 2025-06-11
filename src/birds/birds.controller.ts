import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { BirdsService } from './birds.service';
import { Bird } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('birds')
@Controller('birds')
export class BirdsController {
  constructor(private readonly birdsService: BirdsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all birds with their photos' })
  @ApiResponse({ status: 200, description: 'List of all birds' })
  async findAll(): Promise<Bird[]> {
    return this.birdsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a bird by ID with its photos' })
  @ApiResponse({ status: 200, description: 'Bird found' })
  @ApiResponse({ status: 404, description: 'Bird not found' })
  async findOne(@Param('id') id: string): Promise<Bird> {
    const birdId = parseInt(id, 10);
    if (isNaN(birdId)) {
      throw new NotFoundException(`Invalid ID format: ${id}`);
    }
    const bird = await this.birdsService.findOne(birdId);
    if (!bird) {
      throw new NotFoundException(`Bird with ID ${id} not found`);
    }
    return bird;
  }

  // --- PERUBAHAN DI SINI ---
  @Get('name/:common_name') // Parameter URL diubah agar lebih deskriptif
  @ApiOperation({ summary: 'Get a bird by its common name' })
  @ApiResponse({ status: 200, description: 'Bird found' })
  @ApiResponse({ status: 404, description: 'Bird not found' })
  async findByCommonName(@Param('common_name') name: string): Promise<Bird> {
    // Memanggil metode findByCommonName yang benar dari service
    const bird = await this.birdsService.findByCommonName(name);
    if (!bird) {
      throw new NotFoundException(`Bird with name "${name}" not found`);
    }
    return bird;
  }
  // --- AKHIR PERUBAHAN ---

  @Get('habitat/:habitat')
  @ApiOperation({ summary: 'Get birds by habitat' })
  @ApiResponse({ status: 200, description: 'List of birds found in the habitat' })
  async findByHabitat(@Param('habitat') habitat: string): Promise<Bird[]> {
    const birds = await this.birdsService.findByHabitat(habitat);
    return birds;
  }
}
