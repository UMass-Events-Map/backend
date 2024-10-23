import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateEventLogDto {
  @IsUUID()
  @IsOptional()
  profile_id?: string;

  @IsUUID()
  @IsOptional()
  event_id?: string;

  @IsString()
  action: string;
}
