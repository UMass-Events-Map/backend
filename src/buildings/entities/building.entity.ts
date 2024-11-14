import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Event } from '../../events/entities/event.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'buildings' })
export class Building {
  @ApiProperty({
    description: 'The unique identifier of the building',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The name of the building',
    example: 'Engineering Building',
    maxLength: 255,
  })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({
    description: 'URL to the building thumbnail image',
    example: 'https://example.com/images/eng-building.jpg',
    maxLength: 255,
    nullable: true,
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  thumbnail: string;

  @ApiProperty({
    description: 'Physical address of the building',
    example: '123 University Drive, Campus Area',
    maxLength: 255,
    nullable: true,
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @ApiProperty({
    description: 'Latitude coordinate of the building location',
    example: 42.3601,
    type: 'number',
  })
  @Column({
    type: 'decimal',
    precision: 9,
    scale: 6,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  latitude: number;

  @ApiProperty({
    description: 'Longitude coordinate of the building location',
    example: -71.0589,
    type: 'number',
  })
  @Column({
    type: 'decimal',
    precision: 9,
    scale: 6,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  longitude: number;

  @ApiProperty({
    description: 'The timestamp when the building was created',
    example: '2024-03-20T12:00:00Z',
  })
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ApiProperty({
    description: 'The timestamp when the building was last updated',
    example: '2024-03-20T12:00:00Z',
  })
  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ApiProperty({
    description: 'The events associated with this building',
    type: () => [Event],
  })
  @OneToMany(() => Event, (event) => event.building)
  events: Event[];
}
