import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { BirdsService } from './birds.service';
import { Bird } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('birds')
@Controller('birds')
export class BirdsController {
  constructor(private readonly birdsService: BirdsService) {}

  // ... (metode findAll, findOne, findByName yang sudah ada) ...

  @Get('name/:name')
  @ApiOperation({ summary: 'Get a bird by name' })
  @ApiResponse({ status: 200, description: 'Bird found' })
  @ApiResponse({ status: 404, description: 'Bird not found' })
  async findByName(@Param('name') name: string): Promise<Bird> {
    const bird = await this.birdsService.findByName(name);
    if (!bird) {
      throw new NotFoundException(`Bird with name ${name} not found`);
    }
    return bird;
  }
  
  // --- INI ENDPOINT BARU ---
  @Get('habitat/:habitat')
  @ApiOperation({ summary: 'Get birds by habitat' })
  @ApiResponse({ status: 200, description: 'List of birds found in the habitat' })
  async findByHabitat(@Param('habitat') habitat: string): Promise<Bird[]> {
    const birds = await this.birdsService.findByHabitat(habitat);
    return birds;
  }
}
