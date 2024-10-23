import { IsUUID, IsString, IsOptional } from 'class-validator';

export class AddProfileOrganizationDto {
  @IsUUID()
  profileId: string;

  @IsUUID()
  organizationId: string;

  @IsString()
  @IsOptional()
  role?: string;
}
