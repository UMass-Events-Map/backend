import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,
  ) {}

  create(createProfileDto: CreateProfileDto): Promise<Profile> {
    const profile = this.profilesRepository.create(createProfileDto);
    return this.profilesRepository.save(profile);
  }

  findAll(): Promise<Profile[]> {
    return this.profilesRepository.find({
      relations: ['user', 'organizations'],
    });
  }

  findOne(id: string): Promise<Profile> {
    return this.profilesRepository.findOne({
      where: { id },
      relations: ['user', 'organizations'],
    });
  }

  findByEmail(email: string): Promise<Profile> {
    return this.profilesRepository.findOne({
      where: { email },
      relations: ['user', 'organizations'],
    });
  }

  async update(
    id: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    await this.profilesRepository.update(id, updateProfileDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.profilesRepository.delete(id);
  }

  async verify(id: string): Promise<Profile> {
    await this.profilesRepository.update(id, { verified: true });
    return this.findOne(id);
  }

  async unverify(id: string): Promise<Profile> {
    await this.profilesRepository.update(id, { verified: false });
    return this.findOne(id);
  }
}
