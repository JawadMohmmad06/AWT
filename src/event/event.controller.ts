import { Body, Controller, Get, Param, Post, Put, Query, Request, Res, UploadedFile, UseInterceptors, UsePipes, ValidationPipe, ParseIntPipe, ParseArrayPipe, Delete, HttpStatus, NotFoundException, Session, UseGuards } from "@nestjs/common";
import { EventService } from "./event.service";
import { EventDTO, EventUpdateDTO, EventLoginDTO, EventLoginfromDTO, EventsDTO } from "./event.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { MulterError, diskStorage } from "multer";
import { EventOrganizerEntity } from "./eventorganizer.entity";
import { EventSecretEntity } from "src/eventsecret/eventsecret.entity";
import { SessionGuard } from "./session.guard";
import { CreateEventsEntity } from "./eventcreate.entity";


@Controller('event')
export class EventController {

    constructor(private readonly eventService: EventService) { }


@Get('/getmailer')

mailerread(){
    return this.eventService.mailerread();
}


   
    // add event secret

    @Post('/addeventsecret')
    addeventsecret(@Body() eventsecret) {
        console.log(eventsecret);
        return this.eventService.addeventsecret(eventsecret);
    }
    // create events
    @Post('/createevents')
    createevents(@Body() createevents) {
        console.log(createevents);
        return this.eventService.createevents(createevents);
    }


    // search for the event organizer

    @Get('/eventorgaizersearch/:id')
    @UseGuards(SessionGuard)

    async getEventById(@Param('id', ParseIntPipe) id: number): Promise<EventOrganizerEntity> {

        const res = await this.eventService.getEventById(id)
        if (res !== null) {
            console.log(res);
            return res;
        }
        else {
            throw new NotFoundException({
                status: HttpStatus.NOT_FOUND,
                message: "Event organizer not found"
            });
        }
    }
     // search for the event 
    @Get('/eventsearch/:id')
    async getEventSearchById(@Param('id', ParseIntPipe) id: number): Promise<CreateEventsEntity> {

        const res = await this.eventService.getEventSearchById(id)
        if (res !== null) {
            console.log(res);
            return res;
        }
        else {
            throw new NotFoundException({
                status: HttpStatus.NOT_FOUND,
                message: "Event organizer not found"
            });
        }
    }




    // search for the event by id and name 
    @Get('/eventorgaizersearch/:id/name')
    async getEventbyIDAndName(@Param('id', ParseIntPipe) @Param('name', ParseIntPipe) id: number, name: any): Promise<EventOrganizerEntity> {

        const res = await this.eventService.getEventbyIDAndName(id, name)
        if (res !== null) {
            console.log(res);
            return res;
        }
        else {
            throw new NotFoundException({
                status: HttpStatus.NOT_FOUND,
                message: "Event not found"
            });
        }
    }
    //shows all events organization in database
    @Get('/getalleventorganization')
    async getAllEventsOrganization(): Promise<EventOrganizerEntity[]> {
        return this.eventService.getAllEventsOrganization();
    }
      //shows all events in database
      @Get('/getallevents')
      async getAllEvents(): Promise<CreateEventsEntity[]> {
          return this.eventService.getAllEvents();
      }

    //file uploads
    @Post('/signup')

    @UseInterceptors(FileInterceptor('Photo',

        {
            fileFilter: (req, file, cb) => {

                if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))

                    cb(null, true);

                else {

                    cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);

                }

            },

            limits: { fileSize: 300000 },

            storage: diskStorage({

                destination: './uploads',

                filename: function (req, file, cb) {

                    cb(null, Date.now() + file.originalname)

                },

            })

        }))

    @UsePipes(new ValidationPipe())

    async addeventsphoto(@Body() events: EventOrganizerEntity, @UploadedFile() Photo: Express.Multer.File): Promise<EventOrganizerEntity> {

        events.Photo = Photo.filename

        return this.eventService.create(events)

    }

    //view the uploaded photos
    @Get('/getphoto/:name')
    getbyphotos(@Param('name') name, @Res() res) {
        res.sendFile(name, { root: './uploads' })
    }

    // update
    @Put('/updateevent')
    @UseGuards(SessionGuard)
    //@UsePipes(new ValidationPipe())
    updateevent(@Body() data: EventUpdateDTO, @Session() session): object {
        console.log(session.username);
        return this.eventService.updateevent(session.username, data);
    }
    @Put('/updateuserevent/:id')
    @UsePipes(new ValidationPipe())
    updateEventById(@Param("id",ParseIntPipe) id: number, @Body() data: EventLoginDTO): object {
        return this.eventService.updateEventById(id, data);
    }
    //update to events;
    @Put('/updateevent/:id')
    @UsePipes(new ValidationPipe())
    updatecreateEventById(@Param("id",ParseIntPipe) id: number, @Body() data: EventsDTO): object {
        return this.eventService.updatecreateEventById(id, data);
    }

  
    @UsePipes(new ValidationPipe)
    signup(@Body() mydata: EventDTO, @UploadedFile() photo: Express.Multer.File) {
        console.log(mydata);
        console.log(photo.filename);
        mydata.Photo = photo.filename;
        return this.eventService.signup(mydata);

    }
 

    @Post('/signin')
    signIn(@Body() data: EventDTO, @Session() session) {
        session.username = data.Username;
        if (this.eventService.signIn(data)) {
            // session.username = data.username;
            return true;
        }
        else {

            return false;
        }
        

    }
    // delete
    @Delete('/eventorganizationdelete/:id')
    async deleteorganization(@Param('id') id: number): Promise<EventOrganizerEntity[]> {
        return this.eventService.deleteorganization(id);
        // return this.adminService.getAlladmins();
    }
      // delete
      @Delete('/eventdelete/:id')
      async deleteEvents(@Param('id') id: number): Promise<EventOrganizerEntity[]> {
          return this.eventService.deleteEvents(id);
          // return this.adminService.getAlladmins();
      }


}




