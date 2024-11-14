import {
  Body,
  Controller,
  Headers,
  Post,
  Get,
  Param,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { ProfilesOrganizationsService } from '../profiles-organizations/profiles-organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiBody,
  ApiHeader,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { OrganizationResponseDto } from './dto/organization-response.dto';
import { OrganizationDetailsResponseDto } from './dto/organization-member.dto';
import { EventLogsService } from '../event-logs/event-logs.service';
import { EventLog } from '../event-logs/entities/event-log.entity';

@ApiTags('Organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganizationsService,
    private readonly profOrgService: ProfilesOrganizationsService,
    private readonly eventLogsService: EventLogsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new organization',
  })
  @ApiBody({
    type: CreateOrganizationDto,
    description: 'Organization creation data',
  })
  @ApiHeader({
    name: 'authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'Organization successfully created',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: {
          type: 'string',
          example: 'Organization successfully created',
        },
        organizationId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Error creating organization',
    schema: {
      type: 'object',
      properties: {
        error: {
          type: 'string',
          example: 'An error occurred while creating the organization',
        },
      },
    },
  })
  async create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @Headers('authorization') auth: string,
  ) {
    try {
      // Get the profile ID from the auth token (similar to profiles service)
      const profileId = await this.organizationsService.getProfileIdFromToken(
        auth,
      );

      // Create the organization
      const organization = await this.organizationsService.create(
        createOrganizationDto,
      );

      // Add the creator as an admin
      await this.profOrgService.addProfileToOrganization(
        profileId,
        organization.id,
        'admin',
      );

      return {
        success: true,
        message: 'Organization successfully created',
        organizationId: organization.id,
      };
    } catch (error) {
      return {
        error:
          error.message || 'An error occurred while creating the organization',
      };
    }
  }

  @Get('profile/:profileId')
  @ApiOperation({
    summary: 'Get all organizations for a profile',
  })
  @ApiParam({
    name: 'profileId',
    type: 'string',
    description: 'ID of the profile to fetch organizations for',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all organizations the profile is a member of',
    type: OrganizationResponseDto,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'Error fetching organizations',
    schema: {
      type: 'object',
      properties: {
        error: {
          type: 'string',
          example: 'Error fetching organizations for profile',
        },
      },
    },
  })
  async getOrganizationsByProfileId(
    @Param('profileId') profileId: string,
  ): Promise<OrganizationResponseDto[]> {
    return this.organizationsService.findOrganizationsByProfileId(profileId);
  }

  @Get(':id/details')
  @ApiOperation({
    summary: 'Get organization details with members',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Organization ID',
    required: true,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of members to return',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Number of members to skip',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns organization details with paginated members',
    type: OrganizationDetailsResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Error fetching organization details',
    schema: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  })
  async getOrganizationDetails(
    @Param('id') id: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ) {
    try {
      const result = await this.organizationsService.getOrganizationDetails(
        id,
        limit,
        offset,
      );
      if (!result.organization) {
        return {
          error: 'Organization not found',
        };
      }
      return result;
    } catch (error) {
      return {
        error:
          error.message ||
          'An error occurred while fetching organization details',
      };
    }
  }

  @Get(':id/logs')
  @ApiOperation({
    summary: 'Get event logs for an organization',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Organization ID',
    required: true,
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
    description: 'Returns event logs for the organization with pagination',
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
    schema: {
      type: 'object',
      properties: {
        error: {
          type: 'string',
          example: 'Error fetching event logs for organization',
        },
      },
    },
  })
  async getOrganizationEventLogs(
    @Param('id') id: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ) {
    try {
      return await this.eventLogsService.findByOrganizationId(
        id,
        limit,
        offset,
      );
    } catch (error) {
      return {
        error: error.message || 'An error occurred while fetching event logs',
      };
    }
  }
}
