import { Inject, Injectable, Session } from "@nestjs/common";
import { EventDTO, EventUpdateDTO, EventLoginDTO, EventLoginfromDTO, EventsDTO } from "./event.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { EventOrganizerEntity } from "./eventorganizer.entity";
import { Repository } from "typeorm";
import { EventSecretEntity } from "src/eventsecret/eventsecret.entity";
import * as bcrypt from 'bcrypt';
import { CreateEventsEntity } from "./eventcreate.entity";
import { MailerService } from "@nestjs-modules/mailer/dist";



@Injectable()
export class EventService {


    constructor(
        @InjectRepository(EventOrganizerEntity)
        private eventorganizerRepository: Repository<EventOrganizerEntity>,
        @InjectRepository(EventSecretEntity)
        private eventsecretRepository: Repository<EventSecretEntity>,
        @InjectRepository(CreateEventsEntity)
        private createeventsRepository: Repository<CreateEventsEntity>,
        @Inject(MailerService) private readonly mailerService: MailerService,

    ) { }

// MAILER
 async mailerread():Promise<void>{
    await this.mailerService.sendMail({to: 'tahmidul.haque.42139@gmail.com',
subject: 'How’d we do? Help us help you?',
text: 'Hello, Wishiing you to reach as soon as possible!',
});

 }


    async updateevent(username: string, data: EventUpdateDTO): Promise<EventSecretEntity> {
        await this.eventsecretRepository.update({ Username: username }, data);
        return this.eventsecretRepository.findOneBy({ Id: data.Id });
    }

    async updateEventById(Id: number, data: EventLoginDTO): Promise<EventSecretEntity> {
        await this.eventsecretRepository.update(Id, data);
        return this.eventsecretRepository.findOneBy({ Id});
    }
    //update to events;
    async updatecreateEventById(Id: number, data: EventsDTO): Promise<EventOrganizerEntity> {
        await this.eventorganizerRepository.update(Id, data);
        return this.eventorganizerRepository.findOneBy({ Id});
    }



    // add event organizer
    async create(eventorganizer): Promise<EventOrganizerEntity> {
        // console.log(eventorganizer)

        const secretRepositoryData = {

            Username: eventorganizer.Username,

            Password: eventorganizer.Password,

        };

        const secretResults = await this.eventsecretRepository.save(

            secretRepositoryData,

        );




        if (secretResults.Id) {

            const parentTable = {

                Name: eventorganizer.Name,

                Email: eventorganizer.Email,

                DOB: eventorganizer.DOB,

                Address: eventorganizer.Address,

                Phonenumber: eventorganizer.Phonenumber,

                Photo: eventorganizer.Photo,

                eventsecretid: secretResults.Id,

            };




            const result = await this.eventorganizerRepository.save(parentTable);

            return { ...result, ...eventorganizer };

        }


        // return this.eventorganizerRepository.save(eventorganizer);
    }

    // add event secret
    async addeventsecret(eventsecret): Promise<EventSecretEntity> {
        return this.eventsecretRepository.save(eventsecret);
    }
    // create events
    async createevents(createevents): Promise<CreateEventsEntity> {
        return this.createeventsRepository.save(createevents);
    }





    // search for the event organizer by id
    async getEventById(Id: number): Promise<EventOrganizerEntity> {

        return this.eventorganizerRepository.findOneBy({ Id });

    }
    //search by event by id 
    async getEventSearchById(Id: number): Promise<CreateEventsEntity> {

        return this.createeventsRepository.findOneBy({ Id });

    }
    //search event by id and name
    async getEventbyIDAndName(Id, name): Promise<EventOrganizerEntity> {
        return this.eventorganizerRepository.findOneBy({ Id: Id, Name: name });
    }

    // show the all database events organization
    async getAllEventsOrganization(): Promise<EventOrganizerEntity[]> {
        return this.eventorganizerRepository.find();
    }
    // show the all database events
    async getAllEvents(): Promise<CreateEventsEntity[]> {
        return this.createeventsRepository.find();
    }
    //delete the events;
    async deleteorganization(id: number): Promise<EventOrganizerEntity[]> {
        await this.eventorganizerRepository.delete(id);
        return this.eventorganizerRepository.find();
    }
    async deleteEvents(id: number): Promise<EventOrganizerEntity[]> {
        await this.eventorganizerRepository.delete(id);
        return this.eventorganizerRepository.find();
    }

    

    // sign up and in
    async signup(data: EventDTO): Promise<EventOrganizerEntity> {
        const salt = await bcrypt.genSalt();
        data.Password = await bcrypt.hash(data.Password, salt);
        return this.eventorganizerRepository.save(data);
    }
    async signIn(data: EventLoginDTO) {
        const userdata = await this.eventsecretRepository.findOneBy({ Username: data.Username });
        const match: boolean = await bcrypt.compare(data.Password, userdata.Password);
        return match;

    }



}