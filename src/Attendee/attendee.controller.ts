// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   HttpException,
//   HttpStatus,
//   Param,
//   ParseIntPipe,
//   Post,
//   Put,
//   Res,
//   Session,
//   UploadedFile,
//   UseGuards,
//   UseInterceptors,
//   UsePipes,
//   ValidationPipe,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { MulterError, diskStorage } from 'multer';
// import { BookedEventEntity } from 'src/BookedEvent/bookedEvent.entity';
// import { EventEntity } from 'src/Event/event.entity';
// import { FeedbackEntity } from 'src/Feedback/feedback.entity';
// import { SurveyEnity } from 'src/Surveys/surveys.entity';
// import { AttendeeEntity, changepassOtpDTO } from './attendee.entity';
// import { AttendeeService } from './attendee.service';
// import { SessionGuard } from './session.gurd';

// @Controller('attendee')
// export class AttendeeController {
//   constructor(private readonly attendeeService: AttendeeService) {}

//   @Post('/addattendee')
//   @UseGuards(SessionGuard)
//   @UseInterceptors(
//     FileInterceptor('image', {
//       fileFilter: (req, file, cb) => {
//         if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
//           cb(null, true);
//         else {
//           cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
//         }
//       },
//       limits: { fileSize: 300000 },
//       storage: diskStorage({
//         destination: './uploads',
//         filename: function (req, file, cb) {
//           cb(null, Date.now() + file.originalname);
//         },
//       }),
//     }),
//   )
//   @UsePipes(new ValidationPipe())
//   @UseGuards(SessionGuard)
//   async addAttendee(
//     @Body() attendee: AttendeeEntity,
//     @UploadedFile() file: Express.Multer.File,
//   ): Promise<AttendeeEntity> {
//     attendee.PhotoName = file.filename;
//     const info = await this.attendeeService.addAttendee(attendee);
//     if (info == null) {
//       throw new HttpException('Username already exist', HttpStatus.FORBIDDEN);
//     }
//     return info;
//   }
//   @Get('getattendee')
//   @UseGuards(SessionGuard)
//   async getattendee(): Promise<AttendeeEntity[]> {
//     return this.attendeeService.getAttendee();
//   }
//   @Delete('/deleteattendee/:id')
//   @UseGuards(SessionGuard)
//   async deleteattedee(@Param('id', ParseIntPipe) id: number) {
//     return this.attendeeService.deleteAttendee(id);
//   }
//   @UsePipes(new ValidationPipe())
//   @Put('/updateattendee/:id')
//   @UseGuards(SessionGuard)
//   async updateattendee(
//     @Param('id', ParseIntPipe) id: number,
//     @Body() atendee: AttendeeEntity,
//   ): Promise<AttendeeEntity> {
//     return this.attendeeService.updateattendee(id, atendee);
//   }
//   @Put('/updateattendeephoto/:id')
//   @UseGuards(SessionGuard)
//   @UseInterceptors(
//     FileInterceptor('image', {
//       fileFilter: (req, file, cb) => {
//         if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
//           cb(null, true);
//         else {
//           cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
//         }
//       },
//       limits: { fileSize: 300000 },
//       storage: diskStorage({
//         destination: './uploads',
//         filename: function (req, file, cb) {
//           cb(null, Date.now() + file.originalname);
//         },
//       }),
//     }),
//   )
//   async updateattendeephoto(
//     @Param('id', ParseIntPipe) id: number,
//     @UploadedFile() file: Express.Multer.File,
//   ): Promise<AttendeeEntity> {
//     return this.attendeeService.updateattendeephoto(id, file.filename);
//   }
//   @Get('/getattendee/:id')
//   @UseGuards(SessionGuard)
//   async getattendebyid(
//     @Param('id', ParseIntPipe) id: number,
//   ): Promise<AttendeeEntity> {
//     return this.attendeeService.getAttendeeById(id);
//   }
//   @Get('/events')
//   @UseGuards(SessionGuard)
//   async getevent(): Promise<EventEntity[]> {
//     return this.attendeeService.getevent();
//   }
//   @Post('/bookevent/:eid/:aid/:dis')
//   @UseGuards(SessionGuard)
//   async bookevent(
//     @Param('eid', ParseIntPipe) eid: number,
//     @Param('aid', ParseIntPipe) aid: number,
//     @Param('dis', ParseIntPipe) dis: number,
//   ): Promise<BookedEventEntity> {
//     return this.attendeeService.bookorder(eid, aid, dis);
//   }
//   @Get('/getbookeventfromaid/:aid')
//   @UseGuards(SessionGuard)
//   async getbookeventbyAid(
//     @Param('aid', ParseIntPipe) aid: number,
//   ): Promise<BookedEventEntity[]> {
//     return this.attendeeService.getbookedEventinfofromAid(aid);
//   }
//   @Post('/addfeedback/:eid')
//   @UseGuards(SessionGuard)
//   async addfeedback(
//     @Param('eid', ParseIntPipe) eid: number,
//     @Body() feedbacl: FeedbackEntity,
//   ): Promise<FeedbackEntity> {
//     return this.attendeeService.addfeedback(feedbacl, eid);
//   }
//   @Post('/addsurvey/:aid')
//   @UseGuards(SessionGuard)
//   async addsurvey(
//     @Param('aid', ParseIntPipe) aid: number,
//     @Body() survey: SurveyEnity,
//   ): Promise<AttendeeEntity> {
//     return this.attendeeService.addSurveyToCustomer(survey, aid);
//   }
//   @Post('/login')
//   async login(
//     @Body() atn: AttendeeEntity,
//     @Session() session: any,
//   ): Promise<boolean> {
//     const attendee = await this.attendeeService.login(atn);
//     if (!attendee) {
//       throw new HttpException(
//         'Username or password Incorrect',
//         HttpStatus.NOT_FOUND,
//       );
//     }
//     session.Username = atn.Username;
//     return attendee;
//   }

//   @Get('/getimage/:id')
//   @UseGuards(SessionGuard)
//   async getImages(
//     @Param('id', ParseIntPipe) id: number,
//     @Res() res,
//   ): Promise<void> {
//     const attende = await this.attendeeService.getAttendeeById(id);
//     res.sendFile(attende.PhotoName, { root: './uploads' });
//   }

//   @Get('/testmail')
//   async testmail(): Promise<void> {
//     return this.attendeeService.testemail();
//   }
//   @Get('/forgetpass/:username')
//   async getotp(@Param('username') username: string): Promise<boolean> {
//     const res = await this.attendeeService.genarateOtp(username);
//     console.log(res);
//     if (!res) {
//       throw new HttpException('Username  Incorrect', HttpStatus.NOT_FOUND);
//     } else {
//       return res;
//     }
//   }
//   @Post('/chnagepassword')
//   async changepass(@Body() passotp: changepassOtpDTO): Promise<boolean> {
//     const res = await this.attendeeService.changeapass(
//       passotp.Username,
//       passotp.Otp,
//       passotp.Otp,
//     );
//     if (!res) {
//       throw new HttpException(
//         'Username Or Otp  Incorrect',
//         HttpStatus.NOT_FOUND,
//       );
//     } else {
//       return true;
//     }
//   }
//   @Delete('/deletebookedevent/:aid/:bid')
//   @UseGuards(SessionGuard)
//   async deletebookedevent(
//     @Param('aid', ParseIntPipe) aid: number,
//     @Param('bid', ParseIntPipe) bid: number,
//   ): Promise<object> {
//     const res = await this.attendeeService.deletebookedevent(aid, bid);
//     if (res == false) {
//       throw new HttpException(
//         'This is not your booked event',
//         HttpStatus.FORBIDDEN,
//       );
//     } else {
//       return { message: 'Delete Done' };
//     }
//   }
// }
