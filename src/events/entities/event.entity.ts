import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Building } from '../../buildings/entities/building.entity';
import { Organization } from '../../organizations/entities/organization.entity';
import { EventLog } from '../../event-logs/entities/event-log.entity';

@Entity({ name: 'events' })
export class Event {
  @ApiProperty({
    description: 'The unique identifier of the event',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The name of the event',
    example: 'Tech Conference 2024',
    maxLength: 255,
  })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({
    description: 'Detailed description of the event',
    example: 'Join us for a day of technical talks and networking...',
    nullable: true,
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    description: 'The date of the event',
    example: '2024-12-31',
  })
  @Column({ type: 'date' })
  date: string;

  @ApiProperty({
    description: 'The start time of the event',
    example: '14:30',
  })
  @Column({ type: 'time' })
  time: string;

  @ApiProperty({
    description: 'The ID of the building where the event takes place',
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  @Column({ type: 'uuid', nullable: true })
  building_id: string;

  @ApiProperty({
    description: 'The room number where the event takes place',
    example: 'Room 101',
    maxLength: 50,
    nullable: true,
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  room_number: string;

  @ApiProperty({
    description: 'The ID of the organization hosting the event',
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  @Column({ type: 'uuid', nullable: true })
  organization_id: string;

  @ApiProperty({
    description: 'URL of the event thumbnail image',
    example: 'https://example.com/images/event-thumbnail.jpg',
    maxLength: 255,
    nullable: true,
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  thumbnail: string;

  @ApiProperty({
    description: 'Number of attendees for the event',
    example: 100,
    default: 0,
  })
  @Column({ type: 'integer', default: 0 })
  attendance: number;

  @ApiProperty({
    description: 'The timestamp when the event was created',
    example: '2024-03-20T12:00:00Z',
  })
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ApiProperty({
    description: 'The timestamp when the event was last updated',
    example: '2024-03-20T12:00:00Z',
  })
  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ApiProperty({
    description: 'The building associated with this event',
    type: () => Building,
    nullable: true,
  })
  @ManyToOne(() => Building, (building) => building.events, { nullable: true })
  building: Building;

  @ApiProperty({
    description: 'The organization hosting this event',
    type: () => Organization,
    nullable: true,
  })
  @ManyToOne(() => Organization, (organization) => organization.events, {
    nullable: true,
  })
  organization: Organization;

  @ApiProperty({
    description: 'The event logs associated with this event',
    type: () => [EventLog],
  })
  @OneToMany(() => EventLog, (eventLog) => eventLog.event)
  event_logs: EventLog[];
}
