import { IsString, IsOptional, IsUUID, IsInt, Min } from 'class-validator';

export class CreateEventDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  date: string;

  @IsString()
  time: string;

  @IsUUID()
  @IsOptional()
  building_id?: string;

  @IsString()
  @IsOptional()
  room_number?: string;

  @IsUUID()
  @IsOptional()
  organization_id?: string;

  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  attendance?: number;
}
