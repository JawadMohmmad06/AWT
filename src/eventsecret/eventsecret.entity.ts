import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EventOrganizerEntity } from '../event/eventorganizer.entity';

@Entity('eventsecret')
export class EventSecretEntity {
  @PrimaryGeneratedColumn()
  Id: number;
  @Column({ name: 'Username', type: 'varchar', length: 150 })
  Username: string;
  @Column({ name: 'Password', type: 'varchar', length: 150 })
  Password: string;

  @OneToOne(
    () => EventOrganizerEntity,
    (eventorganizer) => eventorganizer.eventsecret,
  )
  eventorganizer: EventOrganizerEntity;
}
