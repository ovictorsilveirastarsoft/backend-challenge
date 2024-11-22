import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Users } from '@users/entity';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([Users])],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const user = new Users();
      user.email = 'test@example.com';
      user.password = 'password';

      const result = await service.create(user);
      expect(result).toBeDefined();
      expect(result.email).toBe(user.email);
      expect(result.password).not.toBe(user.password);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = await service.findAll(1,10);
      expect(users).toBeDefined();
      expect(users.length).toBeGreaterThan(0);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = new Users();
      user.id = 1;
      const result = await service.findOne(1);
      expect(result).toBeDefined();
      expect(result.id).toBe(user.id);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const user = new Users();
      user.id = 1;
      user.email = 'new@example.com';
      const result = await service.update(1, user);
      expect(result).toBeDefined();
      expect(result.email).toBe(user.email);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      await service.remove(1);
      const result = await service.findOne(1);
      expect(result).toBeUndefined();
    });
  });

  describe('sendUserUpdatedEvent', () => {
    it('should call the sendUserUpdatedEvent method', async () => {
      const user = new Users();
      user.id = 1;
      user.email = 'test@example.com';
      await (service as any).sendUserUpdatedEvent(user);
      // Verifique se o evento foi enviado corretamente
    });
  });
});