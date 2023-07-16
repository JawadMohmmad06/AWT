import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { AttendeeEntity } from 'src/Attendee/attendee.entity';
// import { EventEntity } from 'src/Event/event.entity';
import { FeedbackEntity } from 'src/Feedback/feedback.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('BookedEvent')
export class BookedEventEntity {
  @PrimaryGeneratedColumn()
  Id: number;
  @IsString()
  @IsNotEmpty()
  @Column()
  Name: string;
  @IsString()
  @IsNotEmpty()
  @Column()
  Location: string;
  @IsDateString()
  @IsNotEmpty()
  @Column()
  EventTime: Date;
  @IsNumber()
  @IsNotEmpty()
  @Column()
  TicketPrice: number;
  @IsString()
  @IsNotEmpty()
  @Column()
  Address: string;
  @IsString()
  @IsNotEmpty()
  @Column()
  Description: string;
  @IsNumber()
  @IsNotEmpty()
  @Column()
  Discount: number;
  @IsString()
  @IsNotEmpty()
  @Column()
  TicketNumber: string;
  @IsDateString()
  @IsNotEmpty()
  @Column()
  BookingTime: Date;
  @ManyToOne(() => AttendeeEntity, (attendee) => attendee.BookedEvents)
  Attendee: AttendeeEntity;
  @OneToOne(() => FeedbackEntity, (feedback) => feedback.BookedEvent)
  Feedback: FeedbackEntity;
  // @ManyToOne(() => EventEntity, (evenEntity) => evenEntity.BookedEvents)
  // Event: EventEntity;
}
