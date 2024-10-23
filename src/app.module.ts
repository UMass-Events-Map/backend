import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { LoggerModule } from 'nestjs-pino';
import { EventsModule } from './events/events.module';
import { ProfilesModule } from './profiles/profiles.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { EventLogsModule } from './event-logs/event-logs.module';
import { BuildingsModule } from './buildings/buildings.module';
import { UsersModule } from './users/users.module';
import { ProfilesOrganizationsModule } from './profiles-organizations/profiles-organizations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    LoggerModule.forRoot({
      pinoHttp: {
        customProps: (req, res) => ({
          context: 'HTTP',
        }),
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
    UsersModule,
    EventsModule,
    ProfilesModule,
    OrganizationsModule,
    ProfilesOrganizationsModule,
    EventLogsModule,
    BuildingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
