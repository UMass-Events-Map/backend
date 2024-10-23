import { Controller } from '@nestjs/common';
import { EventLogsService } from './event-logs.service';

@Controller('event-logs')
export class EventLogsController {
  constructor(private readonly eventLogsService: EventLogsService) {}
}
