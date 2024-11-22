import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UpdateUserDto } from "@users/dto";
import { Users } from "@users/entity";
import { UserCacheService } from "@users/user-cache.service";
import { ProducerService } from "kafka/producer.service";
import { Repository } from "typeorm";
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from "@nestjs/typeorm";


@Injectable()
export class UpdateUserUseCase {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly userCacheService: UserCacheService,
    private readonly kafkaProducer: ProducerService,
  ) {}

  async execute(id: number, updateUserDto: UpdateUserDto): Promise<Users> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const emailTaken = await this.usersRepository.findOne({ where: { email: updateUserDto.email } });
      if (emailTaken) {
        throw new BadRequestException('This email is already registered.');
      }
    }

    if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }
  
      Object.assign(user, updateUserDto);
      const updatedUser = await this.usersRepository.save(user);
  
      await this.userCacheService.invalidateCache();
      await this.kafkaProducer.produce('user-update', { value: JSON.stringify(updatedUser) });
  
      return updatedUser;
    }
  }
  