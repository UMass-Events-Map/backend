import { ApiProperty } from '@nestjs/swagger';

export class BuildingResponseDto {
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
}

export class BuildingsResponseDto {
  @ApiProperty({ type: [BuildingResponseDto] })
  data: BuildingResponseDto[];

  @ApiProperty({ example: 42 })
  total: number;
}
