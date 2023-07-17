import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AttendeeEntity } from 'src/Attendee/attendee.entity';
import { EventDTO } from 'src/event/event.dto';
import { EventOrganizerEntity } from 'src/event/eventorganizer.entity';
import { EventSecretEntity } from 'src/eventsecret/eventsecret.entity';
import { Repository } from 'typeorm';
import { AdminDTO } from './admin.dto';
import { AdminEntity, OTP_Entity } from './admin.entity';
import { CreateEventsEntity } from 'src/event/eventcreate.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity) private adminRepo: Repository<AdminEntity>,
    @InjectRepository(OTP_Entity) private otpRepo: Repository<OTP_Entity>,
    @InjectRepository(AttendeeEntity)
    private attendeeRepo: Repository<AttendeeEntity>,
    @InjectRepository(EventOrganizerEntity)
    private eventorganizerRepository: Repository<EventOrganizerEntity>,
    @InjectRepository(EventSecretEntity)
    private eventsecretRepository: Repository<EventSecretEntity>,
    @InjectRepository(CreateEventsEntity)
    private eventRepo: Repository<CreateEventsEntity>,
    private readonly mailerService: MailerService,
  ) {}
  async adminRegistration(data: AdminDTO): Promise<AdminEntity> {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPass = await bcrypt.hash(data.password, salt);

      const result = await this.adminRepo.save({
        ...data,
        password: hashedPass,
      });
      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        'User data is not saved in database',
        { cause: new Error(), description: error },
      );
    }
  }

  async signIn(data: { email: string; password: string }) {
    const userdata = await this.adminRepo.findOneBy({ email: data.email });
    if (!userdata) {
      return { isUserExist: false, message: 'User does not exist' };
    } else {
      const isValidPass: boolean = await bcrypt.compare(
        data.password,
        userdata.password,
      );
      if (isValidPass) {
        const { id, name, email, phone } = userdata;
        return {
          isUserExist: true,
          isValidPass,
          data: { id, name, email, phone },
        };
      } else {
        return {
          isUserExist: true,
          isValidPass,
          message: 'Password is not correct',
        };
      }
    }
  }

  async getAdmin(email: string): Promise<AdminEntity | null> {
    const result = await this.adminRepo.findOneBy({ email });
    return result;
  }

  async sendOTPResetPassword(email: string) {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const result = await this.adminRepo.findOneBy({ email });

    if (!result) {
      return { message: 'User does not exist', isUserExist: false };
    } else {
      const otpResult = await this.otpRepo.save({
        otp: otp.toString(),
        email,
        status: 0,
      });
      if (!otpResult) {
        return { message: 'OTP not saved', isUserExist: true, error: true };
      } else {
        //use sendMail to send email
        const sendResult = await this.mailerService.sendMail({
          from: `Event Management System <${process.env.MAIL_USER}>`, // sender address
          to: email,
          subject: 'OTP for reset password',
          text: `OTP code for reset your password: ${otp}`,
        });
        console.log(sendResult, 'sendResult');
        if (!sendResult) {
          return {
            message: 'OTP not sent',
            isUserExist: true,
            mailSended: false,
            error: true,
          };
        } else {
          return {
            message: 'OTP sent',
            isUserExist: true,
            mailSended: true,
          };
        }
      }
    }
  }

  async verifyOTPResetPassword(data: { email: string; otp: string }) {
    const otpResult = await this.otpRepo.findOneBy({
      email: data.email,
      otp: data.otp,
      status: 0,
    });
    if (!otpResult) {
      return { message: 'OTP not matched', isOTPMatched: false };
    } else {
      const updatedOtp = await this.otpRepo.update(
        { id: otpResult.id },
        { status: 1 },
      );
      if (!updatedOtp) {
        return { message: 'OTP not updated', isOTPMatched: false };
      }
      return { message: 'OTP matched', isOTPMatched: true };
    }
  }

  async resetPassword(data: { email: string; password: string; otp: string }) {
    const otpResult = await this.otpRepo.findOneBy({
      email: data.email,
      otp: data.otp,
      status: 1,
    });
    if (!otpResult) {
      return {
        message: 'OTP not matched',
        isOTPMatched: false,
        isPasswordUpdated: false,
      };
    } else {
      const salt = await bcrypt.genSalt();
      const hashedPass = await bcrypt.hash(data.password, salt);
      const updatedPass = await this.adminRepo.update(
        { email: data.email },
        { password: hashedPass },
      );
      if (!updatedPass) {
        return {
          message: 'Password not updated',
          isPasswordUpdated: false,
          isOTPMatched: true,
        };
      } else {
        return {
          message: 'Password updated',
          isPasswordUpdated: true,
          isOTPMatched: true,
        };
      }
    }
  }

  async updateProfile(data: AdminDTO, email: string) {
    console.log(data, 'email');
    const result = await this.adminRepo.update({ email }, data);
    console.log(result, 'result');
    if (!result) {
      return { message: 'Profile not updated', isProfileUpdated: false };
    } else {
      return { message: 'Profile updated', isProfileUpdated: true };
    }
  }

  async addAttendee(data: AttendeeEntity) {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPass = await bcrypt.hash(data.Password, salt);

      const result = await this.attendeeRepo.save({
        ...data,
        Password: hashedPass,
      });
      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        'Attendee data is not saved in database',
        { cause: new Error(), description: error },
      );
    }
  }

  async getAttendeeList():Promise<AttendeeEntity[]> {
    const result = await this.attendeeRepo.find({
      select: ['Name', 'Username',
        'Email',
        'Dob',
        'PhotoName',
        'Phonenumber']
    });
    return result;
  }

  async deleteAddendee(id: number) {
    const result = await this.attendeeRepo.delete({ Id: id });
    if (!result) {
      return { message: 'Attendee not deleted', isDeleted: false };
    } else {
      return { message: 'Attendee deleted', isDeleted: true };
    }
  }

  //event organizer related service
  async addEventOrganizer(eventorganizer: EventDTO) {
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
      if (!result) {
        return { message: 'Event Organizer not added', isAdded: false };
      } else {
        return { result, message: 'Event Organizer added', isAdded: true };
      }
    }
  }
  async updateEventOrganizer(data: EventDTO, Email: string) {
    console.log(data, 'email');
    const result = await this.eventorganizerRepository.update({ Email }, data);
    console.log(result, 'result');
    if (!result) {
      return { message: 'Profile not updated', isProfileUpdated: false };
    } else {
      return { message: 'Profile updated', isProfileUpdated: true };
    }
  }

  async getEventOrganizerList(): Promise<EventOrganizerEntity[]> {
    const result = await this.eventorganizerRepository.find({
      select: ['Name',
      'Email',
      'DOB',
      'Address',
      'Phonenumber',
      'Photo'],
    });
    return result;
  }

  // event related service 
  async addEvent(event: CreateEventsEntity) {
    try {

      const result = await this.eventRepo.save({
        ...event,
      });
      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        'User data is not saved in database',
        { cause: new Error(), description: error },
      );
    }
  }

  async updateEvent(event: CreateEventsEntity, Id: number) {
    const result = await this.eventRepo.update({ Id }, event);
    if (!result) {
      return { message: 'Event is not updated', isEventUpdated: false };
    } else {
      return { message: 'Event updated', isEventUpdated: true };
    }
  }

  async deleteEvent(id: number) {
    const result = await this.eventRepo.delete({ Id: id });
    if (!result) {
      return { message: 'Event not deleted', isDeleted: false };
    } else {
      return { message: 'Event deleted', isDeleted: true };
    }
  }

  async getEventList(): Promise<CreateEventsEntity[]> {
    const result = await this.eventRepo.find();
    return result;
  }
}
