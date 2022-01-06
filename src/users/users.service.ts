import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { UserProfileOutput } from './dtos/user-profile.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const exist = await this.users.findOne({ email });
      if (exist) {
        return {
          ok: false,
          error: 'Email is already taken',
        };
      }
      await this.users.save(this.users.create({ email, password, role }));
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not create account',
      };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.users.findOne({ email });

      if (!user) {
        return {
          ok: false,
          error: 'Email is not exist',
        };
      }

      const passwordCorrect = await user.checkPassword(password);

      if (!passwordCorrect) {
        return {
          ok: false,
          error: 'Wrong password',
        };
      }

      const token = this.jwtService.sign(user.id);

      return {
        ok: true,
        token,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not login',
      };
    }
  }

  async findById(id: number): Promise<UserProfileOutput> {
    try {
      const user = await this.users.findOne({ id });
      if (!user) {
        return {
          ok: false,
          error: "Can't find user",
        };
      }
      return {
        ok: true,
        user,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not find User by Id',
      };
    }
  }

  async editProfile(
    id: number,
    { email, password }: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      const emailExist = await this.users.findOne({ email });
      if (emailExist) {
        return {
          ok: false,
          error: 'Email already taken',
        };
      }

      const user = await this.users.findOne(id);
      if (!user) {
        return {
          ok: false,
          error: 'User not found',
        };
      }
      if (email) {
        user.email = email;
      }
      if (password) {
        user.password = password;
      }

      await this.users.save(user);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not edit profile',
      };
    }
  }
}
