import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { BirdsService } from './birds.service';
import { Bird } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('birds')
@Controller('birds')
export class BirdsController {
  constructor(private readonly birdsService: BirdsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all birds' })
  @ApiResponse({ status: 200, description: 'List of all birds' })
  async findAll(): Promise<Bird[]> {
    return this.birdsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a bird by ID' })
  @ApiResponse({ status: 200, description: 'Bird found' })
  @ApiResponse({ status: 404, description: 'Bird not found' })
  async findOne(@Param('id') id: string): Promise<Bird> {
    const bird = await this.birdsService.findOne(parseInt(id));
    if (!bird) {
      throw new NotFoundException(`Bird with ID ${id} not found`);
    }
    return bird;
  }

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
}
