import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entity/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ClientKafka } from '@nestjs/microservices';
import { Cache } from 'cache-manager'; 


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

  private async create(createUserDto: CreateUserDto): Promise<Users> {
    try {
      const user = this.usersRepository.create(createUserDto);
      await this.usersRepository.save(user);

      // Envia dados ao Kafka
      this.kafkaService.emit('user_created', {
        id: user.id,
        name: user.name,
        email: user.email,
      });

      // Armazena o usuário no cache
     // this.cacheManager.set(`user_${user.id}`, user, 5); 

      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new BadRequestException('Failed to create user');
    }
  }
    addUser(createUserDto: CreateUserDto): Promise<Users> {
      return this.create(createUserDto);
    }
  private async findAll(): Promise<Users[]> {
    return this.usersRepository.find();
  }
   usersAll(): Promise<Users[]> {
    return this.findAll();
   }

  private async findOne(id: number): Promise<Users> {
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
      throw new NotFoundException('User not found');
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
      throw new NotFoundException(`User with ID ${id} not found`);
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
    const user = await this.findOne(id);
    this.usersRepository.delete(user.id);

    // Remove o usuário do cache
  //  this.cacheManager.del(`user_${id}`);
  }

  removeUser(id: number): Promise<void> {
    return this.remove(id);
  }
}
