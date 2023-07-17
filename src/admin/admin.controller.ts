import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Session,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import { extname } from 'path';
import { AttendeeEntity } from 'src/Attendee/attendee.entity';
import { EventDTO } from 'src/event/event.dto';
import { AdminDTO } from './admin.dto';
import { AdminEntity } from './admin.entity';
import { AdminService } from './admin.service';
import { SessionGuard } from './session.guard';
import { CreateEventsEntity } from 'src/event/eventcreate.entity';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Post('/register')
  @UseInterceptors(
    FileInterceptor('avatar', {
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          cb(null, true);
        } else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
        }
      },
      limits: { fileSize: 2097152 },
      storage: diskStorage({
        destination: './uploads/admin',
        filename: function (req, file, cb) {
          const ext = extname(file.originalname);
          const fileName: string =
            file.originalname
              .replace(ext, '')
              .toLowerCase()
              .split(' ')
              .join('-') +
            '-' +
            Date.now();
          req.body.imageUrl = fileName + ext;
          cb(null, fileName + ext);
        },
      }),
    }),
  )
  @UsePipes(new ValidationPipe())
  async adminRegistration(
    @UploadedFile() avatar: Express.Multer.File,
    @Body() data: AdminDTO,
  ): Promise<AdminEntity> {
    console.log(avatar);
    data.imageUrl = avatar.filename;
    return this.adminService.adminRegistration(data);
  }

  @Post('/signin')
  async signIn(
    @Body() data: { email: string; password: string },
    @Session() session: { email: string; destroy: () => void },
  ) {
    const result = await this.adminService.signIn(data);
    if (!result.isUserExist && !result.isValidPass) {
      throw new HttpException(result, 400);
    } else if (result.isValidPass) {
      session.email = data.email;
      return result;
    } else {
      throw new HttpException(result, 401);
    }
    // return this.adminService.signIn(data);
  }

  @Get('/signout')
  signout(@Session() session: { email: string; destroy: () => void }) {
    session.destroy();

    return { message: 'Signout successfully' };
  }

  @Get('/getadmin')
  @UseGuards(SessionGuard)
  getAdmin(@Session() session: { email: string }) {
    return this.adminService.getAdmin(session.email);
  }

  @Get('/getResetPassOtp/:email')
  async getResetPassOtp(@Param() data: { email: string }) {
    const result = await this.adminService.sendOTPResetPassword(data.email);
    if (result.isUserExist) {
      if (result.error) {
        throw new HttpException(result, 500);
      } else {
        return result;
      }
    } else {
      throw new HttpException(result, 400);
    }
  }

  @Post('/verifyOtp')
  async verifyOtp(@Body() data: { email: string; otp: string }) {
    const result = await this.adminService.verifyOTPResetPassword(data);
    if (!result.isOTPMatched) {
      throw new HttpException(result, 400);
    } else {
      return result;
    }
  }

  @Post('/resetPassword')
  async resetPassword(
    @Body() data: { email: string; password: string; otp: string },
  ) {
    const result = await this.adminService.resetPassword(data);
    if (!result.isOTPMatched) {
      throw new HttpException(result, 400);
    } else {
      if (result.isPasswordUpdated) {
        return result;
      } else {
        throw new HttpException(result, 500);
      }
    }
  }

  @Patch('/updateProfile')
  @UseGuards(SessionGuard)
  async updateProfile(
    @Body() data: AdminDTO,
    @Session() session: { email: string },
  ) {
    const result = await this.adminService.updateProfile(data, session.email);
    if (result.isProfileUpdated) {
      return result;
    } else {
      throw new HttpException(result, 500);
    }
  }

  // Attendee relate api
  @Post('/addAttendee')
  @UseGuards(SessionGuard)
  @UseInterceptors(
    FileInterceptor('PhotoName', {
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          cb(null, true);
        } else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
        }
      },
      limits: { fileSize: 2097152 },
      storage: diskStorage({
        destination: './uploads',
        filename: function (req, file, cb) {
          const ext = extname(file.originalname);
          const fileName: string =
            file.originalname
              .replace(ext, '')
              .toLowerCase()
              .split(' ')
              .join('-') +
            '-' +
            Date.now();
          req.body.PhotoName = fileName + ext;
          cb(null, fileName + ext);
        },
      }),
    }),
  )
  async addAttendee(@Body() data: AttendeeEntity) {
    return this.adminService.addAttendee(data);
  }

  @Get('/getAttendeeList')
  @UseGuards(SessionGuard)
  async getAttendeeList() {
    return this.adminService.getAttendeeList();
  }

  @Get('/deleteAttendee/:id')
  @UseGuards(SessionGuard)
  async deleteAttendee(@Param() data: { id: number }) {
    const result = await this.adminService.deleteAddendee(data.id);
    if (result.isDeleted) {
      return result;
    } else {
      throw new HttpException(result, 500);
    }
  }

  @Post('/addEventOrganizer')
  @UseInterceptors(
    FileInterceptor('Photo', {
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
          req.body.Photo = Date.now() + file.originalname;
          cb(null, Date.now() + file.originalname);
        },
      }),
    }),
  )
  async addEventOrganize(
    @Body() events: EventDTO,
    @UploadedFile() Photo: Express.Multer.File,
  ) {
    const result = await this.adminService.addEventOrganizer(events);

    if (result?.isAdded) {
      return result;
    } else {
      throw new HttpException({ message: 'There is server error' }, 500);
    }
  }

  @Patch('/updateEventOrganizer')
  @UseGuards(SessionGuard)
  async updateEventOrganizer(@Body() data: EventDTO) {
    const { Email } = data;
    const result = await this.adminService.updateEventOrganizer(data, Email);
    if (result.isProfileUpdated) {
      return result;
    } else {
      throw new HttpException(result, 500);
    }
  }

  @Get('/getEventOrganizerList')
  @UseGuards(SessionGuard)
  async getEventOrganizer() {
    return this.adminService.getEventOrganizerList();
  }

  // event related api endpoints
  @Post('/addEvent')
  @UseGuards(SessionGuard)
  @UsePipes(new ValidationPipe())
  async addEvent(@Body() data: CreateEventsEntity) {
    return this.adminService.addEvent(data);
  }

  @Patch('/updateEvent')
  @UseGuards(SessionGuard)
  async updateEvent(@Body() data: CreateEventsEntity) {
    const { Id } = data;
    const result = await this.adminService.updateEvent(data, Id);
    if (result.isEventUpdated) {
      return result;
    } else {
      throw new HttpException(result, 500);
    }
  }

  @Delete('/deleteEvent/:id')
  @UseGuards(SessionGuard)
  async deleteEvent(@Param() data: { id: number }) {
    const result = await this.adminService.deleteEvent(data.id);
    if (result.isDeleted) {
      return result;
    } else {
      throw new HttpException(result, 500);
    }
  }

  @Get('/getEvent')
  async getEvent() {
    return this.adminService.getEventList();
  }
}
