import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module'; // Ajuste o caminho conforme necessário
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db', // Ou o host que você está usando
      port: 5432,
      username: 'usuario',
      password: 'senha',
      database: 'meu_banco',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Não use em produção
    }),
    UsersModule,
  ],
})
export class AppModule {}
