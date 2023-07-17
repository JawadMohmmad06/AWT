import { Module } from "@nestjs/common";
import { EventController } from "./event.controller";
import { EventService } from "./event.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import {  EventOrganizerEntity } from "./eventorganizer.entity";
import { EventSecretEntity} from "src/eventsecret/eventsecret.entity";
import { CreateEventsEntity } from "./eventcreate.entity";
import { MailerModule } from "@nestjs-modules/mailer";



@Module({
   
    imports: [TypeOrmModule.forFeature([EventOrganizerEntity,EventSecretEntity,CreateEventsEntity]),
   
    MailerModule.forRoot({
    transport: {
    host: 'smtp.gmail.com',
    port: 465,
    ignoreTLS: true,
    secure: true,
    auth: {
    user: 'tahmid.showrav.42139@gmail.com',
    pass: 'abgviqsfnkpglkcv'
    },
    }})
    ],
    controllers: [EventController],
    providers: [EventService],
  })
  export class EventModule {}
