import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { CreateProfilesAndOrganizations1709000000000 } from './migrations/1709000000000-CreateProfilesAndOrganizations';

dotenv.config();

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: configService.get('POSTGRES_PORT'),
  database: configService.get('POSTGRES_DB'),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: [CreateProfilesAndOrganizations1709000000000],
  synchronize: false,
});
