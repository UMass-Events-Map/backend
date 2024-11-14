import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsResponse } from './types/event.types';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  create(createEventDto: CreateEventDto): Promise<Event> {
    const event = this.eventsRepository.create(createEventDto);
    return this.eventsRepository.save(event);
  }

  findAll(): Promise<Event[]> {
    return this.eventsRepository.find({
      relations: ['building', 'organization', 'event_logs'],
    });
  }

  findOne(id: string): Promise<Event> {
    return this.eventsRepository.findOne({
      where: { id },
      relations: ['building', 'organization', 'event_logs'],
    });
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    await this.eventsRepository.update(id, updateEventDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.eventsRepository.delete(id);
  }

  findByBuildingId(buildingId: string): Promise<Event[]> {
    return this.eventsRepository.find({
      where: { building_id: buildingId },
      relations: ['building', 'organization', 'event_logs'],
    });
  }

  async findAllIds(
    limit: number,
    offset: number,
  ): Promise<{ ids: string[]; total: number }> {
    const [events, total] = await this.eventsRepository.findAndCount({
      select: ['id'],
      skip: offset,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      ids: events.map((event) => event.id),
      total,
    };
  }

  async findByOrganizationId(
    organizationId: string,
    limit: number,
    offset: number,
  ): Promise<EventsResponse> {
    const [events, total] = await this.eventsRepository.findAndCount({
      where: { organization_id: organizationId },
      relations: ['building'],
      select: {
        building: {
          id: true,
          name: true,
          thumbnail: true,
          address: true,
          latitude: true,
          longitude: true,
          created_at: true,
          updated_at: true,
        },
      },
      skip: offset,
      take: limit,
      order: { date: 'ASC' },
    });

    return {
      data: events.map((event) => {
        const { building_id, ...eventWithoutBuildingId } = event;
        return {
          ...eventWithoutBuildingId,
        };
      }),
      total,
    };
  }
}
