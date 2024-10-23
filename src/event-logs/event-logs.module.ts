import { Module } from '@nestjs/common';
import { EventLogsService } from './event-logs.service';
import { EventLogsController } from './event-logs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventLog } from './entities/event-log.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { Event } from '../events/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventLog, Profile, Event])],
  controllers: [EventLogsController],
  providers: [EventLogsService],
})
export class EventLogsModule {}
