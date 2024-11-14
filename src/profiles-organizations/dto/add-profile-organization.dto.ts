import { IsUUID, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddProfileOrganizationDto {
  @ApiProperty({
    description: 'The UUID of the profile to add to the organization',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  profileId: string;

  @ApiProperty({
    description: 'The UUID of the organization to add the profile to',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  organizationId: string;

  @ApiProperty({
    description: 'The role of the profile within the organization',
    example: 'member',
    required: false,
  })
  @IsString()
  @IsOptional()
  role?: string;
}
