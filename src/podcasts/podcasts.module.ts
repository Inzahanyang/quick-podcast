import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Episode } from './entites/episode.entity';
import { Podcast } from './entites/podcast.entity';
import { EpisodeResolver, PodcastsResolver } from './podcasts.resolver';
import { PodcastsService } from './podcasts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Podcast, Episode])],
  providers: [PodcastsResolver, EpisodeResolver, PodcastsService],
})
export class PodcastsModule {}
