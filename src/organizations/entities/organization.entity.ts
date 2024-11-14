import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Profile } from '../../profiles/entities/profile.entity';
import { Event } from '../../events/entities/event.entity';
import { ProfilesOrganizations } from '../../profiles-organizations/entities/profiles-organizations.entity';

@Entity({ name: 'organizations' })
export class Organization {
  @ApiProperty({
    description: 'The unique identifier of the organization',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The name of the organization',
    example: 'Acme Corporation',
  })
  @Column({ name: 'organization_name', type: 'varchar', length: 255 })
  organization_name: string;

  @ApiProperty({
    description: 'The email address of the organization',
    example: 'contact@acmecorp.com',
  })
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @ApiProperty({
    description: 'A detailed description of the organization',
    example: 'A leading provider of innovative solutions...',
    nullable: true,
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    description: "URL to the organization's image or logo",
    example: 'https://example.com/images/acme-logo.png',
    nullable: true,
  })
  @Column({ name: 'image_url', type: 'varchar', length: 255, nullable: true })
  image_url: string;

  @ApiProperty({
    description: 'Physical address of the organization',
    example: '123 Main St, City, State 12345',
    nullable: true,
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @ApiProperty({
    description: 'Whether the organization is verified',
    example: false,
  })
  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @ApiProperty({
    description: 'The timestamp when the organization was created',
  })
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ApiProperty({
    description: 'The timestamp when the organization was last updated',
  })
  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ApiProperty({
    description: 'The profiles associated with this organization',
    type: () => [Profile],
  })
  @ManyToMany(() => Profile, (profile) => profile.profilesOrganizations)
  profiles: Profile[];

  @ApiProperty({
    description: 'The events associated with this organization',
    type: () => [Event],
  })
  @OneToMany(() => Event, (event) => event.organization)
  events: Event[];

  @ApiProperty({
    description: 'The profile-organization relationships',
    type: () => [ProfilesOrganizations],
  })
  @OneToMany(
    () => ProfilesOrganizations,
    (profileOrg) => profileOrg.organization,
  )
  profilesOrganizations: ProfilesOrganizations[];
}
