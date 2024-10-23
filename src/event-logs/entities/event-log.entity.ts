import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Profile } from '../../profiles/entities/profile.entity';
import { Event } from '../../events/entities/event.entity';

@Entity({ name: 'event_logs' })
export class EventLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  profile_id: string;

  @Column({ type: 'uuid', nullable: true })
  event_id: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  action: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @ManyToOne(() => Profile, (profile) => profile.eventLogs, {
    nullable: true,
    lazy: true,
  })
  profile: Promise<Profile>;

  @ManyToOne(() => Event, (event) => event.event_logs, {
    nullable: true,
    lazy: true,
  })
  event: Promise<Event>;
}
