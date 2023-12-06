import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsPhoneNumber,
} from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNotEmpty({ message: 'First Name is required' })
  firstName: string;

  @IsNotEmpty({ message: 'Last Name is required' })
  lastName: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsPhoneNumber('IN', { message: 'Invalid phone number format' })
  phone: string;

  @IsBoolean({ message: 'User cannot be deleted' })
  @IsIn([false])
  isDeleted: boolean;
}
