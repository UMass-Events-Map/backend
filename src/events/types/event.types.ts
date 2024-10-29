import { ApiProperty } from '@nestjs/swagger';
import { Event } from '../entities/event.entity';

export class ErrorResponse {
  @ApiProperty({ example: 'Error message' })
  error: string;
}

export class EventResponse implements Event {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Tech Conference 2024' })
  name: string;

  @ApiProperty({ example: 'Annual technology conference', nullable: true })
  description: string;

  @ApiProperty({ example: '2024-06-15' })
  date: string;

  @ApiProperty({ example: '09:00:00' })
  time: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  building_id: string;

  @ApiProperty({ example: '101A', nullable: true })
  room_number: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  organization_id: string;

  @ApiProperty({ example: 'https://example.com/thumbnail.jpg', nullable: true })
  thumbnail: string;

  @ApiProperty({ example: 100 })
  attendance: number;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty()
  building: any;

  @ApiProperty()
  organization: any;

  @ApiProperty()
  event_logs: any[];
}
