import { Controller, Post, Body } from '@nestjs/common';
import { KafkaService } from './kafka.service';

@Controller('kafka')
export class KafkaController {
  constructor(private readonly kafkaService: KafkaService) {}

  @Post('send')
  async sendMessage(@Body() body: { topic: string; message: string }) {
    await this.kafkaService.send(body.topic, body.message);
    return { success: true };
  }
}
