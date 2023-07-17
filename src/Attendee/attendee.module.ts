import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookedEventEntity } from 'src/BookedEvent/bookedEvent.entity';

import { FeedbackEntity } from 'src/Feedback/feedback.entity';
import { SurveyEnity } from 'src/Surveys/surveys.entity';

import { AttendeeEntity, AttendeeOtpEntity } from './attendee.entity';
import { AttendeeController } from './attendee.controller';

import { CreateEventsEntity } from 'src/event/eventcreate.entity';
import { AttendeeService } from './attendee.service';

// import { AttendeeService } from './attendee.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FeedbackEntity,
      AttendeeEntity,
      BookedEventEntity,
      SurveyEnity,
       CreateEventsEntity,
      AttendeeOtpEntity,
    ]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        ignoreTLS: true,
        secure: true,
        auth: {
          user: 'jawadnagad@gmail.com',
          pass: 'emkhbmdzopnjsitw',
        },
      },
    }),
  ],
  // AttendeeController
  controllers: [AttendeeController],
  // AttendeeService
  providers: [AttendeeService],
})
export class AttendeeModule {}
