import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Profile } from '../../profiles/entities/profile.entity';
import { Event } from '../../events/entities/event.entity';
import { ProfilesOrganizations } from '../../profiles-organizations/entities/profiles-organizations.entity';

@Entity({ name: 'organizations' })
export class Organization {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  organization_name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ManyToMany(() => Profile, (profile) => profile.organizations)
  profiles: Profile[];

  @OneToMany(() => Event, (event) => event.organization)
  events: Event[];

  @OneToMany(
    () => ProfilesOrganizations,
    (profilesOrganizations) => profilesOrganizations.organization,
  )
  profilesOrganizations: ProfilesOrganizations[];
}
