import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';
import { AdminEntity, OTP_Entity } from './admin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminDTO } from './admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity) private adminRepo: Repository<AdminEntity>,
    @InjectRepository(OTP_Entity) private otpRepo: Repository<OTP_Entity>,
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

  async updateProfile(data: AdminDTO) {
    const result = await this.adminRepo.update({ email: data.email }, data);
    if (!result) {
      return { message: 'Profile not updated', isProfileUpdated: false };
    } else {
      return { message: 'Profile updated', isProfileUpdated: true };
    }
  }
}
