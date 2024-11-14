import { IsString, IsOptional, IsUUID, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({
    description: 'The name of the event',
    example: 'Annual Conference',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'A brief description of the event',
    example: 'A conference to discuss annual progress and future plans',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The date of the event in YYYY-MM-DD format',
    example: '2023-12-25',
  })
  @IsString()
  date: string;

  @ApiProperty({
    description: 'The time of the event in HH:MM format',
    example: '14:00',
  })
  @IsString()
  time: string;

  @ApiProperty({
    description: 'The UUID of the building where the event is held',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  building_id?: string;

  @ApiProperty({
    description: 'The room number where the event is held',
    example: '101',
    required: false,
  })
  @IsString()
  @IsOptional()
  room_number?: string;

  @ApiProperty({
    description: 'The UUID of the organization hosting the event',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  organization_id?: string;

  @ApiProperty({
    description: 'URL to the event thumbnail image',
    example: 'https://example.com/images/event-thumbnail.png',
    required: false,
  })
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @ApiProperty({
    description: 'Expected number of attendees',
    example: 150,
    required: false,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  attendance?: number;
}
