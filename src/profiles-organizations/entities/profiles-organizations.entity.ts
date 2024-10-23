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

@Check(`"role" IN ('member', 'admin')`)
@Entity({ name: 'profiles_organizations' })
export class ProfilesOrganizations {
  @PrimaryColumn('uuid')
  profile_id: string;

  @PrimaryColumn('uuid')
  organization_id: string;

  @Column({ type: 'varchar', length: 50, default: 'member' })
  role: string;

  @ManyToOne('Profile', 'profilesOrganizations', {
    lazy: true,
  })
  @JoinColumn({ name: 'profile_id' })
  profile: Promise<Profile>;

  @ManyToOne('Organization', 'profilesOrganizations', {
    lazy: true,
  })
  @JoinColumn({ name: 'organization_id' })
  organization: Promise<Organization>;
}
