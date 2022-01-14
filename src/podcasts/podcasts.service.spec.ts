import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Episode } from './entites/episode.entity';
import { Podcast } from './entites/podcast.entity';
import { PodcastsService } from './podcasts.service';

const mockRepository = () => ({
  find: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('podcastsService', () => {
  let service: PodcastsService;
  let podcastsRepository: MockRepository<Podcast>;
  let episodesRepository: MockRepository<Episode>;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PodcastsService,
        {
          provide: getRepositoryToken(Podcast),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Episode),
          useValue: mockRepository(),
        },
      ],
    }).compile();
    service = module.get<PodcastsService>(PodcastsService);
    podcastsRepository = module.get(getRepositoryToken(Podcast));
    episodesRepository = module.get(getRepositoryToken(Episode));
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllPodcasts', () => {
    const podcasts: Podcast[] = [];
    it('should get all podcasts', async () => {
      podcastsRepository.find.mockReturnValue(podcasts);
      const result = await service.getAllPodcasts();
      expect(result).toEqual([]);
    });
  });

  describe('createPodcast', () => {
    const podcastArgs = {
      title: '',
      category: '',
      rating: 0,
      episodes: [],
    };
    it('should create podcast', async () => {
      podcastsRepository.create.mockReturnValue(podcastArgs);
      podcastsRepository.save.mockReturnValue(podcastArgs);
      const result = await service.createPodcast(podcastArgs);
      expect(result).toEqual({ ok: true });
    });
    it('should fail on exception', async () => {
      podcastsRepository.save.mockRejectedValue(new Error());
      const result = await service.createPodcast(podcastArgs);
      expect(result).toEqual({ ok: false, error: "Couldn't create podcast" });
    });
  });

  describe('getPodcast', () => {
    const podcast = {
      id: 1,
    };

    it('should fail find podcast by Id', async () => {
      podcastsRepository.findOne.mockResolvedValue(undefined);
      const result = await service.getPodcast(podcast.id);
      expect(result).toEqual({
        ok: false,
        error: 'There is no podcast by the Id',
      });
    });

    it('should create podcast', async () => {
      podcastsRepository.findOne.mockReturnValue(podcast);
      const result = await service.getPodcast(podcast.id);
      expect(result).toEqual({ ok: true, podcast });
    });
    it('should fail on exception', async () => {
      podcastsRepository.findOne.mockRejectedValue(new Error());
      const result = await service.getPodcast(podcast.id);
      expect(result).toEqual({ ok: false, error: 'Could not find podcast' });
    });
  });

  describe('deletePodcast', () => {
    const podcast = {
      id: 1,
    };
    it('should fail find podcast by Id', async () => {
      podcastsRepository.findOne.mockResolvedValue(undefined);
      const result = await service.deletePodcast(podcast.id);
      expect(result).toEqual({
        ok: false,
        error: 'There is no podcast by the Id',
      });
    });

    it('should delete podcast by Id', async () => {
      podcastsRepository.findOne.mockResolvedValue(podcast);
      podcastsRepository.delete.mockResolvedValue(podcast);
      const result = await service.deletePodcast(podcast.id);
      expect(result).toEqual({ ok: true });
    });

    it('should fail on exception', async () => {
      podcastsRepository.findOne.mockRejectedValue(new Error());
      const result = await service.deletePodcast(podcast.id);
      expect(result).toEqual({ ok: false, error: 'Could not delete podcast' });
    });
  });

  describe('updatePodcast', () => {
    const podcast = {
      podcastId: 1,
      input: { title: 'update-title', category: 'update-category' },
    };

    it('should fail find podcast by Id', async () => {
      podcastsRepository.findOne.mockResolvedValue(undefined);
      const result = await service.updatePodcast(podcast);
      expect(result).toEqual({
        ok: false,
        error: 'There is no podcast by the Id',
      });
    });
    it('should save update args', async () => {
      podcastsRepository.findOne.mockResolvedValue(podcast);
      podcastsRepository.save.mockResolvedValue(podcast);
      const result = await service.updatePodcast(podcast);
      expect(result).toEqual({ ok: true });
    });
    it('should fail on exception', async () => {
      podcastsRepository.findOne.mockRejectedValue(new Error());
      const result = await service.updatePodcast(podcast);
      expect(result).toEqual({
        ok: false,
        error: 'Could not update the podcast',
      });
    });
  });

  describe('getAllEpisodes', () => {
    const podcast = {
      podcastId: 1,
    };

    const podcasts = {
      title: 'podcast_no1',
      category: 'fun',
      rating: 0,
      episodes: [{ title: 'ep1', category: 'fun' }],
    };

    it('should fail find podcast by Id', async () => {
      podcastsRepository.findOne.mockResolvedValue(undefined);
      const result = await service.getAllEpisodes(podcast);
      expect(result).toEqual({
        ok: false,
        error: "Can't find podcast by Id",
      });
    });
    it('should find all episodes', async () => {
      podcastsRepository.findOne.mockResolvedValue(podcasts);
      const result = await service.getAllEpisodes(podcast);
      expect(result).toEqual({
        ok: true,
        episodes: podcasts.episodes,
      });
    });
    it('should fail on exception', async () => {
      podcastsRepository.findOne.mockRejectedValue(new Error());
      const result = await service.getAllEpisodes(podcast);
      expect(result).toEqual({ ok: false, error: 'Could not get episodes' });
    });
  });

  describe('createEpisode', () => {
    const podcastArgs = {
      podcastId: 1,
      title: 'new_episode_01',
    };
    const createEpisode = {
      title: 'new_episode_01',
    };
    const newEpisode = {
      id: 1,
      title: 'new_episode_01',
      podcast: {
        id: 1,
        title: 'news',
        category: 'political',
        rating: 0,
      },
    };
    it('should fail find podcast by Id', async () => {
      podcastsRepository.findOne.mockResolvedValue(undefined);
      const result = await service.createEpisode(podcastArgs);
      expect(result).toEqual({
        ok: false,
        error: "Can't find podcast by Id",
      });
    });

    it('should create episode', async () => {
      podcastsRepository.findOne.mockResolvedValue(podcastArgs.podcastId);
      episodesRepository.create.mockReturnValue(createEpisode);
      episodesRepository.save.mockResolvedValue(newEpisode);

      const result = await service.createEpisode(podcastArgs);

      expect(podcastsRepository.findOne).toHaveBeenCalledTimes(1);
      expect(podcastsRepository.findOne).toHaveBeenCalledWith(
        podcastArgs.podcastId,
      );
      expect(episodesRepository.create).toHaveBeenCalledTimes(1);
      expect(episodesRepository.create).toHaveBeenCalledWith(
        expect.any(Object),
      );
      expect(episodesRepository.save).toHaveBeenCalledTimes(1);
      expect(episodesRepository.save).toHaveBeenCalledWith(expect.any(Object));
      expect(result).toEqual({ ok: true, id: 1 });
    });

    it('should fail on exception', async () => {
      podcastsRepository.findOne.mockRejectedValue(new Error());
      const result = await service.createEpisode(podcastArgs);
      expect(result).toEqual({ ok: false, error: 'Could not create episode' });
    });
  });

  describe('deleteEpisode', () => {
    const deleteEpisodeArgs = { podcastId: 1, episodeId: 1 };
    const wrongFindEpisode = {
      id: 1,
      title: 'find Episode',
      podcast: {
        id: 2,
      },
    };
    const findEpisode = {
      id: 1,
      title: 'find Episode',
      podcast: {
        id: 1,
      },
    };

    it('should fail find episode by Id', async () => {
      episodesRepository.findOne.mockResolvedValue(undefined);
      const result = await service.deleteEpisode(deleteEpisodeArgs);
      expect(result).toEqual({ ok: false, error: "Can't find podcast by Id" });
    });

    it('should fail wrong podcastId', async () => {
      episodesRepository.findOne.mockResolvedValue(wrongFindEpisode);
      const result = await service.deleteEpisode(deleteEpisodeArgs);
      expect(result).toEqual({
        ok: false,
        error: "You can't delete this episode",
      });
    });

    it('should delete episode by Id', async () => {
      episodesRepository.findOne.mockResolvedValue(deleteEpisodeArgs);
      episodesRepository.delete.mockResolvedValue(findEpisode.podcast.id);
      const result = await service.deleteEpisode(deleteEpisodeArgs);
      expect(result).toEqual({ ok: true });
    });

    it('should fail on exception', async () => {
      episodesRepository.findOne.mockRejectedValue(new Error());
      const result = await service.deleteEpisode(deleteEpisodeArgs);
      expect(result).toEqual({ ok: false, error: 'Could not delete episode' });
    });
  });

  describe('updateEpisode', () => {
    const updateEpisodeArgs = {
      podcastId: 1,
      episodeId: 1,
      title: 'wow episode',
    };
    const wrongFindEpisode = {
      id: 1,
      title: 'find Episode',
      podcast: {
        id: 2,
      },
    };
    it('should fail find episode', async () => {
      episodesRepository.findOne.mockResolvedValue(undefined);
      const result = await service.updateEpisode(updateEpisodeArgs);
      expect(result).toEqual({ ok: false, error: "Can't find podcast by Id" });
    });

    it('should fail wrong podcastId', async () => {
      episodesRepository.findOne.mockResolvedValue(wrongFindEpisode);
      const result = await service.updateEpisode(updateEpisodeArgs);
      expect(result).toEqual({
        ok: false,
        error: "You can't delete this episode",
      });
    });

    it('should save the episode', async () => {
      episodesRepository.findOne.mockResolvedValue(updateEpisodeArgs);
      const result = await service.updateEpisode(updateEpisodeArgs);
      expect(result).toEqual({ ok: true });
    });

    it('should fail on exception', async () => {
      episodesRepository.findOne.mockRejectedValue(new Error());
      const result = await service.updateEpisode(updateEpisodeArgs);
      expect(result).toEqual({ ok: false, error: 'Could not update episode' });
    });
  });
});
