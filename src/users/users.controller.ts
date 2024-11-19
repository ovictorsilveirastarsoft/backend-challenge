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
    description: 'User Data.',
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
  @ApiOperation({ summary: 'Create new User.' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully.',
    type: CreateUserDto,
  })
  @ApiResponse({ status: 400, description: 'invalid data.' })
  async create(@Body() createUserDto: CreateUserDto): Promise<Users> {
    return this.usersService.addUser(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all users.' })
  @ApiResponse({
    status: 200,
    description: 'List of users.',
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
      throw new BadRequestException('Invalid page number or limit.');
    }
    const users = await this.usersService.usersAll(page, limit);
    if (!users || users.length === 0) {
      throw new NotFoundException('User not found.');
    }
    return users;
  }


  @Get(':id')
  @ApiOperation({ summary: 'User by ID.' })
  @ApiResponse({
    status: 200,
    description: 'User found.',
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
  @ApiResponse({ status: 404, description: 'User not found.' })
  findOne(@Param('id') id: number): Promise<Users> {
    return this.usersService.findUser(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'update a user.' })
  @ApiResponse({
    status: 200,
    description: 'Updated user.',
    type: UpdateUserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiBody({
    description: 'User update data.',
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
  @ApiResponse({ status: 404, description: 'User not found.' })
  update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Users> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete a user by ID.' })
  @ApiResponse({ status: 204, description: 'User deleted.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  remove(@Param('id') id: number): Promise<void> {
    return this.usersService.removeUser(id);
  }
}
