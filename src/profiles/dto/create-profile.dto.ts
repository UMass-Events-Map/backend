import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateProfileDto {
  @IsUUID()
  id: string;

  @IsString()
  @IsOptional()
  first_name?: string;

  @IsString()
  @IsOptional()
  last_name?: string;
}

export class CreateNameDto {
  @ApiProperty({ name: 'first_name' })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ name: 'last_name' })
  @IsString()
  @IsNotEmpty()
  last_name: string;
}
