import {
  Body,
  Controller,
  Delete,
  Headers,
  Post,
  UnauthorizedException,
  Param,
} from '@nestjs/common';
import { ProfilesOrganizationsService } from './profiles-organizations.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiHeader,
  ApiParam,
} from '@nestjs/swagger';
import { AddProfileOrganizationDto } from './dto/add-profile-organization.dto';

@ApiTags('Profiles Organizations')
@Controller('profiles-organizations')
export class ProfilesOrganizationsController {
  constructor(private readonly profOrgService: ProfilesOrganizationsService) {}

  @Post('add-member')
  @ApiOperation({
    summary: 'Add a user to an organization',
    description: 'Requires admin privileges',
  })
  @ApiHeader({
    name: 'authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully added to organization',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: {
          type: 'string',
          example: 'User successfully added to organization',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Error adding user to organization',
    schema: {
      type: 'object',
      properties: {
        error: {
          type: 'string',
          example: 'Unauthorized: Admin privileges required',
        },
      },
    },
  })
  async addMember(
    @Body() addProfileOrgDto: AddProfileOrganizationDto,
    @Headers('authorization') auth: string,
  ) {
    try {
      // First, verify that the requesting user is an admin of the organization
      const isAdmin = await this.profOrgService.verifyAdminRole(
        auth,
        addProfileOrgDto.organizationId,
      );

      if (!isAdmin) {
        throw new UnauthorizedException('Admin privileges required');
      }

      // Add the user to the organization
      await this.profOrgService.addProfileToOrganization(
        addProfileOrgDto.profileId,
        addProfileOrgDto.organizationId,
        addProfileOrgDto.role || 'member',
      );

      return {
        success: true,
        message: 'User successfully added to organization',
      };
    } catch (error) {
      return {
        error: error.message || 'Error adding user to organization',
      };
    }
  }

  @Delete(':organizationId/members/:profileId')
  @ApiOperation({
    summary: 'Remove a user from an organization',
    description: 'Requires admin privileges',
  })
  @ApiHeader({
    name: 'authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiParam({
    name: 'organizationId',
    description: 'ID of the organization',
    type: 'string',
  })
  @ApiParam({
    name: 'profileId',
    description: 'ID of the profile to remove',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully removed from organization',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: {
          type: 'string',
          example: 'User successfully removed from organization',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Error removing user from organization',
    schema: {
      type: 'object',
      properties: {
        error: {
          type: 'string',
          example: 'Unauthorized: Admin privileges required',
        },
      },
    },
  })
  async removeMember(
    @Param('organizationId') organizationId: string,
    @Param('profileId') profileId: string,
    @Headers('authorization') auth: string,
  ) {
    try {
      // Verify admin privileges
      const isAdmin = await this.profOrgService.verifyAdminRole(
        auth,
        organizationId,
      );

      if (!isAdmin) {
        throw new UnauthorizedException('Admin privileges required');
      }

      // Remove the user from the organization
      await this.profOrgService.removeProfileFromOrganization(
        profileId,
        organizationId,
      );

      return {
        success: true,
        message: 'User successfully removed from organization',
      };
    } catch (error) {
      return {
        error: error.message || 'Error removing user from organization',
      };
    }
  }
}
