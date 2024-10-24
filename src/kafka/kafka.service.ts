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

  async send(topic: string, message: any) {
    // Log o tamanho da mensagem
    console.log(
      'Tamanho da mensagem:',
      Buffer.byteLength(JSON.stringify(message)),
    );

    // Enviar a mensagem para o Kafka
    return this.kafkaClient.send(topic, message);
  }
}
