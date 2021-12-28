import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PodcastsController } from './podcasts/podcasts.controller';
import { PodcastsService } from './podcasts/podcasts.service';

@Module({
  imports: [],
  controllers: [PodcastsController, AppController],
  providers: [PodcastsService],
})
export class AppModule {}
