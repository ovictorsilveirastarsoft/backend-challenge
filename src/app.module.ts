import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module'; // Ajuste o caminho conforme necessário
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
    ConfigModule,
    DatabaseModule,
    CacheModule.register({ isGlobal: true })
  ],
  providers: [{
    provide: APP_INTERCEPTOR,
    useClass: CacheInterceptor,
  }],
})
export class AppModule {}
