import { Repository } from 'typeorm';
import { Users } from './entity/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ClientKafka } from '@nestjs/microservices';
export declare class UsersService {
    private usersRepository;
    private readonly kafkaService;
    constructor(usersRepository: Repository<Users>, kafkaService: ClientKafka);
    create(createUserDto: CreateUserDto): Promise<Users>;
    findAll(): Promise<Users[]>;
    findOne(id: number): Promise<Users>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<Users>;
    remove(id: number): Promise<void>;
}
