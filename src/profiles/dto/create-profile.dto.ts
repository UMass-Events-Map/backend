import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsOptional()
  first_name?: string;

  @IsString()
  @IsOptional()
  last_name?: string;

  @IsEmail()
  email: string;
}
