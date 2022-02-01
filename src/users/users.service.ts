import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { Episode } from 'src/podcasts/entites/episode.entity';
import { Podcast } from 'src/podcasts/entites/podcast.entity';
import { Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { MarkEpisodeAsPlayedInput } from './dtos/mark-episode-played.dto';
import { ToggleSubscribeInput } from './dtos/subscribe.dto';
import { UserProfileOutput } from './dtos/user-profile.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Podcast) private readonly podcasts: Repository<Podcast>,
    @InjectRepository(Episode) private readonly episodes: Repository<Episode>,
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
      const user = await this.users.findOne(
        { email },
        { select: ['id', 'password'] },
      );

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
      const user = await this.users.findOne(id);
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

  async toggleSubscribe(user: User, { podcastId }: ToggleSubscribeInput) {
    try {
      const podcast = await this.podcasts.findOne({ id: podcastId });
      if (!podcast) {
        return {
          ok: false,
          error: 'There is no podcast by the Id',
        };
      }
      if (user.subscriptions.some((sub) => sub.id === podcast.id)) {
        user.subscriptions = user.subscriptions.filter(
          (sub) => sub.id !== podcast.id,
        );
      } else {
        user.subscriptions = [...user.subscriptions, podcast];
      }
      await this.users.save(user);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not toggle subscribe',
      };
    }
  }

  async markEpisodeAsPlayed(user: User, { id }: MarkEpisodeAsPlayedInput) {
    try {
      const episode = await this.episodes.findOne({ id });
      if (!episode) {
        return {
          ok: false,
          error: 'Episode not found',
        };
      }
      user.playedEpisodes = [...user.playedEpisodes, episode];
      await this.users.save(user);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not mark episode as played',
      };
    }
  }
}
