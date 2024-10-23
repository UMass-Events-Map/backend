import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { ProfilesOrganizationsModule } from '../profiles-organizations/profiles-organizations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile]),
    forwardRef(() => ProfilesOrganizationsModule),
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports: [ProfilesService],
})
export class ProfilesModule {}
