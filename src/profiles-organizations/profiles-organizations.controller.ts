import { Controller } from '@nestjs/common';
import { ProfilesOrganizationsService } from './profiles-organizations.service';

@Controller('profiles-organizations')
export class ProfilesOrganizationsController {
  constructor(private readonly profOrgService: ProfilesOrganizationsService) {}
}
