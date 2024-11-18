import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entity/users.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<Users>;
    findAll(): Promise<Users[]>;
    findOne(id: number): Promise<Users>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<Users>;
    remove(id: number): Promise<void>;
}
