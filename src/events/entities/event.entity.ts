import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Building } from '../../buildings/entities/building.entity';
import { Organization } from '../../organizations/entities/organization.entity';
import { EventLog } from '../../event-logs/entities/event-log.entity';

@Entity({ name: 'events' })
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  time: string;

  @Column({ type: 'uuid', nullable: true })
  building_id: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  room_number: string;

  @Column({ type: 'uuid', nullable: true })
  organization_id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  thumbnail: string;

  @Column({ type: 'integer', default: 0 })
  attendance: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ManyToOne(() => Building, (building) => building.events, { nullable: true })
  building: Building;

  @ManyToOne(() => Organization, (organization) => organization.events, {
    nullable: true,
  })
  organization: Organization;

  @OneToMany(() => EventLog, (eventLog) => eventLog.event)
  event_logs: EventLog[];
}
