import {
  Controller,
  Get,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Param,
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
} from '@nestjs/swagger';
import { EventResponse } from '../events/types/event.types';
import { ErrorResponse } from './types/building.types';

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
    schema: {
      type: 'object',
      properties: {
        buildings: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string' },
              latitude: { type: 'number' },
              longitude: { type: 'number' },
              created_at: { type: 'string', format: 'date-time' },
              updated_at: { type: 'string', format: 'date-time' },
              events: { type: 'array', items: { type: 'object' } },
            },
          },
        },
        total: { type: 'number' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Error fetching buildings',
    schema: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  })
  async findAll(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ) {
    try {
      return await this.buildingsService.findAllPaginated(limit, offset);
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
    type: [EventResponse],
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
}
