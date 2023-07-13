import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class AttendeeDTO {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsEmail({}, { message: 'Email must be a valid email' })
  email: string;

  @IsNotEmpty({ message: "User con't be empty" })
  username: string;

  @IsString()
  @MinLength(6, { message: 'Password is too short' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  })
  password: string;

  @IsDateString({ strict: true }, { message: 'Date of birth must be a date' })
  dob: Date;

  @IsPhoneNumber('BD', { message: 'Phone number must be a valid phone number' })
  phone: string;

  @IsString({ message: 'Address must be a string' })
  address: string;
}

export class OTP_DTO {
  @IsNotEmpty({ message: 'OTP is required' })
  @IsString({ message: 'OTP must be a string' })
  otp: string;

  @IsEmail({}, { message: 'Email must be a valid email' })
  email: string;

  status: number;
}
