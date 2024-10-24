import { Injectable, OnModuleInit } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class UserConsumer implements OnModuleInit {
  onModuleInit() {
    console.log('Kafka Consumer is initialized');
  }

  @MessagePattern('user_created')
  handleUserCreated(user: User) {
    console.log('User created event received:', user);
    // Lógica adicional aqui
    console.log('Tamanho da mensagem:', JSON.stringify(user).length);
  }
}
