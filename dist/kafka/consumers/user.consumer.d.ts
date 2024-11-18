import { OnModuleInit } from '@nestjs/common';
import { Users } from 'src/users/entity/users.entity';
export declare class UserConsumer implements OnModuleInit {
    onModuleInit(): void;
    handleUserCreated(user: Users): void;
    handleUserUpdated(user: Users): void;
}
