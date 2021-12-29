import { Injectable } from '@nestjs/common';
import { CreateEpisodeInput } from './dtos/createEpisode.dto';
import { DeleteEpisodeInput } from './dtos/deleteEpisode.dto';
import { EditEpisodeInput } from './dtos/editEpisode.dto';
import { EditPodcastInput } from './dtos/editPodcast.dto';
import { Podcast } from './entites/podcast.entity';

@Injectable()
export class PodcastsService {
  private podcasts: Podcast[] = [];

  getAllPodcasts(): Podcast[] {
    const podcasts = this.podcasts;
    return podcasts;
  }

  getOnePodcast(id): Podcast {
    return this.podcasts.find((podcast) => podcast.id === +id);
  }

  deletePodcast(id): Boolean {
    this.podcasts.filter((podcast) => podcast.id !== +id);
    return true;
  }

  createPodcast(podcastData) {
    this.podcasts.push({
      id: this.podcasts.length + 1,
      ...podcastData,
    });
  }

  editPodcast(editPodcastInput: EditPodcastInput) {
    const podcast = this.getOnePodcast(editPodcastInput.podcastId);
    this.deletePodcast(editPodcastInput.podcastId);
    this.podcasts.push({ ...podcast, ...editPodcastInput });
    return true;
  }

  getAllEpisodes(id) {
    const podcast = this.podcasts.find((podcast) => podcast.id === +id);
    if (!podcast) {
      return 'There is no episode by podcast Id';
    }
    return podcast.episode;
  }

  deleteEpisode({ podcastId, episodeId }: DeleteEpisodeInput): Boolean {
    const podcast = this.getOnePodcast(podcastId);
    podcast.episode.filter((episode) => episode.id !== episodeId);
    return true;
  }

  createEpisode(createEpisodeInput: CreateEpisodeInput) {
    const podcast = this.getOnePodcast(createEpisodeInput.podcastId);
    podcast.episode.push({
      id: podcast.episode.length + 1,
      ...createEpisodeInput,
    });
    return true;
  }

  editEpisode({ podcastId, episodeId, title }: EditEpisodeInput) {
    const podcast = this.getOnePodcast(podcastId);
    podcast.episode.filter((episode) => episode.id !== episodeId);
    podcast.episode.push(...podcast.episode, { id: episodeId, title });
    return true;
  }
}
