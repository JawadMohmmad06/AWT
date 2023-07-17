import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendeeEntity } from 'src/Attendee/attendee.entity';

import { FeedbackEntity } from 'src/Feedback/feedback.entity';
import { BookedEventController } from './bookedEvent.controller';
import { BookedEventEntity } from './bookedEvent.entity';
import { BookedEventService } from './bookedEvent.service';
import { CreateEventsEntity } from 'src/event/eventcreate.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BookedEventEntity,
      CreateEventsEntity,
      AttendeeEntity,
      FeedbackEntity,
    ]),
  ],
  controllers: [BookedEventController],
  providers: [BookedEventService],
})
export class BookedEventModule {}
