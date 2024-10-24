import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        console.log(
          'Conectando ao banco de dados com as seguintes configurações:',
        );
        console.log(`Host: ${configService.get<string>('TYPEORM_HOST')}`);
        console.log(`Port: ${configService.get<number>('TYPEORM_PORT')}`);

        return {
          type: configService.get<string>('TYPEORM_CONNECTION') as any,
          host: configService.get<string>('TYPEORM_HOST'),
          port: configService.get<number>('TYPEORM_PORT'),
          username: configService.get<string>('TYPEORM_USERNAME'),
          password: configService.get<string>('TYPEORM_PASSWORD'),
          database: configService.get<string>('TYPEORM_DATABASE'),
          entities: [User], // Adicionando a entidade User
          synchronize: configService.get<boolean>('TYPEORM_SYNCHRONIZE'),
          logging: true,
          extra: {
            connectionLimit: 10,
            idleTimeoutMillis: 30000,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
