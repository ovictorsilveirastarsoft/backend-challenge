import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users') // Nome da tabela no banco de dados
export class User {
  @PrimaryGeneratedColumn() // Gera um ID único automaticamente
  id: number;

  @Column() // Coluna para o nome do usuário
  name: string;

  @Column({ unique: true }) // Coluna para o email, deve ser único
  email: string;

  @Column() // Coluna para a senha
  password: string; // Lembre-se de hash a senha antes de salvar!
}
