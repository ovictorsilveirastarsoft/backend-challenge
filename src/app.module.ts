import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module'; // Ajuste o caminho conforme necessário
import { KafkaModule } from './kafka/kafka.module';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    KafkaModule,
    ConfigModule,
    DatabaseModule,
    CacheModule,
  ],
})
export class AppModule {}
