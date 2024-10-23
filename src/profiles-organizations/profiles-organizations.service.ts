import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfilesOrganizations } from './entities/profiles-organizations.entity';

@Injectable()
export class ProfilesOrganizationsService {
  constructor(
    @InjectRepository(ProfilesOrganizations)
    private readonly profOrgRepository: Repository<ProfilesOrganizations>,
  ) {}

  async addProfileToOrganization(
    profileId: string,
    organizationId: string,
    role: string = 'member',
  ): Promise<ProfilesOrganizations> {
    const profOrg = this.profOrgRepository.create({
      profile_id: profileId,
      organization_id: organizationId,
      role,
    });
    return this.profOrgRepository.save(profOrg);
  }

  findAll(): Promise<ProfilesOrganizations[]> {
    return this.profOrgRepository.find({
      relations: ['profile', 'organization'],
    });
  }

  findByProfileId(profileId: string): Promise<ProfilesOrganizations[]> {
    return this.profOrgRepository.find({
      where: { profile_id: profileId },
      relations: ['profile', 'organization'],
    });
  }

  findByOrganizationId(
    organizationId: string,
  ): Promise<ProfilesOrganizations[]> {
    return this.profOrgRepository.find({
      where: { organization_id: organizationId },
      relations: ['profile', 'organization'],
    });
  }

  async removeProfileFromOrganization(
    profileId: string,
    organizationId: string,
  ): Promise<void> {
    const result = await this.profOrgRepository.delete({
      profile_id: profileId,
      organization_id: organizationId,
    });
    if (result.affected === 0) {
      throw new NotFoundException(
        'Profile-Organization relationship not found',
      );
    }
  }

  async updateRole(
    profileId: string,
    organizationId: string,
    role: string,
  ): Promise<ProfilesOrganizations> {
    await this.profOrgRepository.update(
      { profile_id: profileId, organization_id: organizationId },
      { role },
    );
    return this.profOrgRepository.findOne({
      where: { profile_id: profileId, organization_id: organizationId },
      relations: ['profile', 'organization'],
    });
  }
}
