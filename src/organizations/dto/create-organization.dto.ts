import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  MinLength,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({
    description: 'The name of the organization',
    minLength: 2,
    maxLength: 100,
    example: 'Acme Corporation',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  organization_name: string;

  @ApiProperty({
    description: 'The email address for the organization',
    example: 'contact@acmecorp.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'A detailed description of the organization',
    example: 'A leading provider of innovative solutions...',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: "URL to the organization's image or logo",
    example: 'https://example.com/images/acme-logo.png',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  image_url?: string;

  @ApiProperty({
    description: 'Physical address of the organization',
    example: '123 Main St, City, State 12345',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;
}
