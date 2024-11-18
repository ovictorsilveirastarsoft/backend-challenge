import { Controller, Post, Body, Patch } from '@nestjs/common';
import { KafkaService } from './kafka.service';

@Controller('kafka')
export class KafkaController {
  constructor(private readonly kafkaService: KafkaService) {}

  @Post('send-user-created')
  async sendMessageCreated(
    @Body() body: { id: number; name: string; email: string; password: string },
  ) {
    const topic = 'user_created';
    await this.kafkaService.send(topic, body);
    return { success: true };
  }

  @Patch('send-user-updated')
  async sendMessageUpdated(
    @Body() body: { id: number; name: string; email: string; password: string },
  ) {
    const topic = 'user_updated';
    await this.kafkaService.send(topic, body);
    return { success: true };
  }
}
