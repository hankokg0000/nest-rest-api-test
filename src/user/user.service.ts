import { Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class UserService {
  private users = [
    { id: 1, username: 'test', password: '$2a$10$wq6Qw1Qw1Qw1Qw1Qw1Qw1eQw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Q' }, // password: test123
  ];

  findById(id: number) {
    return this.users.find(u => u.id === id);
  }

  findAll(options?: { username?: string; page?: number; limit?: number }) {
    let users = this.users.map(({ password, ...rest }) => rest);

    // Filter by username if provided
    if (options?.username) {
      users = users.filter(u => u.username.includes(options.username));
    }

    // Pagination
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    const pagedUsers = users.slice(start, end);

    return {
      data: pagedUsers,
      total: users.length,
      page,
      limit,
    };
  }

  async create(data: RegisterDto) {
    // Check for duplicate username
    const exists = await this.findByUsername(data.username);
    if (exists) {
      throw new BadRequestException('Username already exists');
    }
    const hashed = await bcrypt.hash(data.password, 10);
    const user = { id: Date.now(), username: data.username, password: hashed };
    this.users.push(user);
    return { id: user.id, username: user.username };
  }

  async findByUsername(username: string) {
    return this.users.find(u => u.username === username);
  }

  async validateUser(username: string, password: string) {
    const user = await this.findByUsername(username);
    if (user && await bcrypt.compare(password, user.password)) {
      return { id: user.id, username: user.username };
    }
    return null;
  }
}