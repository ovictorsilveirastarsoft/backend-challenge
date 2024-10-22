import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'O nome deve ser uma string.' })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'O email deve ser um endereço de email válido.' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'A senha deve ser uma string.' })
  password?: string; // Lembre-se de hash a senha antes de atualizar!
}
