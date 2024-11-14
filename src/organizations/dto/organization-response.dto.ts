import { ApiProperty } from '@nestjs/swagger';

export class OrganizationResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the organization',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the organization',
    example: 'Acme Corporation',
  })
  name: string;

  @ApiProperty({
    description: 'The email address of the organization',
    example: 'contact@acmecorp.com',
  })
  email: string;

  @ApiProperty({
    description: 'A detailed description of the organization',
    example: 'A leading provider of innovative solutions...',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: "URL to the organization's image or logo",
    example: 'https://example.com/images/acme-logo.png',
    nullable: true,
  })
  image_url: string | null;

  @ApiProperty({
    description: 'Physical address of the organization',
    example: '123 Main St, City, State 12345',
    nullable: true,
  })
  address: string | null;

  @ApiProperty({
    description: 'Whether the organization is verified',
    example: false,
  })
  verified: boolean;
}
