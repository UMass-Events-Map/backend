import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Building } from './entities/building.entity';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';

@Injectable()
export class BuildingsService {
  constructor(
    @InjectRepository(Building)
    private buildingsRepository: Repository<Building>,
  ) {}

  create(createBuildingDto: CreateBuildingDto): Promise<Building> {
    const building = this.buildingsRepository.create(createBuildingDto);
    return this.buildingsRepository.save(building);
  }

  findAll(): Promise<Building[]> {
    return this.buildingsRepository.find({
      relations: ['events'],
    });
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
    await this.buildingsRepository.delete(id);
  }

  async findAllPaginated(
    limit: number,
    offset: number,
  ): Promise<{ buildings: Building[]; total: number }> {
    const [buildings, total] = await this.buildingsRepository.findAndCount({
      relations: ['events'],
      skip: offset,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      buildings,
      total,
    };
  }
}
