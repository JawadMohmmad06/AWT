import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendeeEntity } from 'src/Attendee/attendee.entity';
// import { EventEntity } from 'src/Event/event.entity';
import { FeedbackEntity } from 'src/Feedback/feedback.entity';
import { BookedEventController } from './bookedEvent.controller';
import { BookedEventEntity } from './bookedEvent.entity';
import { BookedEventService } from './bookedEvent.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BookedEventEntity,
      // EventEntity,
      AttendeeEntity,
      FeedbackEntity,
    ]),
  ],
  controllers: [BookedEventController],
  providers: [BookedEventService],
})
export class BookedEventModule {}
