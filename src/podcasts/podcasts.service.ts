import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

@Injectable()
export class PodcastsService {
  constructor(
    @InjectRepository(Podcast) private readonly podcasts: Repository<Podcast>,
    @InjectRepository(Episode) private readonly episodes: Repository<Episode>,
  ) {}

  getAllPodcasts(): Promise<Podcast[]> {
    return this.podcasts.find();
  }

  async createPodcast({
    title,
    category,
  }: CreatePodcastInput): Promise<CreatePodcastOutput> {
    try {
      const { id } = await this.podcasts.save(
        this.podcasts.create({
          title,
          category,
          rating: 0,
          episodes: [],
        }),
      );

      return { ok: true, id };
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

  async deletePodcast(id: number): Promise<DeletePodcastOutput> {
    try {
      const podcast = await this.podcasts.findOne({ id });
      if (!podcast) {
        return {
          ok: false,
          error: 'There is no podcast by the Id',
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

  async updatePodcast({
    podcastId,
    ...rest
  }: UpdatePodcastInput): Promise<UpdatePodcastOutput> {
    try {
      const podcast = await this.podcasts.findOne(podcastId);
      if (!podcast) {
        return {
          ok: false,
          error: 'There is no podcast by the Id',
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
          error: "You can't delete this episode",
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
}
