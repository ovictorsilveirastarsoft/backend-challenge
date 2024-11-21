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
import { ProducerService } from 'kafka/producer.service';
import { RedisService } from 'cache/redis';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @Inject('KAFKA_SERVICE')
    private readonly kafka: ClientKafka,
    private readonly kafkaProducer: ProducerService,
    private readonly redisService: RedisService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Users> {
    return this.createUser(createUserDto);
  }

  async findAll(page: number, limit: number): Promise<Users[]> {
    return this.listAllUsers(page, limit);
  }

  async findOne(id: number): Promise<Users> {
    return this.getUserById(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<Users> {
    return this.updateUser(id, updateUserDto);
  }

  async remove(id: number): Promise<void> {
    return this.removeUser(id);
  }

  private async createUser(createUserDto: CreateUserDto): Promise<Users> {
    const { email, password } = createUserDto;

    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('This email is already registered.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    await this.usersRepository.save(user);
    await this.invalidateCache();
    await this.sendUserCreatedEvent(user);

    return user;
  }

  private async listAllUsers(page: number = 1, limit: number = 10): Promise<Users[]> {
    const skip = (page - 1) * limit;
    const cacheKey = `users_page_${page}_limit_${limit}`;
    const cacheVersionKey = 'users_cache_version';

    let cacheVersion = await this.redisService.get(cacheVersionKey);
    if (!cacheVersion) {
      cacheVersion = '1';
      await this.redisService.set(cacheVersionKey, cacheVersion);
    }

    const cachedData = await this.redisService.get(`${cacheKey}_v${cacheVersion}`);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const users = await this.usersRepository.find({ skip, take: limit });
    if (users.length === 0) {
      throw new NotFoundException('No registered users.');
    }

    await this.redisService.set(`${cacheKey}_v${cacheVersion}`, JSON.stringify(users));
    return users;
  }

  private async invalidateCache(): Promise<void> {
    const cacheVersionKey = 'users_cache_version';

    let currentVersion = await this.redisService.get(cacheVersionKey);
    const newVersion = currentVersion ? parseInt(currentVersion, 10) + 1 : 1;

    await this.redisService.set(cacheVersionKey, newVersion.toString());
  }

  private async getUserById(id: number): Promise<Users> {
    const cacheKey = `user:${id}`;
    const cachedUser = await this.redisService.get(cacheKey);

    if (cachedUser) {
      return JSON.parse(cachedUser);
    }

    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    await this.redisService.set(cacheKey, JSON.stringify(user));
    return user;
  }

  private async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<Users> {
    const user = await this.getUserById(id);

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

    await this.invalidateCache();
    await this.sendUserUpdatedEvent(updatedUser);

    return updatedUser;
  }

  private async removeUser(id: number): Promise<void> {
    const user = await this.getUserById(id);
    await this.usersRepository.delete(id);
    await this.invalidateCache();
    await this.sendUserDeletedEvent(user);

    throw new HttpException('User deleted successfully!', HttpStatus.OK);
  }

  private async sendUserCreatedEvent(user: Users): Promise<void> {
    await this.kafkaProducer.produce('user-create', { value: JSON.stringify(user) });
  }

  private async sendUserUpdatedEvent(user: Users): Promise<void> {
    await this.kafkaProducer.produce('user-update', { value: JSON.stringify(user) });
  }

  private async sendUserDeletedEvent(user: Users): Promise<void> {
    await this.kafkaProducer.produce('user-delete', { value: JSON.stringify(user) });
  }
}
