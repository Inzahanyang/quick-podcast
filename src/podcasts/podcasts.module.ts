import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Episode } from './entites/episode.entity';
import { Podcast } from './entites/podcast.entity';
import { Review } from './entites/review.entity';
import {
  EpisodeResolver,
  PodcastsResolver,
  ReviewResolver,
} from './podcasts.resolver';
import { PodcastsService } from './podcasts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Podcast, Episode, Review]), UsersModule],
  providers: [
    PodcastsResolver,
    EpisodeResolver,
    ReviewResolver,
    PodcastsService,
  ],
})
export class PodcastsModule {}
