import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesOrganizations } from './entities/profiles-organizations.entity';
import { ProfilesOrganizationsService } from './profiles-organizations.service';
import { ProfilesOrganizationsController } from './profiles-organizations.controller';
import { ProfilesModule } from '../profiles/profiles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProfilesOrganizations]),
    forwardRef(() => ProfilesModule),
  ],
  providers: [ProfilesOrganizationsService],
  controllers: [ProfilesOrganizationsController],
  exports: [ProfilesOrganizationsService],
})
export class ProfilesOrganizationsModule {}
