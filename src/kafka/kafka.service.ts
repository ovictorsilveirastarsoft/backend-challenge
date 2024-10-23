import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaService implements OnModuleInit {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  async emit(topic: string, message: any) {
    return this.kafkaClient.emit(topic, message);
  }

  async send(topic: string, message: any) {
    return this.kafkaClient.send(topic, message);
  }
}
