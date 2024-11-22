import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { KafkaModule } from './kafka/kafka.module';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';


@Module({
  imports: [
    ConfigModule.forRoot(
    {isGlobal: true,
    envFilePath: '.env',}
    ),
    UsersModule,
    KafkaModule,
    DatabaseModule,
    CacheModule.register({ isGlobal: true })
  ],
  providers: [{
    provide: APP_INTERCEPTOR,
    useClass: CacheInterceptor,
  }],
})
export class AppModule {}
