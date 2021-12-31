import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import {
  CreateEpisodeInput,
  CreateEpisodeOutput,
} from './dtos/createEpisode.dto';
import {
  CreatePodcastInput,
  CreatePodcastOutput,
} from './dtos/createPodcast.dto';
import {
  DeleteEpisodeInput,
  DeleteEpisodeOutput,
} from './dtos/deleteEpisode.dto';
import {
  DeletePodcastInput,
  DeletePodcastOutput,
} from './dtos/deletePodcast.dto';

import {
  UpdatePodcastInput,
  UpdatePodcastOutput,
} from './dtos/updatePodcast.dto';
import { EpisodesInput, EpisodesOutput } from './dtos/episodes.dto';
import { PodcastInput, PodcastOutput } from './dtos/podcast.dto';
import { Episode } from './entites/episode.entity';
import { Podcast } from './entites/podcast.entity';
import { PodcastsService } from './podcasts.service';
import {
  UpdateEpisodeInput,
  UpdateEpisodeOutput,
} from './dtos/updateEpisode.dto';

@Resolver((of) => Podcast)
export class PodcastsResolver {
  constructor(private readonly podcastsService: PodcastsService) {}

  @Query((returns) => [Podcast])
  getAllPodcasts() {
    return this.podcastsService.getAllPodcasts();
  }

  @Mutation((returns) => CreatePodcastOutput)
  createPodcast(
    @Args('input') createPodcastInput: CreatePodcastInput,
  ): Promise<CreatePodcastOutput> {
    return this.podcastsService.createPodcast(createPodcastInput);
  }

  @Query((returns) => PodcastOutput)
  getPodcast(
    @Args('input') podcastInput: PodcastInput,
  ): Promise<PodcastOutput> {
    return this.podcastsService.getPodcast(podcastInput.podcastId);
  }

  @Mutation((returns) => DeletePodcastOutput)
  deletePodcast(
    @Args('input') deletePodcastInput: DeletePodcastInput,
  ): Promise<DeletePodcastOutput> {
    return this.podcastsService.deletePodcast(deletePodcastInput.podcastId);
  }

  @Mutation((returns) => UpdatePodcastOutput)
  updatePodcast(
    @Args('input') updatePodcastInput: UpdatePodcastInput,
  ): Promise<UpdatePodcastOutput> {
    return this.podcastsService.updatePodcast(updatePodcastInput);
  }
}

@Resolver((returns) => Episode)
export class EpisodeResolver {
  constructor(private readonly podcastsService: PodcastsService) {}

  @Query((returns) => EpisodesOutput)
  getAllEpisodes(@Args('input') episodesInput: EpisodesInput) {
    return this.podcastsService.getAllEpisodes(episodesInput);
  }

  @Mutation((returns) => CreateEpisodeOutput)
  createEpisode(
    @Args('input') createEpisodeInput: CreateEpisodeInput,
  ): Promise<CreateEpisodeOutput> {
    return this.podcastsService.createEpisode(createEpisodeInput);
  }

  @Mutation((returns) => DeleteEpisodeOutput)
  deleteEpisode(
    @Args('input') deleteEpisodeInput: DeleteEpisodeInput,
  ): Promise<DeleteEpisodeOutput> {
    return this.podcastsService.deleteEpisode(deleteEpisodeInput);
  }

  @Mutation((returns) => UpdateEpisodeOutput)
  updateEpisode(
    @Args('input') updateEpisodeInput: UpdateEpisodeInput,
  ): Promise<UpdateEpisodeOutput> {
    return this.podcastsService.updateEpisode(updateEpisodeInput);
  }
}
