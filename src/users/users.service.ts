import {
  BadRequestException,
  Injectable,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entity/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @Inject('KAFKA_SERVICE')
    private readonly kafkaService: ClientKafka,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Users> {
    try {
      // Cria a instância do usuário
      const user = this.usersRepository.create(createUserDto);

      // Salva o usuário no banco de dados
      await this.usersRepository.save(user);

      // Envia uma mensagem ao Kafka com os dados do usuário criado
      await this.kafkaService.emit('user_created', {
        id: user.id,
        name: user.name,
        email: user.email,
      });

      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new BadRequestException('Failed to create user');
    }
  }

  async findAll(): Promise<Users[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<Users> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<Users> {
    // Verifica se o usuário existe
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Atualiza o usuário com os dados recebidos
    Object.assign(user, updateUserDto);

    // Salva o usuário atualizado
    const updatedUser = await this.usersRepository.save(user);

    // Envia uma mensagem ao Kafka com os dados do usuário atualizado
    await this.kafkaService.emit('user_updated', {
      name: user.name,
      email: user.email,
      password: user.password,
    });
    // Logando dados após a atualização
    console.log('Usuário atualizado:', updatedUser);

    return updatedUser;
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.delete(user.id);
  }
}
