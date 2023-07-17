
import { EventSecretEntity } from "src/eventsecret/eventsecret.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CreateEventsEntity } from "./eventcreate.entity";



@Entity('eventorganizer')
export class EventOrganizerEntity{
@PrimaryGeneratedColumn()
    Id:number;
    @Column()
    Name:string;
    @Column()
    Email:string;
    @Column()
    DOB:string;
    @Column()
    Address:string;
    @Column()
    Phonenumber:string;
    @Column()
    Photo:string;
    // @Column()
    // password:string;

   
    
   
    @OneToOne(() => EventSecretEntity, eventsecret => eventsecret.eventorganizer, { cascade: true
    })
    @JoinColumn()
    eventsecret: EventSecretEntity;
   


    @OneToMany(() => CreateEventsEntity, create => create.createevents, { cascade: true })
creates: CreateEventsEntity[];



}
   

 
