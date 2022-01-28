import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
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
import { DeletePodcastOutput } from './dtos/deletePodcast.dto';
import {
  UpdatePodcastInput,
  UpdatePodcastOutput,
} from './dtos/updatePodcast.dto';
import { PodcastOutput } from './dtos/podcast.dto';
import { Episode } from './entites/episode.entity';
import { Podcast } from './entites/podcast.entity';
import { EpisodesInput, EpisodesOutput } from './dtos/episodes.dto';
import {
  UpdateEpisodeInput,
  UpdateEpisodeOutput,
} from './dtos/updateEpisode.dto';
import {
  SearchPodcastInput,
  SearchPodcastOutput,
} from './dtos/searchPodcast.dto';
import { User } from 'src/users/entities/user.entity';
import {
  ReviewPodcastInput,
  ReviewPodcastOutput,
} from './dtos/reviewPodcast.dto';
import { Review } from './entites/review.entity';
import { NEW_PODCAST_SUBSCRIPTION, PUB_SUB } from 'src/common/common.constants';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class PodcastsService {
  constructor(
    @InjectRepository(Podcast) private readonly podcasts: Repository<Podcast>,
    @InjectRepository(Episode) private readonly episodes: Repository<Episode>,
    @InjectRepository(Review) private readonly reviews: Repository<Review>,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  getAllPodcasts(): Promise<Podcast[]> {
    return this.podcasts.find();
  }

  async createPodcast(
    user: User,
    { title, category }: CreatePodcastInput,
  ): Promise<CreatePodcastOutput> {
    try {
      const podcast = await this.podcasts.save(
        this.podcasts.create({
          title,
          category,
          rating: 0,
          episodes: [],
          user,
        }),
      );

      await this.pubSub.publish(NEW_PODCAST_SUBSCRIPTION, {
        subscriptionPodcast: podcast,
      });

      return { ok: true, id: podcast.id };
    } catch {
      return {
        ok: false,
        error: "Couldn't create podcast",
      };
    }
  }

  async getPodcast(id: number): Promise<PodcastOutput> {
    try {
      const podcast = await this.podcasts.findOne({ id });
      if (!podcast) {
        return {
          ok: false,
          error: 'There is no podcast by the Id',
        };
      }

      return {
        ok: true,
        podcast,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not find podcast',
      };
    }
  }

  async deletePodcast(
    authUser: User,
    id: number,
  ): Promise<DeletePodcastOutput> {
    try {
      const podcast = await this.podcasts.findOne({ id });
      if (!podcast) {
        return {
          ok: false,
          error: 'There is no podcast by the Id',
        };
      }

      if (podcast.user.id !== authUser.id) {
        return {
          ok: false,
          error: "You Can't delete",
        };
      }

      this.podcasts.delete({ id });

      return { ok: true };
    } catch {
      return {
        ok: false,
        error: 'Could not delete podcast',
      };
    }
  }

  async updatePodcast(
    authUser: User,
    { podcastId, ...rest }: UpdatePodcastInput,
  ): Promise<UpdatePodcastOutput> {
    try {
      const podcast = await this.podcasts.findOne(podcastId);
      if (!podcast) {
        return {
          ok: false,
          error: 'There is no podcast by the Id',
        };
      }

      if (podcast.user.id !== authUser.id) {
        return {
          ok: false,
          error: "You Can't delete",
        };
      }

      await this.podcasts.save([
        {
          id: podcastId,
          ...podcast,
          ...rest,
        },
      ]);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not update the podcast',
      };
    }
  }

  async searchPodcasts({
    query,
  }: SearchPodcastInput): Promise<SearchPodcastOutput> {
    try {
      const podcasts = await this.podcasts.find({
        where: {
          title: Raw((title) => `${title} LIKE '%${query}%'`),
        },
      });

      if (!podcasts) {
        return {
          ok: false,
          error: 'There is no podcast that title',
        };
      }
      return {
        ok: true,
        podcasts,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not search podcast',
      };
    }
  }

  async getAllEpisodes({ podcastId }: EpisodesInput): Promise<EpisodesOutput> {
    try {
      const podcast = await this.podcasts.findOne(
        { id: podcastId },
        { relations: ['episodes'] },
      );
      if (!podcast) {
        return {
          ok: false,
          error: "Can't find podcast by Id",
        };
      }

      return {
        ok: true,
        episodes: podcast.episodes,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not get episodes',
      };
    }
  }

  async createEpisode({
    podcastId,
    title,
  }: CreateEpisodeInput): Promise<CreateEpisodeOutput> {
    try {
      const podcast = await this.podcasts.findOne(podcastId);
      if (!podcast) {
        return {
          ok: false,
          error: "Can't find podcast by Id",
        };
      }

      const newEpisode = this.episodes.create({ title });

      newEpisode.podcast = podcast;

      const { id } = await this.episodes.save(newEpisode);

      return {
        ok: true,
        id,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not create episode',
      };
    }
  }

  async deleteEpisode({
    podcastId,
    episodeId,
  }: DeleteEpisodeInput): Promise<DeleteEpisodeOutput> {
    try {
      const episode = await this.episodes.findOne(episodeId);

      if (!episode) {
        return {
          ok: false,
          error: "Can't find podcast by Id",
        };
      }

      if (episode.podcastId !== podcastId) {
        return {
          ok: false,
          error: "You can't delete this episode",
        };
      }

      await this.episodes.delete({ id: episodeId });
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not delete episode',
      };
    }
  }

  async updateEpisode({
    podcastId,
    episodeId,
    ...rest
  }: UpdateEpisodeInput): Promise<UpdateEpisodeOutput> {
    try {
      const episode = await this.episodes.findOne({ id: episodeId });
      if (!episode) {
        return {
          ok: false,
          error: "Can't find podcast by Id",
        };
      }

      if (episode.podcastId !== podcastId) {
        return {
          ok: false,
          error: "You can't update this episode",
        };
      }

      await this.episodes.save([
        {
          id: episodeId,
          ...rest,
        },
      ]);

      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not update episode',
      };
    }
  }

  async reviewPodcast(
    user: User,
    { review, podcastId }: ReviewPodcastInput,
  ): Promise<ReviewPodcastOutput> {
    try {
      const podcast = await this.podcasts.findOne(podcastId);
      if (!podcast) {
        return {
          ok: false,
          error: 'Podcast not found',
        };
      }

      const reviewData = await this.reviews.save(
        this.reviews.create({
          review,
          podcast,
          user,
        }),
      );

      return {
        ok: true,
        review: reviewData,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not review to podcast',
      };
    }
  }
}
