import {
  Controller,
  Get,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { EventsService } from './events.service';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiBadRequestResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ErrorResponse, EventResponse } from './types/event.types';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('ids')
  @ApiOperation({ summary: 'Get all event IDs with pagination' })
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
    description: 'Returns list of event IDs and total count',
    schema: {
      type: 'object',
      properties: {
        ids: {
          type: 'array',
          items: { type: 'string', format: 'uuid' },
        },
        total: { type: 'number' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Error fetching IDs',
    schema: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  })
  async getAllIds(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ) {
    try {
      return await this.eventsService.findAllIds(limit, offset);
    } catch (error) {
      return {
        error: error.message || 'An error occurred while fetching event IDs',
      };
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'UUID of the event',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the event details',
    type: EventResponse,
  })
  @ApiBadRequestResponse({
    description: 'Error fetching event',
    type: ErrorResponse,
  })
  async findOne(@Param('id') id: string) {
    try {
      const event = await this.eventsService.findOne(id);
      if (!event) {
        return {
          error: 'Event not found',
        };
      }
      return event;
    } catch (error) {
      return {
        error: error.message || 'An error occurred while fetching the event',
      };
    }
  }
}
