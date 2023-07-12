import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Session,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminEntity } from './admin.entity';
import { AdminDTO } from './admin.dto';
import { SessionGuard } from './session.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Post('/register')
  @UsePipes(new ValidationPipe())
  async adminRegistration(@Body() data: AdminDTO): Promise<AdminEntity> {
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
  async updateProfile(data: AdminDTO, @Session() session: { email: string }) {
    const result = await this.adminService.updateProfile(data);
    if (result.isProfileUpdated) {
      return result;
    } else {
      throw new HttpException(result, 500);
    }
  }
}
