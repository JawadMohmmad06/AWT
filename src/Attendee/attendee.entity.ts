import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';
import { BookedEventEntity } from 'src/BookedEvent/bookedEvent.entity';
import { SurveyEnity } from 'src/Surveys/surveys.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity('Attendee')
export class AttendeeEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @IsString()
  @IsNotEmpty()
  @Column()
  Name: string;

  @IsString()
  @IsNotEmpty()
  @Column()
  Username: string;

  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])/, {
    message:
      'The password must contain at least one uppercase letter and one lowercase letter',
  })
  @Column()
  Password: string;

  @IsEmail()
  @IsNotEmpty()
  @Column()
  Email: string;

  @IsDateString()
  @IsNotEmpty()
  @Column()
  Dob: Date;

  @Column()
  PhotoName: string;

  @Column()
  @Matches(/^(01\d{9})$/, {
    message:
      'The phone number must start with "01" and contain 11 digits without any other characters.',
  })
  @IsNotEmpty()
  @Column()
  Phonenumber: string;

  @OneToMany(
    () => BookedEventEntity,
    (bookedEventEntity) => bookedEventEntity.Attendee,
    { cascade: true },
  )
  BookedEvents: BookedEventEntity[];

  @ManyToMany(() => SurveyEnity, (survey) => survey.Attendees)
  @JoinTable()
  surveys: SurveyEnity[];
}

@Entity('Otp')
export class AttendeeOtpEntity {
  @PrimaryGeneratedColumn()
  Id: number;
  @Column()
  Username: string;
  @Column()
  Otp: string;
}

export class changepassOtpDTO {
  Username: string;
  Password: string;
  Otp: string;
}
