import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { ProfilesOrganizationsModule } from '../profiles-organizations/profiles-organizations.module';
import { ProfilesModule } from '../profiles/profiles.module';
import { EventLogsModule } from '../event-logs/event-logs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization]),
    ProfilesOrganizationsModule,
    ProfilesModule,
    EventLogsModule,
  ],
  providers: [OrganizationsService],
  controllers: [OrganizationsController],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
