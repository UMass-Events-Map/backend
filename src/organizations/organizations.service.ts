import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { ProfilesService } from '../profiles/profiles.service';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationResponseDto } from './dto/organization-response.dto';
import { v4 as uuidv4 } from 'uuid';
import { OrganizationDetailsResponseDto } from './dto/organization-member.dto';
import { ProfilesOrganizationsService } from '../profiles-organizations/profiles-organizations.service';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    private readonly profilesService: ProfilesService,
    private readonly profilesOrganizationsService: ProfilesOrganizationsService,
  ) {}

  async getProfileIdFromToken(auth: string): Promise<string> {
    return this.profilesService.getProfileIdFromToken(auth);
  }

  async create(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<Organization> {
    const organization = this.organizationRepository.create({
      ...createOrganizationDto,
      id: uuidv4(),
      verified: false,
    });
    return this.organizationRepository.save(organization);
  }

  findAll(): Promise<Organization[]> {
    return this.organizationRepository.find({
      relations: ['user', 'profiles'],
    });
  }

  findOne(id: string): Promise<Organization> {
    return this.organizationRepository.findOne({
      where: { id },
      relations: ['user', 'profiles'],
    });
  }

  async update(
    id: string,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<Organization> {
    await this.organizationRepository.update(id, updateOrganizationDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.organizationRepository.delete(id);
  }

  async verify(id: string): Promise<Organization> {
    await this.organizationRepository.update(id, { verified: true });
    return this.findOne(id);
  }

  async unverify(id: string): Promise<Organization> {
    await this.organizationRepository.update(id, { verified: false });
    return this.findOne(id);
  }

  async findOrganizationsByProfileId(
    profileId: string,
  ): Promise<OrganizationResponseDto[]> {
    const organizations = await this.organizationRepository
      .createQueryBuilder('organization')
      .innerJoin(
        'profiles_organizations',
        'po',
        'po.organization_id = organization.id',
      )
      .where('po.profile_id = :profileId', { profileId })
      .getMany();

    return organizations.map((org) => ({
      id: org.id,
      name: org.organization_name,
      email: org.email,
      description: org.description,
      image_url: org.image_url,
      address: org.address,
      verified: org.verified,
    }));
  }

  async getOrganizationDetails(
    id: string,
    limit: number,
    offset: number,
  ): Promise<OrganizationDetailsResponseDto> {
    const organization = await this.organizationRepository.findOne({
      where: { id },
    });

    if (!organization) {
      return null;
    }

    const { members: allMembers, total } =
      await this.profilesOrganizationsService.getAllMembers(id, limit, offset);

    const organizationDto: OrganizationResponseDto = {
      id: organization.id,
      name: organization.organization_name,
      email: organization.email,
      description: organization.description,
      image_url: organization.image_url,
      address: organization.address,
      verified: organization.verified,
    };

    const members = await Promise.all(
      allMembers.map(async (po) => {
        const profile = await po.profile;
        return {
          role: po.role,
          profile: {
            id: po.profile_id,
            email: profile.email,
            first_name: profile.first_name,
            last_name: profile.last_name,
          },
        };
      }),
    );

    return {
      organization: organizationDto,
      members: {
        data: members,
        total,
      },
    };
  }
}
