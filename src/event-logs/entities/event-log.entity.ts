import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Profile } from '../../profiles/entities/profile.entity';
import { Event } from '../../events/entities/event.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'event_logs' })
export class EventLog {
  @ApiProperty({
    description: 'The unique identifier of the event log',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The ID of the profile associated with this log entry',
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  @Column({ type: 'uuid', nullable: true })
  profile_id: string;

  @ApiProperty({
    description: 'The ID of the event associated with this log entry',
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  @Column({ type: 'uuid', nullable: true })
  event_id: string;

  @ApiProperty({
    description: 'The action that was performed',
    example: 'event.created',
    maxLength: 50,
  })
  @Column({
    type: 'varchar',
    length: 50,
  })
  action: string;

  @ApiProperty({
    description: 'The timestamp when the action was performed',
    example: '2024-03-20T12:00:00Z',
  })
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @ApiProperty({
    description: 'The profile that performed the action',
    type: () => Profile,
    nullable: true,
  })
  @ManyToOne(() => Profile, (profile) => profile.eventLogs, {
    nullable: true,
    lazy: true,
  })
  profile: Promise<Profile>;

  @ApiProperty({
    description: 'The event that was acted upon',
    type: () => Event,
    nullable: true,
  })
  @ManyToOne(() => Event, (event) => event.event_logs, {
    nullable: true,
    lazy: true,
  })
  event: Promise<Event>;
}
