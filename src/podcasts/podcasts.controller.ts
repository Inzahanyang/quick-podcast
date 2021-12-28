import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Episode } from './entites/episode.entity';
import { Podcast } from './entites/podcast.entity';
import { PodcastsService } from './podcasts.service';

@Controller('podcasts')
export class PodcastsController {
  constructor(private readonly podcastsService: PodcastsService) {}

  @Get()
  getAllPodcasts(): Podcast[] {
    return this.podcastsService.getAllPodcasts();
  }

  @Get(':id')
  getOne(@Param('id') podcastId: string): Podcast {
    return this.podcastsService.getOnePodcast(podcastId);
  }

  @Delete(':id')
  deletePodcast() {
    return 'delete podcast by id';
  }

  @Post()
  createPodcast(@Body() podcastData) {
    return this.podcastsService.createPodcast(podcastData);
  }

  @Patch(':id')
  editPodcast(@Param('id') podcastId: string, @Body() updateData) {
    return this.podcastsService.editPodcast(podcastId, updateData);
  }

  @Get(':id/episodes')
  getAllEpisodes(@Param('id') id: string) {
    return this.podcastsService.getAllEpisodes(id);
  }

  @Delete(':id/episode/:episodeId')
  deleteEpisode(
    @Param('id') podcastId: string,
    @Param('episodeId') episodeId: string,
  ) {
    return this.podcastsService.deleteEpisode(podcastId, episodeId);
  }

  @Post(':id/epsodes')
  createEpisode(@Param('id') podcastId: string, @Body() episodeData: Episode) {
    return this.podcastsService.createEpisode(podcastId, episodeData);
  }

  @Patch(':id/episodes/:episodeId')
  editEpisode(
    @Param('id') podcastId: string,
    @Param('episodeId') episodeId: string,
    @Body() updateEpisodeData: Episode,
  ) {
    return this.podcastsService.editEpisode(
      podcastId,
      episodeId,
      updateEpisodeData,
    );
  }
}
