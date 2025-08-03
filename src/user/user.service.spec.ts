import { UserService } from './user.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  it('should find all users (without password)', () => {
    const result = service.findAll();
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.data[0]).not.toHaveProperty('password');
  });

  it('should filter users by username', async () => {
    await service.create({ username: 'alice', password: '1234', email: 'alice@example.com' });
    const result = service.findAll({ username: 'ali' });
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.data[0].username).toContain('ali');
  });

  it('should paginate users', async () => {
    // Add more users for pagination
    for (let i = 0; i < 15; i++) {
      await service.create({ username: `user${i}`, password: '1234', email: `user${i}@example.com` });
    }
    const result = service.findAll({ page: 2, limit: 5 });
    expect(result.data.length).toBe(5);
    expect(result.page).toBe(2);
    expect(result.limit).toBe(5);
  });

  it('should find user by id', () => {
    const user = service.findById(1);
    expect(user).toBeDefined();
    expect(user?.username).toBe('test');
  });

  it('should find user by username', async () => {
    const user = await service.findByUsername('test');
    expect(user).toBeDefined();
    expect(user?.id).toBe(1);
  });

  it('should not create user with duplicate username', async () => {
    const dto: RegisterDto = { username: 'test', password: '1234', email: 'test@example.com' };
    await expect(service.create(dto)).rejects.toThrow('Username already exists');
  });

  it('should create user with unique username', async () => {
    const dto: RegisterDto = { username: 'unique', password: 'pass', email: 'unique@example.com' };
    const user = await service.create(dto);
    expect(user).toHaveProperty('id');
    expect(user.username).toBe('unique');
  });

  it('should validate user with correct password', async () => {
    const dto: RegisterDto = { username: 'valid', password: 'secret', email: 'valid@example.com' };
    await service.create(dto);
    const user = await service.validateUser('valid', 'secret');
    expect(user).toBeDefined();
    expect(user?.username).toBe('valid');
  });

  it('should not validate user with wrong password', async () => {
    const user = await service.validateUser('test', 'wrong');
    expect(user).toBeNull();
  });
});
