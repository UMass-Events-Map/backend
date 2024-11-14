import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ProfilesOrganizations } from './entities/profiles-organizations.entity';
import { ProfilesService } from '../profiles/profiles.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class ProfilesOrganizationsService {
  constructor(
    @InjectRepository(ProfilesOrganizations)
    private readonly profOrgRepository: Repository<ProfilesOrganizations>,
    private readonly profilesService: ProfilesService,
  ) {}

  async addProfileToOrganization(
    profileId: string,
    organizationId: string,
    role = 'member',
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
    console.log(profileId, organizationId);
    console.log('removing');
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

  async verifyAdminRole(
    auth: string,
    organizationId: string,
  ): Promise<boolean> {
    try {
      // Get the profile ID from the auth token
      const profileId = await this.profilesService.getProfileIdFromToken(auth);

      // Find the profile-organization relationship
      const profOrg = await this.profOrgRepository.findOne({
        where: {
          profile_id: profileId,
          organization_id: organizationId,
          role: 'admin',
        },
      });

      return !!profOrg;
    } catch (error) {
      return false;
    }
  }

  async verifyMembershipRole(
    auth: string,
    organizationId: string,
  ): Promise<boolean> {
    try {
      // Get the profile ID from the auth token
      const profileId = await this.profilesService.getProfileIdFromToken(auth);

      // Find the profile-organization relationship
      const profOrg = await this.profOrgRepository.findOne({
        where: {
          profile_id: profileId,
          organization_id: organizationId,
          role: In(['member', 'admin']),
        },
      });

      return !!profOrg;
    } catch (error) {
      return false;
    }
  }

  async getAllMembers(
    organizationId: string,
    limit: number,
    offset: number,
  ): Promise<{ members: ProfilesOrganizations[]; total: number }> {
    const [members, total] = await this.profOrgRepository
      .createQueryBuilder('po')
      .leftJoinAndSelect('po.profile', 'profile')
      .where('po.organization_id = :organizationId', { organizationId })
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return { members, total };
  }
}
