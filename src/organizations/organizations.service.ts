import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private organizationsRepository: Repository<Organization>,
  ) {}

  create(createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
    const organization = this.organizationsRepository.create(
      createOrganizationDto,
    );
    return this.organizationsRepository.save(organization);
  }

  findAll(): Promise<Organization[]> {
    return this.organizationsRepository.find({
      relations: ['user', 'profiles'],
    });
  }

  findOne(id: string): Promise<Organization> {
    return this.organizationsRepository.findOne({
      where: { id },
      relations: ['user', 'profiles'],
    });
  }

  async update(
    id: string,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<Organization> {
    await this.organizationsRepository.update(id, updateOrganizationDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.organizationsRepository.delete(id);
  }

  async verify(id: string): Promise<Organization> {
    await this.organizationsRepository.update(id, { verified: true });
    return this.findOne(id);
  }

  async unverify(id: string): Promise<Organization> {
    await this.organizationsRepository.update(id, { verified: false });
    return this.findOne(id);
  }
}
