import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
} from 'class-validator';

export class EventDTO {
  // id:number;
  Id: number;
  @IsString({ message: 'invalid name' })
  @Matches(/^[a-zA-Z]+$/, { message: 'Enter a proper name' })
  Name: string;
  @IsEmail({}, { message: 'Invalid email' })
  Email: string;
  DOB: string;
  @IsString({ message: 'invalid address' })
  Address: string;
  Phonenumber: string;
  Photo: string;
  @IsNotEmpty({ message: 'please fillup the username' })
  Username: string;
  @IsString({ message: 'invalid password' })
  @IsNotEmpty({ message: 'please fillup the password' })
  Password: string;
}
export class EventsDTO {
  // id:number;
  Id: number;
  //    @IsString({message:"invalid name"})
  //     @Matches( /^[a-zA-Z]+$/, {message:"Enter a proper name"})
  Name: string;
  // @IsEmail({}, {message:"Invalid email"})
  Email: string;
  DOB: string;
  // @IsString({message:"invalid address"})
  Address: string;
  Phonenumber: string;

  Photo: string;
}

export class EventUpdateDTO {
  Id: number;
  @IsNotEmpty({ message: 'please fillup the username' })
  Username: string;
  Email: string;
  @IsString({ message: 'invalid password' })
  @IsNotEmpty({ message: 'please fillup the password' })
  Password: string;
}

// Event LOGIN DTO
export class EventLoginDTO {
  @IsNotEmpty({ message: 'please fillup the username' })
  Username: string;
  @IsString({ message: 'invalid password' })
  @IsNotEmpty({ message: 'please fillup the password' })
  Password: string;
}
export class EventLoginfromDTO {
  @IsNotEmpty({ message: 'please fillup the username' })
  Username: string;
  Id: number;
  @IsNumber()
  Number: number;
  @IsEmail()
  Email: string;
}
