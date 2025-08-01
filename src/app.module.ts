import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReservationController } from './controllers/reservation.controller';
import { ReservationService } from './services/reservation.service';
import { ReservationNewController } from './controllers/reservation-new.controller';
import { ReservationNewService } from './services/reservation-new.service';
import { CallStatusNewController } from './controllers/call-status-new.controller';
import { CallStatusNewService } from './services/call-status-new.service';
import { SystemStatusNewController } from './controllers/system-status-new.controller';
import { SystemStatusNewService } from './services/system-status-new.service';
import { PublicController } from './controllers/public.controller';
import { AdminController } from './controllers/admin.controller';
import { EmailService } from './services/email.service';
import { getDatabaseConfig } from './config/database.config';
import * as entities from './entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature(Object.values(entities)),
  ],
  controllers: [
    AppController, 
    ReservationController, 
    ReservationNewController, 
    CallStatusNewController, 
    SystemStatusNewController,
    PublicController,
    AdminController
  ],
  providers: [
    AppService, 
    ReservationService, 
    ReservationNewService, 
    CallStatusNewService, 
    SystemStatusNewService, 
    EmailService
  ],
})
export class AppModule {}
