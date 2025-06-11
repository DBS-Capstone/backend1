import {
  Controller,
  Get,
  Post,
  Param,
  NotFoundException,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BirdsService } from './birds.service';
import { Bird } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import * as FormData from 'form-data';
import axios from 'axios';

@ApiTags('birds')
@Controller('birds')
export class BirdsController {
  constructor(private readonly birdsService: BirdsService) {}

  // the main GET /birds endpoint
  @Get()
  @ApiOperation({ summary: 'Get all birds' })
  @ApiResponse({ status: 200, description: 'List of all birds' })
  async findAll(): Promise<Bird[]> {
    return this.birdsService.findAll();
  }

  // GET /birds/:id endpoint
  @Get(':id')
  @ApiOperation({ summary: 'Get a bird by ID' })
  @ApiResponse({ status: 200, description: 'Bird found' })
  @ApiResponse({ status: 404, description: 'Bird not found' })
  async findOne(@Param('id') id: string): Promise<Bird> {
    const bird = await this.birdsService.findOne(+id);
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
    const bird = await this.birdsService.findByCommonName(name);
    if (!bird) {
      throw new NotFoundException(`Bird with name ${name} not found`);
    }
    return bird;
  }

  @Get('habitat/:habitat')
  @ApiOperation({ summary: 'Get birds by habitat' })
  @ApiResponse({
    status: 200,
    description: 'List of birds found in the habitat',
  })
  async findByHabitat(@Param('habitat') habitat: string): Promise<Bird[]> {
    const birds = await this.birdsService.findByHabitat(habitat);
    return birds;
  }

  // Fixed POST endpoint for audio file upload
  @Post('upload-audio')
  @UseInterceptors(
    FileInterceptor('audio', {
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(wav|mp3|m4a|mpeg|x-m4a)$/)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              'Only audio files (.wav, .mp3, .m4a) are allowed!',
            ),
            false,
          );
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
    }),
  )
  @ApiOperation({ summary: 'Upload audio file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Audio file upload',
    schema: {
      type: 'object',
      properties: {
        audio: {
          type: 'string',
          format: 'binary',
          description: 'Audio file (.wav, .mp3, .m4a)',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Audio file processed successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid file type' })
  @ApiResponse({ status: 500, description: 'Error processing audio file' })
  async uploadAudio(@UploadedFile() file: Express.Multer.File) {
    // check if file was actually uploaded
    if (!file) {
      throw new BadRequestException('Audio file is required');
    }

    // check if file buffer exists (ensures it's actually a file, not text)
    if (!file.buffer || file.buffer.length === 0) {
      throw new BadRequestException('Invalid audio file provided');
    }

    if (!file.originalname || !file.mimetype) {
      throw new BadRequestException(
        'Invalid file format - text data is not allowed',
      );
    }

    console.log('Audio file received:', {
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    });

    try {
      const formData = new FormData();
      formData.append('file', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });

      // send request for inference to python backend
      const PYTHON_URL =
        process.env.PYTHON_BACKEND_URL || 'http://localhost:8000';
      console.log('Attempting to connect to:', PYTHON_URL);

      const response = await axios.post(`${PYTHON_URL}/predict`, formData, {
        headers: {
          ...formData.getHeaders(),
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        timeout: 60000,
      });

      const pythonResponse = response.data;
      const bird = await this.birdsService.findBySpeciesCode(
        pythonResponse.ebird_code,
      );

      if (!bird) {
        throw new NotFoundException(
          `Bird with ebird_code ${pythonResponse.ebird_code} not found`,
        );
      }

      return bird;
    } catch (error) {
      console.error('Error sending to Python backend:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      throw new BadRequestException('Failed to process audio file');
    }
  }
}
