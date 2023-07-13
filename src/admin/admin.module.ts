import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminEntity, OTP_Entity } from './admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { AttendeeEntity } from 'src/attende/attendee.entity';
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
    TypeOrmModule.forFeature([AdminEntity, OTP_Entity, AttendeeEntity]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
