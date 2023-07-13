import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('Attendee')
export class AttendeeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  @Unique(['email'])
  email: string;

  @Column()
  @Unique(['username'])
  username: string;

  @Column()
  password: string;

  @Column()
  dob: Date;

  @Column()
  phone: string;

  @Column()
  address: string;
}

// @Entity('OTP')
// export class OTP_Entity {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   otp: string;

//   @Column()
//   email: string;

//   @Column()
//   status: number;
// }
