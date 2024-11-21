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
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entity/users.entity';
import { CacheInterceptor } from '@nestjs/cache-manager';

@UseInterceptors(CacheInterceptor)
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
          name: 'Cadastro Teste',
          email: 'cadastro@teste.com',
          password: 'Cadastro123#',
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
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createUser(@Body() createUserDto: CreateUserDto): Promise<Users> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all users.' })
  @ApiResponse({
    status: 200,
    description: 'List of users.',
    type: UpdateUserDto,
    isArray: true,
  })
  @ApiResponse({ status: 400, description: 'Invalid page or limit.' })
  async findAll(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
  ): Promise<Users[]> {
    if (page < 1 || limit < 1) {
      throw new BadRequestException('Page and limit must be greater than 0.');
    }
    return this.usersService.findAll(page, limit);
  }
  @Get(':id')
  @ApiOperation({ summary: 'User by ID.' })
  @ApiResponse({
    status: 200,
    description: 'User found.',
    type: CreateUserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getUserById(@Param('id', ParseIntPipe) id: number): Promise<Users> {
    return this.usersService.findOne(id);
  }


  @Patch(':id')
  @ApiOperation({ summary: 'Update a user.' })
  @ApiResponse({
    status: 200,
    description: 'Updated user.',
    type: UpdateUserDto,
  })
  @ApiBody({
    description: 'User update data.',
    type: UpdateUserDto,
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async usersUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Users> {
    return this.usersService.update(id, updateUserDto);
  }


  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID.' })
  @ApiResponse({ status: 204, description: 'User deleted.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}
