import {
  Body,
  Controller,
  Headers,
  Post,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
  ApiHeader,
} from '@nestjs/swagger';
import { CreateNameDto } from './dto/create-profile.dto';

@ApiTags('Profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new user profile with first and last name',
  })
  @ApiResponse({
    status: 201,
    description: 'Profile successfully created',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Error creating user or profile',
    schema: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  })
  async create(
    @Body() createNameDto: CreateNameDto,
    @Headers('authorization') auth: string,
  ) {
    try {
      await this.profilesService.create(createNameDto, auth);
      return {
        success: true,
        message: 'Profile successfully created',
      };
    } catch (error) {
      return {
        error: error.message || 'An error occurred while creating the user',
      };
    }
  }

  @Get('exists/:id')
  @ApiOperation({
    summary: 'Check if a profile exists by UUID',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile existence check result',
    schema: {
      type: 'object',
      properties: {
        exists: { type: 'boolean' },
      },
    },
  })
  async checkExists(@Param('id') id: string) {
    const exists = await this.profilesService.exists(id);
    return { exists };
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search for profiles by email',
  })
  @ApiQuery({
    name: 'query',
    required: true,
    description: 'Email search query',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns matching profiles',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string' },
          first_name: { type: 'string' },
          last_name: { type: 'string' },
        },
      },
    },
  })
  async search(@Query('query') query: string) {
    try {
      const profiles = await this.profilesService.search(query);
      return profiles;
    } catch (error) {
      return {
        error: error.message || 'An error occurred while searching profiles',
      };
    }
  }
}
