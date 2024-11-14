import {
  Controller,
  Get,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Param,
  Post,
  Body,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { EventsService } from './events.service';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiBadRequestResponse,
  ApiParam,
  ApiHeader,
  ApiBody,
} from '@nestjs/swagger';
import { ErrorResponse, EventsResponse } from './types/event.types';
import { CreateEventDto } from './dto/create-event.dto';
import { ProfilesOrganizationsService } from '../profiles-organizations/profiles-organizations.service';
import { EventLogsService } from '../event-logs/event-logs.service';
import { ProfilesService } from '../profiles/profiles.service';
import { EventLog } from 'src/event-logs/entities/event-log.entity';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly profOrgService: ProfilesOrganizationsService,
    private readonly eventLogsService: EventLogsService,
    private readonly profilesService: ProfilesService,
  ) {}

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
    type: EventsResponse,
  })
  @ApiBadRequestResponse({
    description: 'Error fetching IDs',
    type: ErrorResponse,
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
    type: EventsResponse,
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

  @Post('organization/:organizationId')
  @ApiOperation({ summary: 'Create an event under an organization' })
  @ApiParam({
    name: 'organizationId',
    required: true,
    description: 'UUID of the organization',
    type: String,
  })
  @ApiHeader({
    name: 'authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({
    status: 201,
    description: 'Event successfully created',
    type: EventsResponse,
  })
  @ApiBadRequestResponse({
    description: 'Error creating event',
    type: ErrorResponse,
  })
  async createUnderOrganization(
    @Param('organizationId') organizationId: string,
    @Body() createEventDto: CreateEventDto,
    @Headers('authorization') auth: string,
  ) {
    try {
      const profileId = await this.profilesService.getProfileIdFromToken(auth);

      const isMember = await this.profOrgService.verifyMembershipRole(
        auth,
        organizationId,
      );

      if (!isMember) {
        throw new UnauthorizedException(
          'Must be a member or admin of the organization to create events',
        );
      }

      // Set the organization ID in the DTO
      const eventData = {
        ...createEventDto,
        organization_id: organizationId,
      };

      // Create the event
      const event = await this.eventsService.create(eventData);

      // Create event log with profile ID
      await this.eventLogsService.create({
        event_id: event.id,
        profile_id: profileId,
        action: 'event.created',
      });

      return {
        success: true,
        message: 'Event successfully created',
        eventId: event.id,
      };
    } catch (error) {
      return {
        error: error.message || 'An error occurred while creating the event',
      };
    }
  }

  @Get('organization/:organizationId/events')
  @ApiOperation({ summary: 'Get events by organization ID' })
  @ApiParam({
    name: 'organizationId',
    required: true,
    description: 'UUID of the organization',
    type: String,
  })
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
    description: 'Returns list of events for the organization',
    type: [EventsResponse],
  })
  @ApiBadRequestResponse({
    description: 'Error fetching events',
    type: ErrorResponse,
  })
  async getEventsByOrganizationId(
    @Param('organizationId') organizationId: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ) {
    try {
      return await this.eventsService.findByOrganizationId(
        organizationId,
        limit,
        offset,
      );
    } catch (error) {
      return {
        error: error.message || 'An error occurred while fetching events',
      };
    }
  }

  @Get(':id/logs')
  @ApiOperation({ summary: 'Get event logs by event ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'UUID of the event',
    type: String,
  })
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
    description: 'Returns list of event logs for the event with pagination',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { type: 'object', ref: EventLog },
        },
        total: {
          type: 'number',
          description: 'Total number of records',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Error fetching event logs',
    type: ErrorResponse,
  })
  async getEventLogs(
    @Param('id') id: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ) {
    try {
      return await this.eventLogsService.findByEventId(id, limit, offset);
    } catch (error) {
      return {
        error: error.message || 'An error occurred while fetching event logs',
      };
    }
  }
}
