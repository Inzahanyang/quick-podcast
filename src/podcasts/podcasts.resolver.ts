import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { CreateEpisodeInput } from './dtos/createEpisode.dto';
import { CreatePodcastInput } from './dtos/createPodcast.dto';
import { DeleteEpisodeInput } from './dtos/deleteEpisode.dto';
import { DeletePodcastInput } from './dtos/deletePodcast.dto';
import { EditEpisodeInput } from './dtos/editEpisode.dto';
import { EditPodcastInput } from './dtos/editPodcast.dto';
import { EpisodesInput, EpisodesOutput } from './dtos/episodes.dto';
import { PodcastInput, PodcastOutput } from './dtos/podcast.dto';
import { Podcast } from './entites/podcast.entity';
import { PodcastsService } from './podcasts.service';

@Resolver((of) => Podcast)
export class PodcastsResolver {
  constructor(private readonly podcastsService: PodcastsService) {}

  @Query((returns) => [Podcast])
  getAllPodcasts() {
    return this.podcastsService.getAllPodcasts();
  }

  @Query((returns) => PodcastOutput)
  getOnePodcast(@Args('input') podcastInput: PodcastInput) {
    return this.podcastsService.getOnePodcast(podcastInput);
  }

  @Mutation((returns) => Boolean)
  deletePodcast(@Args('input') deletePodcastInput: DeletePodcastInput) {
    return this.podcastsService.deletePodcast(deletePodcastInput);
  }

  @Mutation((returns) => Boolean)
  createPodcast(@Args('input') createPodcastInput: CreatePodcastInput) {
    return this.podcastsService.createPodcast(createPodcastInput);
  }

  @Mutation((returns) => Boolean)
  editPodcast(@Args('input') editPodcastInput: EditPodcastInput) {
    return this.podcastsService.editPodcast(editPodcastInput);
  }

  @Query((returns) => EpisodesOutput)
  getAllEpisodes(@Args('input') episodesInput: EpisodesInput) {
    return this.podcastsService.getAllEpisodes(episodesInput);
  }

  @Mutation((returns) => Boolean)
  deleteEpisode(@Args('input') deleteEpisodeInput: DeleteEpisodeInput) {
    return this.podcastsService.deleteEpisode(deleteEpisodeInput);
  }

  @Mutation((returns) => Boolean)
  createEpisode(@Args('input') createEpisodeInput: CreateEpisodeInput) {
    return this.podcastsService.createEpisode(createEpisodeInput);
  }

  @Mutation((returns) => Boolean)
  editEpisode(@Args('input') editEpisodeInput: EditEpisodeInput) {
    return this.podcastsService.editEpisode(editEpisodeInput);
  }
}
