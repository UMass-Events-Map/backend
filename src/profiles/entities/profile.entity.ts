import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { EventLog } from '../../event-logs/entities/event-log.entity';
import { ProfilesOrganizations } from '../../profiles-organizations/entities/profiles-organizations.entity';

@Entity({ name: 'profiles' })
export class Profile {
  @ApiProperty({
    description: 'The unique identifier of the profile',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The first name of the profile owner',
    example: 'John',
    maxLength: 255,
    nullable: true,
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  first_name: string;

  @ApiProperty({
    description: 'The last name of the profile owner',
    example: 'Doe',
    maxLength: 255,
    nullable: true,
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  last_name: string;

  @ApiProperty({
    description: 'The email address of the profile owner',
    example: 'john.doe@example.com',
  })
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @ApiProperty({
    description: 'The timestamp when the profile was created',
    example: '2024-03-20T12:00:00Z',
  })
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ApiProperty({
    description: 'The timestamp when the profile was last updated',
    example: '2024-03-20T12:00:00Z',
  })
  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ApiProperty({
    description: 'The event logs associated with this profile',
    type: () => [EventLog],
  })
  @OneToMany(() => EventLog, (eventLog) => eventLog.profile)
  eventLogs: EventLog[];

  @ApiProperty({
    description: 'The profile-organization relationships',
    type: () => [ProfilesOrganizations],
  })
  @OneToMany(() => ProfilesOrganizations, (profileOrg) => profileOrg.profile)
  profilesOrganizations: ProfilesOrganizations[];
}
