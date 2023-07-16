import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendeeModule } from './Attendee/attendee.module';
import { BookedEventModule } from './BookedEvent/bookedEvent.module';
// import { EventModule } from './Event/event.module';
import { FeedbackModule } from './Feedback/feedback.module';
import { SurveysModule } from './Surveys/surveys.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    AttendeeModule,
    // EventModule,
    FeedbackModule,
    SurveysModule,
    BookedEventModule,
    AdminModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
