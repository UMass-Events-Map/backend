import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { CreateNameDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,
  ) {}

  private getSupabaseClient(jwt: string): SupabaseClient {
    return createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
        global: {
          headers: {
            Authorization: jwt,
          },
        },
      },
    );
  }

  async create(createProfileDto: CreateNameDto, jwt: string): Promise<void> {
    const supabase = this.getSupabaseClient(jwt);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      throw new Error(userError.message);
    }

    const profile = this.profilesRepository.create({
      id: user.id,
      first_name: createProfileDto.first_name,
      last_name: createProfileDto.last_name,
      email: user.email,
    });

    await this.profilesRepository.save(profile);
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

  async exists(id: string): Promise<boolean> {
    const count = await this.profilesRepository.count({
      where: { id },
    });
    return count > 0;
  }

  async getProfileIdFromToken(jwt: string): Promise<string> {
    const supabase = this.getSupabaseClient(jwt);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      throw new Error(userError.message);
    }

    return user.id;
  }

  async search(query: string): Promise<Partial<Profile>[]> {
    const profiles = await this.profilesRepository
      .createQueryBuilder('profile')
      .select([
        'profile.id',
        'profile.email',
        'profile.first_name',
        'profile.last_name',
      ])
      .where('LOWER(profile.email) LIKE LOWER(:query)', {
        query: `%${query}%`,
      })
      .getMany();

    return profiles;
  }
}
