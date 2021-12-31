import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Episode } from './podcasts/entites/episode.entity';
import { Podcast } from './podcasts/entites/podcast.entity';
import { PodcastsModule } from './podcasts/podcasts.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      logging: true,
      synchronize: true,
      entities: [Podcast, Episode],
    }),
    PodcastsModule,
    CommonModule,
  ],
})
export class AppModule {}
