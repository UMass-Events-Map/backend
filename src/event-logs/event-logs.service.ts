import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventLog } from './entities/event-log.entity';
import { CreateEventLogDto } from './dto/create-event-log.dto';
import { UpdateEventLogDto } from './dto/update-event-log.dto';

@Injectable()
export class EventLogsService {
  constructor(
    @InjectRepository(EventLog)
    private eventLogsRepository: Repository<EventLog>,
  ) {}

  create(createEventLogDto: CreateEventLogDto): Promise<EventLog> {
    const eventLog = this.eventLogsRepository.create(createEventLogDto);
    return this.eventLogsRepository.save(eventLog);
  }

  findAll(): Promise<EventLog[]> {
    return this.eventLogsRepository.find({
      relations: ['profile', 'event'],
    });
  }

  findOne(id: string): Promise<EventLog> {
    return this.eventLogsRepository.findOne({
      where: { id },
      relations: ['profile', 'event'],
    });
  }

  async update(
    id: string,
    updateEventLogDto: UpdateEventLogDto,
  ): Promise<EventLog> {
    await this.eventLogsRepository.update(id, updateEventLogDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.eventLogsRepository.delete(id);
  }

  findByProfileId(profileId: string): Promise<EventLog[]> {
    return this.eventLogsRepository.find({
      where: { profile_id: profileId },
      relations: ['profile', 'event'],
    });
  }

  findByEventId(eventId: string): Promise<EventLog[]> {
    return this.eventLogsRepository.find({
      where: { event_id: eventId },
      relations: ['profile', 'event'],
    });
  }
}
