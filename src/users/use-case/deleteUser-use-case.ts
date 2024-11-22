import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "@users/entity";
import { UserCacheService } from "@users/user-cache.service";
import { ProducerService } from "kafka/producer.service";
import { Repository } from "typeorm";

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly userCacheService: UserCacheService,
    private readonly kafkaProducer: ProducerService,
  ) {}

  async execute(id: number): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    await this.usersRepository.delete(id);
    await this.userCacheService.invalidateCache();
    await this.kafkaProducer.produce('user-delete', { value: JSON.stringify(user) });

    throw new HttpException('User deleted successfully!', HttpStatus.OK);
  }
}
