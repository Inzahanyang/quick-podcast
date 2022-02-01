import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Episode } from 'src/podcasts/entites/episode.entity';
import { Podcast } from 'src/podcasts/entites/podcast.entity';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Podcast, Episode])],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
