import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { BookedEventEntity } from 'src/BookedEvent/bookedEvent.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Feedback')
export class FeedbackEntity {
  @PrimaryGeneratedColumn()
  Id: number;
  @IsString()
  @IsNotEmpty()
  @Column()
  Username: string;
  @IsEmail()
  @IsNotEmpty()
  @Column()
  Email: string;
  @IsString()
  @IsNotEmpty()
  @Column()
  Feedback: string;
  @IsString()
  @IsNotEmpty()
  @Column()
  EventName: string;
  @OneToOne(() => BookedEventEntity, (bookEvent) => bookEvent.Feedback, {
    cascade: true,
  })
  @JoinColumn()
  BookedEvent: BookedEventEntity;
}
