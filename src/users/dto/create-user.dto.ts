import { IsNotEmpty, IsEmail, IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty({ message: 'First Name is required' })
  firstName: string;

  @IsNotEmpty({ message: 'Last Name is required' })
  lastName: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsPhoneNumber('IN', { message: 'Invalid phone number format' })
  phone: string;
}
