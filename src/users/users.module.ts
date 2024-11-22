import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {  UsersController, UsersService } from 'users';
import { Users } from '@users/entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisService } from 'cache/redis.service';
import { UserCacheService } from './user-cache.service';
import { ProducerService } from 'kafka/producer.service';
import{ CreateUserUseCase, UpdateUserUseCase, DeleteUserUseCase } from './use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['kafka:9092'],
          },
        },
      },
    ]),
    ],
  providers: [
    UsersService,
    RedisService,
    UserCacheService,
    ProducerService,
    CreateUserUseCase, 
    UpdateUserUseCase, 
    DeleteUserUseCase,
  ],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
