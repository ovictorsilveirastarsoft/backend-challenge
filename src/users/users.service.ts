import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from '@users/dto';
import { Users } from '@users/entity';
import { ClientKafka } from '@nestjs/microservices';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @Inject('KAFKA_SERVICE')
    private readonly kafkaService: ClientKafka,
  ) {}

  
  async addUser(createUserDto: CreateUserDto): Promise<Users> {
    return this.create(createUserDto);
  }

  
  async usersAll(page: number, limit: number): Promise<Users[]> {
    return this.findAll(page, limit);
  }

  
  async findUser(id: number): Promise<Users> {
    return this.findOne(id);
  }

  
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<Users> {
    return this.update(id, updateUserDto);
  }

  
  async removeUser(id: number): Promise<void> {
    return this.remove(id);
  }

  private async create(createUserDto: CreateUserDto): Promise<Users> {
    const { email, password } = createUserDto;

    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('This email is already registered.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({ ...createUserDto, password: hashedPassword });

    await this.usersRepository.save(user);

    this.kafkaService.emit('user_created', {
      id: user.id,
      name: user.name,
      email: user.email,
    });

    return user;
  }

  private async findAll(page: number = 1, limit: number = 10): Promise<Users[]> {
    const skip = (page - 1) * limit;
    const users = await this.usersRepository.find({ skip, take: limit });
  
    if (users.length === 0) {
      throw new NotFoundException('No registered users.');
    }
  
    return users;
  }
  

  private async findOne(id: number): Promise<Users> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return user;
  }

  private async update(id: number, updateUserDto: UpdateUserDto): Promise<Users> {
    const user = await this.findOne(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const emailTaken = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (emailTaken) {
        throw new BadRequestException('This email is already registered.');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.usersRepository.save(user);

    this.kafkaService.emit('user_updated', {
      id: user.id,
      name: user.name,
      email: user.email,
    });

    return updatedUser;
  }

  private async remove(id: number): Promise<void> {
    const user = await this.findOne(id);

    await this.usersRepository.delete(id);

    this.kafkaService.emit('user_deleted', {
      id: user.id,
      name: user.name,
      email: user.email,
    });

    throw new HttpException('User deleted successfully!', HttpStatus.OK);
  }
}
