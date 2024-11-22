import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateUserDto } from '@users/dto';
import { Users } from '@users/entity';
import { ProducerService } from 'kafka/producer.service';
import { UserCacheService } from '@users/user-cache.service';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly userCacheService: UserCacheService,
    private readonly kafkaProducer: ProducerService,
  ) {}

  async execute(createUserDto: CreateUserDto): Promise<Users> {
    const { email, password } = createUserDto;

    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('This email is already registered.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    await this.usersRepository.save(user);
    await this.userCacheService.invalidateCache();
    await this.kafkaProducer.produce('user-create', { value: JSON.stringify(user) });

    return user;
  }
}