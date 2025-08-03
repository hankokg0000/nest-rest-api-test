"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcryptjs");
let UserService = class UserService {
    constructor() {
        this.users = [
            { id: 1, username: 'test', password: '$2a$10$wq6Qw1Qw1Qw1Qw1Qw1Qw1eQw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Q' },
        ];
    }
    findById(id) {
        return this.users.find(u => u.id === id);
    }
    findAll(options) {
        let users = this.users.map(({ password, ...rest }) => rest);
        if (options?.username) {
            users = users.filter(u => u.username.includes(options.username));
        }
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
    async create(data) {
        const exists = await this.findByUsername(data.username);
        if (exists) {
            throw new common_1.BadRequestException('Username already exists');
        }
        const hashed = await bcrypt.hash(data.password, 10);
        const user = { id: Date.now(), username: data.username, password: hashed };
        this.users.push(user);
        return { id: user.id, username: user.username };
    }
    async findByUsername(username) {
        return this.users.find(u => u.username === username);
    }
    async validateUser(username, password) {
        const user = await this.findByUsername(username);
        if (user && await bcrypt.compare(password, user.password)) {
            return { id: user.id, username: user.username };
        }
        return null;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)()
], UserService);
//# sourceMappingURL=user.service.js.map