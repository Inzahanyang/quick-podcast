import { Resolver, Query, Args, Mutation, Subscription } from '@nestjs/graphql';
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
import { Role } from 'src/auth/role.decorator';
import { Inject, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  SearchPodcastInput,
  SearchPodcastOutput,
} from './dtos/searchPodcast.dto';
import { Review } from './entites/review.entity';
import {
  ReviewPodcastInput,
  ReviewPodcastOutput,
} from './dtos/reviewPodcast.dto';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { PubSub } from 'graphql-subscriptions';
import { NEW_PODCAST_SUBSCRIPTION, PUB_SUB } from 'src/common/common.constants';

@UseGuards(AuthGuard)
@Resolver((of) => Podcast)
export class PodcastsResolver {
  constructor(
    private readonly podcastsService: PodcastsService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Query((returns) => [Podcast])
  getAllPodcasts() {
    return this.podcastsService.getAllPodcasts();
  }

  @Mutation((returns) => CreatePodcastOutput)
  @Role(['Host'])
  createPodcast(
    @AuthUser() authUser: User,
    @Args('input') createPodcastInput: CreatePodcastInput,
  ): Promise<CreatePodcastOutput> {
    return this.podcastsService.createPodcast(authUser, createPodcastInput);
  }

  @Query((returns) => PodcastOutput)
  getPodcast(
    @Args('input') podcastInput: PodcastInput,
  ): Promise<PodcastOutput> {
    return this.podcastsService.getPodcast(podcastInput.podcastId);
  }

  @Mutation((returns) => DeletePodcastOutput)
  @Role(['Host'])
  deletePodcast(
    @AuthUser() authUser: User,
    @Args('input') deletePodcastInput: DeletePodcastInput,
  ): Promise<DeletePodcastOutput> {
    return this.podcastsService.deletePodcast(
      authUser,
      deletePodcastInput.podcastId,
    );
  }

  @Mutation((returns) => UpdatePodcastOutput)
  @Role(['Host'])
  updatePodcast(
    @AuthUser() authUser: User,
    @Args('input') updatePodcastInput: UpdatePodcastInput,
  ): Promise<UpdatePodcastOutput> {
    return this.podcastsService.updatePodcast(authUser, updatePodcastInput);
  }

  @Query((returns) => SearchPodcastOutput)
  searchPodcast(
    @Args('input') searchPodcastInput: SearchPodcastInput,
  ): Promise<SearchPodcastOutput> {
    return this.podcastsService.searchPodcasts(searchPodcastInput);
  }

  @Subscription((returns) => Podcast, {
    filter: (payload, variables) => {
      return payload.subscriptionPodcast.user.id === variables.input;
    },
    resolve: (payload) => payload.subscriptionPodcast,
  })
  @Role(['Listener'])
  subscriptionPodcast(@Args('input') podcastId: number) {
    return this.pubSub.asyncIterator(NEW_PODCAST_SUBSCRIPTION);
  }
}

@Resolver((of) => Episode)
export class EpisodeResolver {
  constructor(private readonly podcastsService: PodcastsService) {}

  @Query((returns) => EpisodesOutput)
  getAllEpisodes(@Args('input') episodesInput: EpisodesInput) {
    return this.podcastsService.getAllEpisodes(episodesInput);
  }

  @Mutation((returns) => CreateEpisodeOutput)
  @Role(['Host'])
  createEpisode(
    @Args('input') createEpisodeInput: CreateEpisodeInput,
  ): Promise<CreateEpisodeOutput> {
    return this.podcastsService.createEpisode(createEpisodeInput);
  }

  @Mutation((returns) => DeleteEpisodeOutput)
  @Role(['Host'])
  deleteEpisode(
    @Args('input') deleteEpisodeInput: DeleteEpisodeInput,
  ): Promise<DeleteEpisodeOutput> {
    return this.podcastsService.deleteEpisode(deleteEpisodeInput);
  }

  @Mutation((returns) => UpdateEpisodeOutput)
  @Role(['Host'])
  updateEpisode(
    @Args('input') updateEpisodeInput: UpdateEpisodeInput,
  ): Promise<UpdateEpisodeOutput> {
    return this.podcastsService.updateEpisode(updateEpisodeInput);
  }
}

@Resolver((of) => Review)
export class ReviewResolver {
  constructor(private readonly podcastsService: PodcastsService) {}

  @Mutation((returns) => ReviewPodcastOutput)
  reviewPodcast(
    @AuthUser() user: User,
    @Args('input') reviewPodcastInput: ReviewPodcastInput,
  ): Promise<ReviewPodcastOutput> {
    return this.podcastsService.reviewPodcast(user, reviewPodcastInput);
  }
}
