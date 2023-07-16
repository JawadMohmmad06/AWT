import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventSecretEntity } from 'src/eventsecret/eventsecret.entity';
// import { EventController } from './event.controller';
// import { EventService } from './event.service';
import { CreateEventsEntity } from './eventcreate.entity';
import { EventOrganizerEntity } from './eventorganizer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EventOrganizerEntity,
      EventSecretEntity,
      CreateEventsEntity,
    ]),

    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        ignoreTLS: true,
        secure: true,
        auth: {
          user: 'tahmid.showrav.42139@gmail.com',
          pass: 'abgviqsfnkpglkcv',
        },
      },
    }),
  ],
  // EventController
  controllers: [],
  // EventService
  providers: [],
})
export class EventModule {}
