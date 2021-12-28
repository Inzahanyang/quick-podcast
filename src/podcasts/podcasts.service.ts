import { Injectable } from '@nestjs/common';
import { Episode } from './entites/episode.entity';
import { Podcast } from './entites/podcast.entity';

@Injectable()
export class PodcastsService {
  private podcasts: Podcast[] = [];

  getAllPodcasts(): Podcast[] {
    return this.podcasts;
  }

  getOnePodcast(id: string): Podcast {
    return this.podcasts.find((podcast) => podcast.id === +id);
  }

  deletePodcast(id: string): Boolean {
    this.podcasts.filter((podcast) => podcast.id !== +id);
    return true;
  }

  createPodcast(podcastData: Podcast) {
    this.podcasts.push({
      id: this.podcasts.length + 1,
      ...podcastData,
    });
  }

  editPodcast(id: string, updateData: Podcast) {
    const podcast = this.getOnePodcast(id);
    this.deletePodcast(id);
    this.podcasts.push({ ...podcast, ...updateData });
  }

  getAllEpisodes(id: string) {
    const podcast = this.podcasts.find((podcast) => podcast.id === +id);
    if (!podcast) {
      return 'There is no episode by podcast Id';
    }
    return podcast.episode;
  }

  deleteEpisode(podcastId, episodeId): Boolean {
    const podcast = this.getOnePodcast(podcastId);
    podcast.episode.filter((episode) => episode.id !== episodeId);
    return true;
  }

  createEpisode(podcastId: string, episodeData: Episode) {
    const podcast = this.getOnePodcast(podcastId);
    podcast.episode.push({
      id: podcast.episode.length + 1,
      ...episodeData,
    });
  }

  editEpisode(podcastId, episodeId, updateEpisodeData) {
    const podcast = this.getOnePodcast(podcastId);
    const ok = this.deleteEpisode(podcastId, episodeId);
    if (ok) {
      podcast.episode.push({ ...podcast.episode, ...updateEpisodeData });
    }
  }
}
