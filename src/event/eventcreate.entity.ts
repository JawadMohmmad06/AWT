import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EventOrganizerEntity } from './eventorganizer.entity';
@Entity('createevents')
export class CreateEventsEntity {
  @PrimaryGeneratedColumn()
  Id: number;
  @Column()
  Name: string;
  @Column()
  Location: string;
  @Column()
  Time: string;
  @Column()
  TicketPrice: string;
  @Column()
  Availability: string;
  @Column()
  Address: string;
  @Column()
  Type: string;
  @Column()
  Description: string;

  @ManyToOne(() => EventOrganizerEntity, (createevents) => createevents.creates)
  createevents: EventOrganizerEntity;
}
