import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookedEventEntity } from 'src/BookedEvent/bookedEvent.entity';
import { FeedbackController } from './feedback.controller';
import { FeedbackEntity } from './feedback.entity';
import { FeedbackService } from './feedback.service';

@Module({
  imports: [TypeOrmModule.forFeature([BookedEventEntity, FeedbackEntity])],
  controllers: [FeedbackController],
  providers: [FeedbackService],
})
export class FeedbackModule {}
