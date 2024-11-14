import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event } from './entities/event.entity';
import { Building } from '../buildings/entities/building.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { EventLog } from '../event-logs/entities/event-log.entity';
import { ProfilesOrganizationsModule } from '../profiles-organizations/profiles-organizations.module';
import { EventLogsModule } from '../event-logs/event-logs.module';
import { ProfilesModule } from '../profiles/profiles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, Building, Organization, EventLog]),
    ProfilesOrganizationsModule,
    EventLogsModule,
    ProfilesModule,
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
