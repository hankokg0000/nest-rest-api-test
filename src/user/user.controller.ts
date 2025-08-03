
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query('username') username?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.userService.findAll({ username, page: Number(page), limit: Number(limit) });
  }

  @Post('register')
  async register(@Body() data: RegisterDto) {
    return this.userService.create(data);
  }

  @Post('login')
  async login(@Body() data: LoginDto) {
    const user = await this.userService.validateUser(data.username, data.password);
    if (!user) {
      return { message: 'Invalid credentials' };
    }
    return this.authService.login(user);
  }
}
