import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookedEventEntity } from 'src/BookedEvent/bookedEvent.entity';
// import { EventEntity } from 'src/Event/event.entity';
import { FeedbackEntity } from 'src/Feedback/feedback.entity';
import { SurveyEnity } from 'src/Surveys/surveys.entity';
// import { AttendeeController } from './attendee.controller';
import { AttendeeEntity, AttendeeOtpEntity } from './attendee.entity';
// import { AttendeeService } from './attendee.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FeedbackEntity,
      AttendeeEntity,
      BookedEventEntity,
      SurveyEnity,
      // EventEntity,
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
  controllers: [],
  // AttendeeService
  providers: [],
})
export class AttendeeModule {}
