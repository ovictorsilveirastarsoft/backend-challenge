import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['kafka:9092'], // Use o nome do serviço definido no docker-compose
          },
          consumer: {
            groupId: 'user-consumer',
          },
        },
      },
    ]),
  ],
  exports: [ClientsModule], // Exporte o ClientsModule para uso em outros módulos
})
export class KafkaModule {}
