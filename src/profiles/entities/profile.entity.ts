import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity';
import { EventLog } from '../../event-logs/entities/event-log.entity';
import { ProfilesOrganizations } from '../../profiles-organizations/entities/profiles-organizations.entity';

@Entity({ name: 'profiles' })
export class Profile {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  first_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  last_name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ManyToMany(() => Organization, (organization) => organization.profiles)
  @JoinTable({
    name: 'profiles_organizations',
    joinColumn: {
      name: 'profile_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'organization_id',
      referencedColumnName: 'id',
    },
  })
  organizations: Organization[];

  @OneToMany(() => EventLog, (eventLog) => eventLog.profile)
  eventLogs: EventLog[];

  @OneToMany(() => ProfilesOrganizations, (profileOrg) => profileOrg.profile)
  profilesOrganizations: ProfilesOrganizations[];
}
