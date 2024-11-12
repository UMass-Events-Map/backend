import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Building } from '../buildings/entities/building.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { EventLog } from '../event-logs/entities/event-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, Building, Organization, EventLog]),
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
