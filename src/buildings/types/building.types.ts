import { ApiProperty } from '@nestjs/swagger';
import { Building } from '../entities/building.entity';

export class ErrorResponse {
  @ApiProperty({ example: 'Error message' })
  error: string;
}

export class BuildingResponse implements Building {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Engineering Building' })
  name: string;

  @ApiProperty({ example: 42.3601 })
  latitude: number;

  @ApiProperty({ example: -71.0589 })
  longitude: number;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty({ type: [Object] })
  events: any[];
}
