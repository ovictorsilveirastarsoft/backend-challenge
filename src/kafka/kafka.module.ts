import { Module } from '@nestjs/common';
import { DatabaseModule } from 'database/database.module';
import { ProducerService } from './producer.service';
import { ConsumerService } from './consumer.service';

@Module({
  imports: [DatabaseModule],
  providers: [ ProducerService, ConsumerService],
  exports: [ProducerService, ConsumerService],
})
export class KafkaModule {}
