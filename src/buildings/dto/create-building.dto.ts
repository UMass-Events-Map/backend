import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsNumber,
  IsOptional,
  IsUrl,
  Min,
  Max,
} from 'class-validator';

export class CreateBuildingDto {
  @ApiProperty({
    description: 'The name of the building',
    example: 'Engineering Building',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Physical address of the building',
    example: '123 University Drive, Campus Area',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  address: string;

  @ApiProperty({
    description: 'URL to the building thumbnail image',
    example: 'https://example.com/images/eng-building.jpg',
    maxLength: 255,
    required: false,
  })
  @IsUrl()
  @IsOptional()
  @MaxLength(255)
  thumbnail?: string;

  @ApiProperty({
    description: 'Latitude coordinate of the building location',
    example: 42.3601,
    minimum: -90,
    maximum: 90,
  })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({
    description: 'Longitude coordinate of the building location',
    example: -71.0589,
    minimum: -180,
    maximum: 180,
  })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;
}
