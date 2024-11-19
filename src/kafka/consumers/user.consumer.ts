import { Injectable, OnModuleInit } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Users } from 'users';

@Injectable()
export class UserConsumer implements OnModuleInit {
  onModuleInit() {
    console.log('Kafka Consumer is initialized');
  }

  @MessagePattern('user_created')
  handleUserCreated(user: Users) {
    console.log('User created event received:', user);
  }


  @MessagePattern('user_updated')
  handleUserUpdated(user: Users) {
    console.log('User updated event received:', user);
  }
}
