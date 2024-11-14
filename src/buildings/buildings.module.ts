import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuildingsService } from './buildings.service';
import { BuildingsController } from './buildings.controller';
import { Building } from './entities/building.entity';
import { Event } from '../events/entities/event.entity';
import { EventLog } from '../event-logs/entities/event-log.entity';
import { EventsModule } from '../events/events.module';
import { EventLogsModule } from '../event-logs/event-logs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Building, Event, EventLog]),
    EventsModule,
    EventLogsModule,
  ],
  controllers: [BuildingsController],
  providers: [BuildingsService],
  exports: [BuildingsService],
})
export class BuildingsModule {}
