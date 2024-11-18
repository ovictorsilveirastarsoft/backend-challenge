import { KafkaService } from './kafka.service';
export declare class KafkaController {
    private readonly kafkaService;
    constructor(kafkaService: KafkaService);
    sendMessageCreated(body: {
        id: number;
        name: string;
        email: string;
        password: string;
    }): Promise<{
        success: boolean;
    }>;
    sendMessageUpdated(body: {
        id: number;
        name: string;
        email: string;
        password: string;
    }): Promise<{
        success: boolean;
    }>;
}
