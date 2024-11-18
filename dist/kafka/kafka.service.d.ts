import { OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
export declare class KafkaService implements OnModuleInit {
    private readonly kafkaClient;
    constructor(kafkaClient: ClientKafka);
    onModuleInit(): Promise<void>;
    send(topic: string, message: any): Promise<import("rxjs").Observable<any>>;
}
