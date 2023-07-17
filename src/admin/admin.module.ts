import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendeeEntity } from 'src/Attendee/attendee.entity';
import { CreateEventsEntity } from 'src/event/eventcreate.entity';
import { EventOrganizerEntity } from 'src/event/eventorganizer.entity';
import { EventSecretEntity } from 'src/eventsecret/eventsecret.entity';
import { AdminController } from './admin.controller';
import { AdminEntity, OTP_Entity } from './admin.entity';
import { AdminService } from './admin.service';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        // ignoreTLS: true,
        secure: true,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.MAIL_PASS,
        },
        tls: { rejectUnauthorized: false },
      },
    }),
    TypeOrmModule.forFeature([
      AdminEntity,
      OTP_Entity,
      AttendeeEntity,
      EventOrganizerEntity,
      EventSecretEntity,
      CreateEventsEntity,
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
