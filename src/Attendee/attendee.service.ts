import { MailerService } from '@nestjs-modules/mailer/dist';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { BookedEventEntity } from 'src/BookedEvent/bookedEvent.entity';

import { FeedbackEntity } from 'src/Feedback/feedback.entity';
import { SurveyEnity } from 'src/Surveys/surveys.entity';
import { Repository } from 'typeorm';
import { AttendeeEntity, AttendeeOtpEntity, UpdateAttendeeEntity } from './attendee.entity';
import { CreateEventsEntity } from 'src/event/eventcreate.entity';

@Injectable()
export class AttendeeService {
  constructor(
    @InjectRepository(AttendeeEntity)
    private attendeeRepository: Repository<AttendeeEntity>,
    @Inject(MailerService) private readonly mailerService: MailerService,
    @InjectRepository(AttendeeOtpEntity)
    private otpRepository: Repository<AttendeeOtpEntity>,
    @InjectRepository(SurveyEnity)
    private surveyRepository: Repository<SurveyEnity>,
    @InjectRepository(FeedbackEntity)
    private feedbackRepository: Repository<FeedbackEntity>,
    @InjectRepository(CreateEventsEntity)
    private eventRepository: Repository<CreateEventsEntity>,
    @InjectRepository(BookedEventEntity)
    private bookeventRepository: Repository<BookedEventEntity>,
  ) {}
  async addAttendee(attendee: AttendeeEntity): Promise<AttendeeEntity> {
    const atn = await this.findAttendeeByUsername(attendee.Username);
    if (atn != null) {
      return null;
    }
    const salt = await bcrypt.genSalt();
    attendee.Password = await bcrypt.hash(attendee.Password, salt);
    return this.attendeeRepository.save(attendee);
  }
  async getAttendee(): Promise<AttendeeEntity[]> {
    return this.attendeeRepository.find();
  }
  async deleteAttendee(id: number) {
    await this.attendeeRepository.delete(id);
  }
  async updateattendee(
    id: number,
    attendee: UpdateAttendeeEntity,
  ): Promise<UpdateAttendeeEntity> {
    await this.attendeeRepository.update(id, attendee);
    return this.attendeeRepository.findOneBy({ Id: id });
  }
  async updateattendeephoto(
    id: number,
    photoName: string,
  ): Promise<AttendeeEntity> {
    const attendee: AttendeeEntity = await this.getAttendeeById(id);
    attendee.PhotoName = photoName;
    await this.attendeeRepository.update(id, attendee);
    return this.attendeeRepository.findOneBy({ Id: id });
  }
  async getAttendeeById(id: number): Promise<AttendeeEntity> {
    return this.attendeeRepository.findOne({ where: { Id: id } });
  }
  async getevent(): Promise<CreateEventsEntity[]> {
    return this.eventRepository.find();
  }

  async bookorder(
    eid: number,
    aid: number,
    discount: number,
  ): Promise<BookedEventEntity> {
    const event: CreateEventsEntity = await this.eventRepository.findOne({
      where: { Id: eid },
    });
    const attendee: AttendeeEntity = {
      Id: aid,
      Name: '',
      Username: '',
      Password: '',
      Email: '',
      Dob: undefined,
      PhotoName: '',
      Phonenumber: '',
      BookedEvents: [],
      surveys: [],
    };
    const bookEvent: BookedEventEntity = {
      Name: event.Name,
      Location: event.Location,
      EventTime: event.Time,
      TicketPrice:
        discount != 0
          ? Math.ceil(event.TicketPrice * (discount / 100))
          : event.TicketPrice,
      Address: event.Address,
      Description: event.Description,
      Discount: discount,
      TicketNumber: (Math.random() * 100).toString(),
      BookingTime: new Date(),
      Attendee: attendee,
      Feedback: null,
      Event: event,
      Id: 0,
    };
    return this.bookeventRepository.save(bookEvent);
  }
  async getbookedEventinfofromAid(aid: number): Promise<BookedEventEntity[]> {
    const attendee: AttendeeEntity = await this.attendeeRepository.findOne({
      where: { Id: aid },
      relations: { BookedEvents: true },
    });
    return attendee.BookedEvents;
  }
  async addfeedback(
    feedback: FeedbackEntity,
    eid: number,
  ): Promise<FeedbackEntity> {
    const bookedevent = await this.bookeventRepository.findOne({
      where: { Id: eid },
      relations: { Attendee: true },
    });
    feedback.Username = bookedevent.Attendee.Username;
    feedback.Email = bookedevent.Attendee.Email;
    feedback.EventName = bookedevent.Name;
    feedback.BookedEvent = bookedevent;
    return this.feedbackRepository.save(feedback);
  }
  async addSurveyToCustomer(
    servey: SurveyEnity,
    aId: number,
  ): Promise<AttendeeEntity> {
    const attendee = await this.attendeeRepository.findOne({
      where: { Id: aId },
      relations: { surveys: true },
    });
    servey.Username = attendee.Username;
    const survey = await this.surveyRepository.save(servey);

    if (survey && attendee) {
      attendee.surveys = [...attendee.surveys, survey];
      return this.attendeeRepository.save(attendee);
    }
  }
  async login(atendeelog: AttendeeEntity): Promise<boolean> {
    const attendee: AttendeeEntity = await this.findAttendeeByUsername(
      atendeelog.Username,
    );
    if (attendee == null) {
      return false;
    }
    return await bcrypt.compare(atendeelog.Password, attendee.Password);
  }
  async findAttendeeByUsername(username: string): Promise<AttendeeEntity> {
    const attendee = await this.attendeeRepository.findOne({
      where: { Username: username },
    });
    if (attendee != null) {
      return attendee;
    }
    return null;
  }
  async testemail(): Promise<void> {
    await this.mailerService.sendMail({
      to: 'jmjizan@gmail.com',
      subject: 'helow',
      text: `
            Kiobosta
            eito
            yooo:dff
            `,
    });
  }
  async genarateOtp(username: string): Promise<boolean> {
    const attendee = await this.findAttendeeByUsername(username);
    if (attendee == null) {
      return false;
    }

    const gOtp = (Math.random() + 1).toString(36).substring(7);
    await this.mailerService.sendMail({
      to: attendee.Email,
      subject: 'Otp',
      text: 'Your otp: ' + gOtp,
    });

    const otp: AttendeeOtpEntity = {
      Id: 0,
      Username: username,
      Otp: gOtp,
    };
    await this.otpRepository.save(otp);
    return true;
  }

  async changeapass(username: string, otp: string, password: string) {
    const otps = await this.otpRepository.findOne({
      where: { Username: username, Otp: otp },
    });
    if (otps == null) {
      return false;
    } else {
      const salt = await bcrypt.genSalt();
      const attendee = await this.findAttendeeByUsername(username);
      attendee.Password = password;
      attendee.Password = await bcrypt.hash(attendee.Password, salt);
      await this.attendeeRepository.update(attendee.Id, attendee);

      await this.otpRepository.delete(otps.Id);
      return true;
    }
  }
  async deletebookedevent(aid: number, bid: number): Promise<boolean> {
    const attendee: AttendeeEntity = await this.attendeeRepository.findOne({
      where: { Id: aid },
      relations: { BookedEvents: true },
    });
    let bookedevent: BookedEventEntity = null;
    attendee.BookedEvents.forEach((element) => {
      if (bid == element.Id) {
        bookedevent = element;
      }
    });
    console.log(bookedevent);
    if (bookedevent == null) {
      return false;
    } else {
      const bv: BookedEventEntity = await this.bookeventRepository.findOne({
        where: { Id: bookedevent.Id },
        relations: { Feedback: true },
      });
      await this.feedbackRepository.delete(bv.Feedback.Id);
      await this.bookeventRepository.delete(bookedevent.Id);
      return true;
    }
  }
}
