import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, IsStrongPassword, Length } from 'class-validator';

export class CreateUserDto {

  @ApiProperty()
  @IsString({ message: 'O nome deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome não pode estar vazio.' })
  @Length(2, 100, { message: 'O nome deve ter entre 2 e 100 caracteres.' })
  name: string;

  @ApiProperty()
  @IsEmail({}, { message: 'O email deve ser um endereço de email válido.' })
  @IsNotEmpty({ message: 'O email não pode estar vazio.' })
  @Length(6, 100, { message: 'O email deve ter entre 20 e 100 caracteres.' })
  email: string;

  @ApiProperty()
  @IsString({ message: 'A senha deve ser uma string.' })
  @IsNotEmpty({ message: 'A senha não pode estar vazia.' })
  @IsStrongPassword()
  @Length(8, 100, { message: 'A senha deve ter entre 8 e 100 caracteres.' })
  password: string;
}
