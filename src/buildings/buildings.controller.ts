import {
  Controller,
  Get,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Param,
  Post,
  Body,
  Delete,
} from '@nestjs/common';
import { BuildingsService } from './buildings.service';
import { EventsService } from '../events/events.service';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiBadRequestResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { EventsResponse } from '../events/types/event.types';
import { ErrorResponse } from './types/building.types';
import { BuildingsResponseDto } from './dto/building-response.dto';
import { CreateBuildingDto } from './dto/create-building.dto';
import { Building } from './entities/building.entity';

@ApiTags('Buildings')
@Controller('buildings')
export class BuildingsController {
  constructor(
    private readonly buildingsService: BuildingsService,
    private readonly eventsService: EventsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all buildings with pagination' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of records to return',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Number of records to skip',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns list of buildings and total count',
    type: BuildingsResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Error fetching buildings',
    type: ErrorResponse,
  })
  async findAll(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ) {
    try {
      return await this.buildingsService.findAll(limit, offset);
    } catch (error) {
      return {
        error: error.message || 'An error occurred while fetching buildings',
      };
    }
  }

  @Get(':id/events')
  @ApiOperation({ summary: 'Get all events for a specific building' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'UUID of the building',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns list of events for the building',
    type: [EventsResponse],
  })
  @ApiBadRequestResponse({
    description: 'Error fetching building events',
    type: ErrorResponse,
  })
  async findBuildingEvents(@Param('id') id: string) {
    try {
      const events = await this.eventsService.findByBuildingId(id);
      return events;
    } catch (error) {
      return {
        error:
          error.message || 'An error occurred while fetching building events',
      };
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a new building' })
  @ApiBody({ type: CreateBuildingDto })
  @ApiResponse({
    status: 201,
    description: 'Building successfully created',
    type: Building,
  })
  @ApiBadRequestResponse({
    description: 'Error creating building',
    type: ErrorResponse,
  })
  async create(@Body() createBuildingDto: CreateBuildingDto) {
    try {
      const building = await this.buildingsService.create(createBuildingDto);
      return building;
    } catch (error) {
      return {
        error: error.message || 'An error occurred while creating the building',
      };
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a building and all associated events and logs',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'UUID of the building to delete',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Building and associated data successfully deleted',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: {
          type: 'string',
          example: 'Building and associated data successfully deleted',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Error deleting building',
    type: ErrorResponse,
  })
  async remove(@Param('id') id: string) {
    try {
      // Check if building exists
      const building = await this.buildingsService.findOne(id);
      if (!building) {
        return {
          error: 'Building not found',
        };
      }

      await this.buildingsService.remove(id);

      return {
        success: true,
        message: 'Building and associated data successfully deleted',
      };
    } catch (error) {
      return {
        error: error.message || 'An error occurred while deleting the building',
      };
    }
  }
}
