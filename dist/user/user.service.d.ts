import { RegisterDto } from './dto/register.dto';
export declare class UserService {
    private users;
    findById(id: number): {
        id: number;
        username: string;
        password: string;
    };
    findAll(options?: {
        username?: string;
        page?: number;
        limit?: number;
    }): {
        data: {
            id: number;
            username: string;
        }[];
        total: number;
        page: number;
        limit: number;
    };
    create(data: RegisterDto): Promise<{
        id: number;
        username: string;
    }>;
    findByUsername(username: string): Promise<{
        id: number;
        username: string;
        password: string;
    }>;
    validateUser(username: string, password: string): Promise<{
        id: number;
        username: string;
    }>;
}
