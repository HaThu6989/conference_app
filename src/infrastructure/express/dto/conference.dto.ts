import { Type } from "class-transformer";
import { IsDateString, IsNotEmpty, IsNumber, IsString, Min, ValidateNested } from "class-validator";
import 'reflect-metadata';

// controller valider si req.body correspond bien la structure dans ce dto
export class CreateConferenceInputs {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @Min(50)
  // @Max(1000)
  @IsNotEmpty()
  seats: number;

  @IsDateString()
  @IsNotEmpty()
  startDate: Date;
  
  @IsDateString()
  @IsNotEmpty()
  endDate: Date
}

export class ChangeSeatsInputs {
  @IsNumber()
  @Min(50)
  @IsNotEmpty()
  seats: number;
}

export class ChangeDatesInputs {
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;
  
  @IsDateString()
  @IsNotEmpty()
  endDate: Date
}

class UserDto {
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  emailAddress: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class BookConferenceInputs {
  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;

  @IsString()
  @IsNotEmpty()
  conferenceId: string
}

export class CancelConferenceInputs {
  @IsString()
  @IsNotEmpty()
  organizerId: string

  @IsString()
  @IsNotEmpty()
  conferenceId: string
}