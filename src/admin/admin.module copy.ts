import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminEntity, OTP_Entity } from './admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        ignoreTLS: true,
        secure: true,
        auth: {
          user: 'anamul.ah00@gmail.com',
          pass: 'xwbjcwavsrypaizz',
        },
      },
    }),
    TypeOrmModule.forFeature([AdminEntity, OTP_Entity]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
