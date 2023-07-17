import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendeeModule } from './Attendee/attendee.module';
import { BookedEventModule } from './BookedEvent/bookedEvent.module';

import { FeedbackModule } from './Feedback/feedback.module';
import { SurveysModule } from './Surveys/surveys.module';
import { AdminModule } from './admin/admin.module';
import { EventModule } from './event/event.module';


@Module({
  imports: [
    AttendeeModule,
    EventModule,
    FeedbackModule,
    SurveysModule,
    BookedEventModule,
    AdminModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port:  5432,
      username: 'postgres',
      password: '12345678',
      database: 'awtmid',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
