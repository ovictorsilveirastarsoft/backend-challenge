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
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
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
  })
  @ApiResponse({ status: 400, description: 'Invalid page or limit.' })
  async findAll(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
  ): Promise<Users[]> {
    if (page < 1 || limit < 1) {
      throw new BadRequestException('Page and limit must be greater than 0.');
    }
    return this.usersService.usersAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'User by ID.' })
  @ApiResponse({
    status: 200,
    description: 'User found.',
    type: Users,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Users> {
    return this.usersService.findUser(id);
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
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Users> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID.' })
  @ApiResponse({ status: 204, description: 'User deleted.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.removeUser(id);
  }
}
