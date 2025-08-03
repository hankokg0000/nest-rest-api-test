import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class UserController {
    private readonly userService;
    private readonly authService;
    constructor(userService: UserService, authService: AuthService);
    findAll(username?: string, page?: number, limit?: number): {
        data: {
            id: number;
            username: string;
        }[];
        total: number;
        page: number;
        limit: number;
    };
    register(data: RegisterDto): Promise<{
        id: number;
        username: string;
    }>;
    login(data: LoginDto): Promise<{
        access_token: string;
    } | {
        message: string;
    }>;
}
