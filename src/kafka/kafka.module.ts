import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaService } from './kafka.service';
import { UserConsumer } from './consumers/user.consumer'; // Exemplo de consumer

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['kafka:9092'], // Altere para seu broker
          },
          consumer: {
            groupId: 'my-consumer-group', // Grupo do consumidor
          },
        },
      },
    ]),
  ],
  providers: [KafkaService, UserConsumer],
  exports: [KafkaService],
})
export class KafkaModule {}
