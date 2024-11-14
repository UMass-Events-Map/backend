import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Building } from './entities/building.entity';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { BuildingsResponseDto } from './dto/building-response.dto';
import { Event } from '../events/entities/event.entity';
import { EventLog } from '../event-logs/entities/event-log.entity';

@Injectable()
export class BuildingsService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Building)
    private buildingsRepository: Repository<Building>,
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(EventLog)
    private eventLogsRepository: Repository<EventLog>,
  ) {}

  create(createBuildingDto: CreateBuildingDto): Promise<Building> {
    const building = this.buildingsRepository.create(createBuildingDto);
    return this.buildingsRepository.save(building);
  }

  findOne(id: string): Promise<Building> {
    return this.buildingsRepository.findOne({
      where: { id },
      relations: ['events'],
    });
  }

  async update(
    id: string,
    updateBuildingDto: UpdateBuildingDto,
  ): Promise<Building> {
    await this.buildingsRepository.update(id, updateBuildingDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Get all events associated with this building
      const events = await this.eventsRepository.find({
        where: { building_id: id },
      });

      // Delete all event logs for these events
      for (const event of events) {
        await queryRunner.manager.delete(EventLog, { event_id: event.id });
      }

      // Delete all events associated with this building
      await queryRunner.manager.delete(Event, { building_id: id });

      // Finally, delete the building
      await queryRunner.manager.delete(Building, { id });

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(limit: number, offset: number): Promise<BuildingsResponseDto> {
    const [buildings, total] = await this.buildingsRepository.findAndCount({
      skip: offset,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      data: buildings,
      total,
    };
  }
}
