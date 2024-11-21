import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {  UsersController, UsersService } from 'users';
import { Users } from '@users/entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaModule } from 'kafka/kafka.module';
import { RedisService } from 'cache/redis';
import { CacheRedisModule } from 'cache/cache.module';

@Module({
  imports: [CacheRedisModule,
    KafkaModule,
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
    RedisService
  ],
  controllers: [UsersController],
})
export class UsersModule {}
