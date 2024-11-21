import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, Length } from 'class-validator';
import { Column } from 'typeorm';

export class UpdateUserDto {
  @ApiProperty()
  @IsString({ message: 'The name must be a string.' })
  @IsNotEmpty({ message: 'The name cannot be empty.' })
  @Length(2, 100, { message: 'The name must be between 2 and 100 characters.' })
  name: string;

  @ApiProperty()
  @IsEmail({}, { message: 'The email must be a valid email address.' })
  @IsNotEmpty({ message: 'The email cannot be empty.' })
  @Length(6, 100, { message: 'The email must be between 6 and 100 characters.' })
  @Column({ type: 'varchar', unique: true })
  email: string;

  @ApiProperty()
  @IsString({ message: 'The password must be a string.' })
  @IsNotEmpty({ message: 'The password cannot be empty.' })
  @IsStrongPassword()
  @Length(8, 100, { message: 'The password must be between 8 and 100 characters.' })
  password: string;
}
