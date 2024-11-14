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

  async findByProfileId(
    profileId: string,
    limit: number,
    offset: number,
  ): Promise<{ data: EventLog[]; total: number }> {
    const [eventLogs, total] = await this.eventLogsRepository.findAndCount({
      where: { profile_id: profileId },
      relations: ['profile', 'event'],
      skip: offset,
      take: limit,
    });

    const cleanedLogs = eventLogs.map((eventLog) => {
      const obj = {
        ...eventLog,
        profile: eventLog['__profile__'],
        event: eventLog['__event__'],
      };
      delete obj['__profile__'];
      delete obj['__event__'];
      return obj;
    });

    return {
      data: cleanedLogs,
      total,
    };
  }

  async findByEventId(
    eventId: string,
    limit: number,
    offset: number,
  ): Promise<{ data: EventLog[]; total: number }> {
    const [eventLogs, total] = await this.eventLogsRepository.findAndCount({
      where: { event_id: eventId },
      relations: ['profile', 'event'],
      skip: offset,
      take: limit,
    });

    const cleanedLogs = eventLogs.map((eventLog) => {
      const obj = {
        ...eventLog,
        profile: eventLog['__profile__'],
        event: eventLog['__event__'],
      };
      delete obj['__profile__'];
      delete obj['__event__'];
      return obj;
    });

    return {
      data: cleanedLogs,
      total,
    };
  }

  async findByOrganizationId(
    organizationId: string,
    limit: number,
    offset: number,
  ): Promise<{ data: EventLog[]; total: number }> {
    const [eventLogs, total] = await this.eventLogsRepository
      .createQueryBuilder('event_log')
      .innerJoin('events', 'org_event', 'event_log.event_id = org_event.id')
      .where('org_event.organization_id = :organizationId', { organizationId })
      .leftJoinAndSelect('event_log.profile', 'profile')
      .leftJoinAndSelect('event_log.event', 'event')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    const cleanedLogs = eventLogs.map((eventLog) => {
      const obj = {
        ...eventLog,
        profile: eventLog['__profile__'],
        event: eventLog['__event__'],
      };
      delete obj['__profile__'];
      delete obj['__event__'];
      return obj;
    });

    return {
      data: cleanedLogs,
      total,
    };
  }
}
