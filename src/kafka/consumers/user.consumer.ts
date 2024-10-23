import { Injectable } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Injectable()
export class UserConsumer {
  @MessagePattern('user-topic') // Tópico que você deseja escutar
  async handleUserMessage(message: any) {
    console.log(`Received message: ${JSON.stringify(message.value)}`);
    // Processar a mensagem aqui
  }
}
