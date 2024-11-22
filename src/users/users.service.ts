import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from '@users/dto';
import { Users } from '@users/entity';
import { UserCacheService } from '@users/user-cache.service';
import{ CreateUserUseCase, UpdateUserUseCase, DeleteUserUseCase } from './use-case';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly userCacheService: UserCacheService,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Users> {
    return this.createUserUseCase.execute(createUserDto);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<Users[]> {
    return this.listAllUsers(page, limit);
  }

  async findOne(id: number): Promise<Users> {
    return this.getUserById(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<Users> {
    return this.updateUserUseCase.execute(id, updateUserDto);
  }

  async remove(id: number): Promise<void> {
    return this.deleteUserUseCase.execute(id);
  }

  private async listAllUsers(page: number = 1, limit: number = 10): Promise<Users[]> {
    const skip = (page - 1) * limit;
    const cacheKey = `users_page_${page}_limit_${limit}`;

    const cacheVersion = await this.userCacheService.getCacheVersion();
    const cachedData = await this.userCacheService.getCachedData<Users[]>(cacheKey, cacheVersion);
    if (cachedData) {
      return cachedData;
    }

    const users = await this.usersRepository.find({ skip, take: limit });
    if (users.length === 0) {
      throw new NotFoundException('No registered users.');
    }

    await this.userCacheService.setCache(cacheKey, cacheVersion, users);
    return users;
  }

  private async getUserById(id: number): Promise<Users> {
    const cacheKey = `user:${id}`;
    const cacheVersion = await this.userCacheService.getCacheVersion();

    const cachedUser = await this.userCacheService.getCachedData<Users>(cacheKey, cacheVersion);
    if (cachedUser) {
      return cachedUser;
    }

    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    await this.userCacheService.setCache(cacheKey, cacheVersion, user);
    return user;
  }
}
