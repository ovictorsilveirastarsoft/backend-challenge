import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entity/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ClientKafka } from '@nestjs/microservices';
import { Cache } from 'cache-manager'; 
import   * as bcrypt from 'bcryptjs';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @Inject('KAFKA_SERVICE')
    private readonly kafkaService: ClientKafka,
    @Inject('CACHE_MANAGER') 
    private cacheManager: Cache, 
    
  ) {}

  private async create(createUserDto: CreateUserDto) {
    const {name, email, password} = createUserDto;
    
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('This email has already been registered.');
    }
    try {
      const user = this.usersRepository.create(createUserDto);

      const hashedPassword = await bcrypt.hash(password, 10);
      createUserDto.password = hashedPassword;

      user.password = hashedPassword;

      // Envia dados ao Kafka
      this.kafkaService.emit('user_created', {
        id: user.id,
        name: user.name,
        email: user.email,
      });
      await this.usersRepository.save(user);
      // Armazena o usuário no cache
     // this.cacheManager.set(`user_${user.id}`, user, 5); 

      return user;
    } catch (error) {
      throw new BadRequestException('Failed to create user.');
    }
  }
    addUser(createUserDto: CreateUserDto): Promise<Users> {
      return this.create(createUserDto);
    }
    
 

    private async findAll(page: number, limit: number): Promise<Users[]> {
      const users = await this.usersRepository.find({
        skip: this.calculateSkip(page, limit),
        take: limit,
      });
      this.ensureUsersExist(users);
  
      return users;
    }

    private calculateSkip(page: number, limit: number): number {
      return (page - 1) * limit;
    }
  
    private ensureUsersExist(users: Users[]): void {
      if (users.length === 0) {
        throw new NotFoundException('No registered users.');
      }
    }

    usersAll(page: number, limit: number): Promise<Users[]> {
      return this.findAll(page,limit);
    }

  private async findOne(id: number): Promise<Users> {

    const users = await this.usersRepository.findOne({ where: { id } });
    if (!users) {
      throw new NotFoundException('No registered users.');
    }

    // Tenta pegar o usuário do cache
    // const cachedUser = await this.cacheManager.get(`user_${id}`);
    // if (cachedUser) {
    //   console.log('Cache hit for user:', id);
    //   return cachedUser as Users; 
    // }

    // Se não estiver no cache, busca no banco de dados
    // console.log('Cache miss for user:', id);
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('No registered users');
    }
    // Armazena no cache
    //this.cacheManager.set(`user_${id}`, user, 3600); 

    return user;
  }

  findUser(id: number): Promise<Users> {
    return this.findOne(id);
  }


  private async update(id: number, updateUserDto: UpdateUserDto): Promise<Users> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User ID ${id} does not exist.`);
    }
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        10,
      );
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.usersRepository.save(user);

    this.kafkaService.emit('user_updated', {
      name: user.name,
      email: user.email,
      password: user.password,
    });

    // Atualiza o cache
    //this.cacheManager.set(`user_${updatedUser.id}`, updatedUser, 3600); 
    return updatedUser;
  }
  updateUser(id: number, updateUserDto: UpdateUserDto): Promise<Users> {
    return this.update(id, updateUserDto);
  }

  private async remove(id: number): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('No registered users.');
    }
    await this.usersRepository.delete(id);
    throw new HttpException('User deleted successfully!', HttpStatus.OK);
  
    // Remove o usuário do cache
  //  this.cacheManager.del(`user_${id}`);
  }

  removeUser(id: number): Promise<void> {
    return this.remove(id);
  }
}
