import { ApiProperty } from '@nestjs/swagger';
import { OrganizationResponseDto } from './organization-response.dto';

export class OrganizationMemberProfileDto {
  @ApiProperty({
    description: 'The unique identifier of the profile',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Email address of the profile',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'First name of the profile',
    example: 'John',
  })
  first_name: string;

  @ApiProperty({
    description: 'Last name of the profile',
    example: 'Doe',
  })
  last_name: string;
}

export class OrganizationMemberDto {
  @ApiProperty({
    description: 'Role of the member in the organization',
    example: 'admin',
  })
  role: string;

  @ApiProperty({
    description: 'Profile details of the member',
    type: OrganizationMemberProfileDto,
  })
  profile: OrganizationMemberProfileDto;
}

export class OrganizationMembersResponseDto {
  @ApiProperty({
    description: 'List of organization members',
    type: [OrganizationMemberDto],
  })
  data: OrganizationMemberDto[];

  @ApiProperty({
    description: 'Total number of members',
    example: 42,
  })
  total: number;
}

export class OrganizationDetailsResponseDto {
  @ApiProperty({
    description: 'Organization details',
    type: () => OrganizationResponseDto,
  })
  organization: OrganizationResponseDto;

  @ApiProperty({
    description: 'Organization members with pagination',
    type: OrganizationMembersResponseDto,
  })
  members: OrganizationMembersResponseDto;
}
