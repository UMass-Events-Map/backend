import { IsString, IsEmail, IsUUID } from 'class-validator';

export class CreateOrganizationDto {
  @IsUUID()
  user_id: string;

  @IsString()
  organization_name: string;

  @IsEmail()
  email: string;
}
