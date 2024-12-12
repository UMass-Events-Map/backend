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
  Delete,
  Patch,
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
import { UpdateEventDto } from './dto/update-event.dto';

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
          items: {
            $ref: '#/components/schemas/EventLog',
          },
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

  @Delete(':id')
  @ApiOperation({ summary: 'Delete event by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'UUID of the event to delete',
    type: String,
  })
  @ApiHeader({
    name: 'authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Event successfully deleted',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Error deleting event',
    type: ErrorResponse,
  })
  async remove(
    @Param('id') id: string,
    @Headers('authorization') auth: string,
  ) {
    try {
      const event = await this.eventsService.findOne(id);
      if (!event) {
        return {
          error: 'Event not found',
        };
      }

      // Verify user has permission to delete the event
      const isMember = await this.profOrgService.verifyMembershipRole(
        auth,
        event.organization_id,
      );

      if (!isMember) {
        throw new UnauthorizedException(
          'Must be a member or admin of the organization to delete events',
        );
      }

      // Get profile ID for logging
      const profileId = await this.profilesService.getProfileIdFromToken(auth);

      // Create the deletion log BEFORE deleting the event
      await this.eventLogsService.create({
        event_id: id,
        profile_id: profileId,
        action: 'event.deleted',
      });

      // Delete the event
      await this.eventsService.remove(id);

      return {
        success: true,
        message: 'Event successfully deleted',
      };
    } catch (error) {
      return {
        error: error.message || 'An error occurred while deleting the event',
      };
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update event by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'UUID of the event to update',
    type: String,
  })
  @ApiHeader({
    name: 'authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiBody({
    type: UpdateEventDto,
    description: 'Event update data',
    examples: {
      basic: {
        summary: 'Basic Update',
        description: 'Update basic event details',
        value: {
          name: 'Updated Tech Conference 2024',
          description: 'Updated conference description',
          date: '2024-07-15',
          time: '15:30',
        },
      },
      full: {
        summary: 'Full Update',
        description: 'Update all available event fields',
        value: {
          name: 'Updated Tech Conference 2024',
          description: 'Updated conference description',
          date: '2024-07-15',
          time: '15:30',
          building_id: '123e4567-e89b-12d3-a456-426614174000',
          room_number: '202B',
          thumbnail: 'https://example.com/updated-thumbnail.jpg',
          attendance: 150,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Event successfully updated',
    type: EventsResponse,
  })
  @ApiBadRequestResponse({
    description: 'Error updating event',
    type: ErrorResponse,
  })
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Headers('authorization') auth: string,
  ) {
    try {
      const event = await this.eventsService.findOne(id);
      if (!event) {
        return {
          error: 'Event not found',
        };
      }

      // Verify user has permission to update the event
      const isMember = await this.profOrgService.verifyMembershipRole(
        auth,
        event.organization_id,
      );

      if (!isMember) {
        throw new UnauthorizedException(
          'Must be a member or admin of the organization to update events',
        );
      }

      // Get profile ID for logging
      const profileId = await this.profilesService.getProfileIdFromToken(auth);

      // Update the event
      const updatedEvent = await this.eventsService.update(id, updateEventDto);

      // Log the update
      await this.eventLogsService.create({
        event_id: id,
        profile_id: profileId,
        action: 'event.updated',
      });

      return {
        success: true,
        message: 'Event successfully updated',
        data: updatedEvent,
      };
    } catch (error) {
      return {
        error: error.message || 'An error occurred while updating the event',
      };
    }
  }
}
