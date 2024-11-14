import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  Check,
} from 'typeorm';
import type { Profile } from '../../profiles/entities/profile.entity';
import type { Organization } from '../../organizations/entities/organization.entity';
import { ApiProperty } from '@nestjs/swagger';

@Check(`"role" IN ('member', 'admin')`)
@Entity({ name: 'profiles_organizations' })
export class ProfilesOrganizations {
  @ApiProperty({
    description: 'The ID of the profile in the relationship',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryColumn('uuid')
  profile_id: string;

  @ApiProperty({
    description: 'The ID of the organization in the relationship',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryColumn('uuid')
  organization_id: string;

  @ApiProperty({
    description: 'The role of the profile in the organization',
    example: 'member',
    enum: ['member', 'admin'],
    default: 'member',
  })
  @Column({ type: 'varchar', length: 50, default: 'member' })
  role: string;

  @ApiProperty({
    description: 'The associated profile',
    type: () => 'Profile',
  })
  @ManyToOne('Profile', 'profilesOrganizations', {
    lazy: true,
  })
  @JoinColumn({ name: 'profile_id' })
  profile: Promise<Profile>;

  @ApiProperty({
    description: 'The associated organization',
    type: () => 'Organization',
  })
  @ManyToOne('Organization', 'profilesOrganizations', {
    lazy: true,
  })
  @JoinColumn({ name: 'organization_id' })
  organization: Promise<Organization>;
}
