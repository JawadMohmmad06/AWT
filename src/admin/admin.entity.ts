import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('Admin')
export class AdminEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  @Unique(['email'])
  email: string;

  @Column()
  password: string;

  @Column()
  dob: Date;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column()
  imageUrl: string;
}

@Entity('OTP')
export class OTP_Entity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  otp: string;

  @Column()
  email: string;

  @Column()
  status: number;
}
