// src/users/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entity/users.entity';

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
  @ApiOperation({ summary: 'Crie um novo usuário' })
  @ApiResponse({
    status: 201,
    description: 'Usuario criado com sucesso.',
    type: CreateUserDto,
  })
  @ApiResponse({ status: 400, description: 'dados inválidos' })
  async create(@Body() createUserDto: CreateUserDto): Promise<Users> {
    return this.usersService.addUser(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({
    status: 200,
    description: 'Listagem de usuários.',
    type: UpdateUserDto,
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
  @Get()
  async findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<Users[]> {
    if (!page || !limit || page < 1 || limit < 1) {
      throw new BadRequestException('Numero de pagina ou limite invalido.');
    }
    const users = await this.usersService.usersAll(page, limit);
    if (!users || users.length === 0) {
      throw new NotFoundException('Usuario nao encontrado.');
    }
    return users;
  }


  @Get(':id')
  @ApiOperation({ summary: 'Usuario por ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado.',
    type: UpdateUserDto,
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
  @ApiResponse({ status: 404, description: 'Usuario nao encontrado' })
  findOne(@Param('id') id: number): Promise<Users> {
    return this.usersService.findUser(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'atualizar um usuário' })
  @ApiResponse({
    status: 200,
    description: 'Usuario atualizado.',
    type: UpdateUserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiBody({
    description: 'Dados de atualização do usuário',
    type: UpdateUserDto,
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'João Silva' },
        email: { type: 'string', example: 'joao.silva@example.com' },
        password: { type: 'string', example: 'nova-senha-segura' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Usuario nao encontrado' })
  update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Users> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'deletar um usuário por ID' })
  @ApiResponse({ status: 204, description: 'Usuario deletado.' })
  @ApiResponse({ status: 404, description: 'Usuario nao encontrado.' })
  remove(@Param('id') id: number): Promise<void> {
    return this.usersService.removeUser(id);
  }
}
