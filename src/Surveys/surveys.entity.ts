import { IsNotEmpty, IsString } from 'class-validator';
import { AttendeeEntity } from 'src/Attendee/attendee.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Survey')
export class SurveyEnity {
  @PrimaryGeneratedColumn()
  Id: number;
  @IsString()
  @IsNotEmpty()
  @Column()
  Username: string;

  @IsString()
  @IsNotEmpty()
  @Column()
  Question: string;

  @IsString()
  @IsNotEmpty()
  @Column()
  Answer: string;
  @ManyToMany(() => AttendeeEntity, (attendee) => attendee.surveys)
  Attendees: AttendeeEntity[];
}
