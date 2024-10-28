import { Injectable, OnModuleInit } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Users } from 'src/users/entity/users.entity';

@Injectable()
export class UserConsumer implements OnModuleInit {
  onModuleInit() {
    console.log('Kafka Consumer is initialized');
  }

  @MessagePattern('user_created')
  handleUserCreated(user: Users) {
    console.log('User created event received:', user);
    // Lógica adicional aqui
    console.log('Tamanho da mensagem:', JSON.stringify(user).length);
  }
}
