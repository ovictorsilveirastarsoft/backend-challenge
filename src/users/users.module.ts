import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Aqui está a importação correta
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
