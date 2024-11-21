import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from 'database/database.module';
import { ProducerService } from './producer.service';
import { ConsumerService } from './consumer.service';

@Global()
@Module({
  imports: [],
  providers: [ ProducerService, ConsumerService],
  exports: [ProducerService, ConsumerService],
})
export class KafkaModule {}
