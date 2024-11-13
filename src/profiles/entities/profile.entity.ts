import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
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

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => EventLog, (eventLog) => eventLog.profile)
  eventLogs: EventLog[];

  @OneToMany(() => ProfilesOrganizations, (profileOrg) => profileOrg.profile)
  profilesOrganizations: ProfilesOrganizations[];
}
