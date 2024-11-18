import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Users } from '../users/entity/users.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
        const isProduction = process.env.NODE_ENV === 'production';
        const databaseUrl = process.env.DATABASE_URL;

        if (isProduction && databaseUrl) {
          console.log('Conectando ao banco de dados via DATABASE_URL...');
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [Users],
            synchronize: configService.get<boolean>('TYPEORM_SYNCHRONIZE') || false,
            logging: true,
            ssl: {
              rejectUnauthorized: false, 
            },
          };
        }

        console.log('Conectando ao banco de dados com configurações separadas...');
        console.log(`Host: ${configService.get('TYPEORM_HOST')}`);
        console.log(`Port: ${configService.get('TYPEORM_PORT')}`);
        return {
          type: 'postgres',
          host: configService.get<string>('TYPEORM_HOST'),
          port: configService.get<number>('TYPEORM_PORT'),
          username: configService.get<string>('TYPEORM_USERNAME'),
          password: configService.get<string>('TYPEORM_PASSWORD'),
          database: configService.get<string>('TYPEORM_DATABASE'),
          entities: [Users],
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
