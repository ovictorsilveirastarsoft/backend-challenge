// src/users/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entity/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiBody({
    description: 'Dados do usuário',
    type: CreateUserDto,
    examples: {
      user: {
        value: {
          name: 'John Doe',
          email: 'johndoe@teste.com',
          password: '123teste',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Create a new user' }) // Descrição da operação
  @ApiResponse({
    status: 201,
    description: 'User created successfully.',
    type: User,
  }) // Resposta de sucesso
  @ApiResponse({ status: 400, description: 'Bad request.' }) // Resposta em caso de erro
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users.',
    type: User,
    isArray: true,
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'João Silva' },
          email: { type: 'string', example: 'joao.silva@example.com' },
          password: { type: 'string', example: 'senha-segura' },
        },
      },
    },
  })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User found.',
    type: User,
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        name: { type: 'string', example: 'João Silva' },
        email: { type: 'string', example: 'joao.silva@example.com' },
        password: { type: 'string', example: 'senha-segura' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findOne(@Param('id') id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully.',
    type: User,
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        name: { type: 'string', example: 'João Silva' },
        email: { type: 'string', example: 'joao.silva@example.com' },
        password: { type: 'string', example: 'nova-senha-segura' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({ status: 204, description: 'User deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  remove(@Param('id') id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}
