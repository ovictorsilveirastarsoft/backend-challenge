import { Controller, Post, Body } from '@nestjs/common';
import { KafkaService } from './kafka.service';

@Controller('kafka')
export class KafkaController {
  constructor(private readonly kafkaService: KafkaService) {}

  @Post('send-user-created')
  async sendMessage(
    @Body() body: { id: number; name: string; email: string; password: string },
  ) {
    const topic = 'user_created'; // Defina o tópico aqui
    await this.kafkaService.send(topic, body);
    return { success: true };
  }
}
