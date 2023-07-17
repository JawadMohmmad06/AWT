

import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { EventOrganizerEntity } from './eventorganizer.entity';
import { BookedEventEntity } from 'src/BookedEvent/bookedEvent.entity';
@Entity('createevents')
export class CreateEventsEntity{
@PrimaryGeneratedColumn()
    Id:number;
    @Column()
    Name:string;
    @Column()
    Location:string;
    @Column()
    Time:Date;
    @Column()
    TicketPrice:number;
    @Column()
    Availability:string;
    @Column()
    Address:string;
    @Column()
    Type:string;
    @Column()
    Description:string;

    @ManyToOne(() => EventOrganizerEntity, createevents =>createevents.creates)
    createevents: EventOrganizerEntity;
    @OneToMany(()=>BookedEventEntity,bookedeventt=>bookedeventt.Event,{cascade:true})
    BookEvents:BookedEventEntity


}

