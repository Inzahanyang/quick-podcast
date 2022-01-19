import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getConnection, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Podcast } from 'src/podcasts/entites/podcast.entity';

const GRAPHQL_ENDPOINT = '/graphql';

const testUser = {
  email: 'ywguys@test.com',
  password: '12345',
};

const createPodcast = {
  id: 1,
  title: 'newPodcast',
  category: 'newCategory',
};

const updatePodcast = {
  title: 'update podcast',
  category: 'update category',
};

const createEpisode = {
  id: 1,
  title: 'create episode no.1',
};

const updateEpisode = {
  title: 'update episode no.1',
};

describe('App (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let podcastRepository: Repository<Podcast>;
  let jwtToken: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    podcastRepository = module.get<Repository<Podcast>>(
      getRepositoryToken(Podcast),
    );
    await app.init();
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    app.close();
  });

  const gr = (query: string) =>
    request(app.getHttpServer()).post(GRAPHQL_ENDPOINT).send({ query });

  describe('Podcasts Resolver', () => {
    describe('createPodcast', () => {
      it('should create podcast', () => {
        return gr(`
        mutation {
          createPodcast(input:{
            title:"${createPodcast.title}"
            category:"${createPodcast.category}"
          }) {
            ok
            error
          }
        }
      `)
          .expect(200)
          .expect((res) => {
            const { ok, error } = res.body.data.createPodcast;
            expect(ok).toBe(true);
            expect(error).toBe(null);
          });
      });

      it('should fail create podcast', () => {
        return gr(`
        mutation {
          createPodcast(input:{
            title:"${createPodcast.title}"
          }) {
            ok
            error
          }
        }
      `)
          .expect(400)
          .expect((res) => {
            const { errors } = res.body;
            const [error] = errors;
            expect(error.message).toBe(
              'Field "CreatePodcastInput.category" of required type "String!" was not provided.',
            );
          });
      });
    });

    describe('getAllPocasts', () => {
      it('should get all podcasts', () => {
        return gr(`
        {
          getAllPodcasts {
            id
            title
            category
          }
        }
        `)
          .expect(200)
          .expect((res) => {
            const { getAllPodcasts } = res.body.data;
            const [podcast] = getAllPodcasts;
            expect(getAllPodcasts).toEqual(expect.any(Array));
            expect(podcast.id).toBe(createPodcast.id);
            expect(podcast.title).toBe(createPodcast.title);
            expect(podcast.category).toBe(createPodcast.category);
          });
      });
    });

    describe('getPodcast', () => {
      let podcastId: number;
      beforeAll(async () => {
        const [podcast] = await podcastRepository.find();
        podcastId = podcast.id;
      });
      it('should get podcast by Id', () => {
        return gr(`
          {
            getPodcast(input:{
              podcastId:${podcastId}
            }) {
              ok
              error
              podcast {
                id
                title
                category
              }
            }
          }
        `)
          .expect(200)
          .expect((res) => {
            const { ok, error, podcast } = res.body.data.getPodcast;
            expect(ok).toBe(true);
            expect(error).toBe(null);
            expect(podcast.id).toBe(createPodcast.id);
            expect(podcast.title).toBe(createPodcast.title);
            expect(podcast.category).toBe(createPodcast.category);
          });
      });
      it('should not get podcast by wrong Id', () => {
        return gr(`
          {
            getPodcast(input:{
              podcastId:2
            }) {
              ok
              error
              podcast {
                id
                title
                category
              }
            }
          }
        `)
          .expect(200)
          .expect((res) => {
            const { ok, error } = res.body.data.getPodcast;
            expect(ok).toBe(false);
            expect(error).toBe('There is no podcast by the Id');
          });
      });
    });

    describe('updatePodcast', () => {
      it('should update podcast by Id', () => {
        return gr(`mutation {
          updatePodcast(input:{
            podcastId:1
            title:"${updatePodcast.title}"
          }) {
            ok
            error
          }
        }`)
          .expect(200)
          .expect((res) => {
            const { ok, error } = res.body.data.updatePodcast;
            expect(ok).toBe(true);
            expect(error).toBe(null);
          });
      });

      it('should not update podcast by wrong Id', () => {
        return gr(`mutation {
          updatePodcast(input:{
            podcastId:2
            title:"${updatePodcast.title}"
          }) {
            ok
            error
          }
        }`)
          .expect(200)
          .expect((res) => {
            const { ok, error } = res.body.data.updatePodcast;
            expect(ok).toBe(false);
            expect(error).toBe('There is no podcast by the Id');
          });
      });
    });

    describe('createEpisode', () => {
      it('should create episode by podcast Id', () => {
        return gr(`mutation {
          createEpisode(input:{
            podcastId:${createPodcast.id}
            title:"${createEpisode.title}"
          }) {
            ok
            error
            id
          }
        }`)
          .expect(200)
          .expect((res) => {
            const { ok, error, id } = res.body.data.createEpisode;
            expect(ok).toBe(true);
            expect(error).toBe(null);
            expect(id).toBe(createEpisode.id);
          });
      });

      it('should not create episode by wrong podcast Id', () => {
        return gr(`mutation {
          createEpisode(input:{
            podcastId:2
            title:"${createEpisode.title}"
          }) {
            ok
            error
          }
        }`)
          .expect(200)
          .expect((res) => {
            const { ok, error } = res.body.data.createEpisode;
            expect(ok).toBe(false);
            expect(error).toBe("Can't find podcast by Id");
          });
      });
    });

    describe('getAllEpisodes', () => {
      it('should get all Episodes', () => {
        return gr(`{
          getAllEpisodes(input:{
            podcastId:${createPodcast.id}
          }) {
            ok
            error
            episodes {
              id
              title
            }
          }
        }`)
          .expect(200)
          .expect((res) => {
            const { ok, error, episodes } = res.body.data.getAllEpisodes;
            const [episode] = episodes;
            expect(ok).toBe(true);
            expect(error).toBe(null);
            expect(episode.id).toBe(createEpisode.id);
            expect(episode.title).toBe(createEpisode.title);
          });
      });
    });

    describe('updateEpisode', () => {
      it('should update episode by Id', () => {
        return gr(`mutation {
          updateEpisode(input: {
            podcastId:${createPodcast.id}
            episodeId:${createEpisode.id}
            title:"${updateEpisode.title}"
          }) {
            ok
            error
          }
        }`)
          .expect(200)
          .expect((res) => {
            const { ok, error } = res.body.data.updateEpisode;
            expect(ok).toBe(true);
            expect(error).toBe(null);
          });
      });

      it('should not update episode by own Id', () => {
        return gr(`mutation {
          updateEpisode(input: {
            podcastId:2
            episodeId:${createEpisode.id}
            title:"${updateEpisode.title}"
          }) {
            ok
            error
          }
        }`)
          .expect(200)
          .expect((res) => {
            const { ok, error } = res.body.data.updateEpisode;
            expect(ok).toBe(false);
            expect(error).toBe("You can't update this episode");
          });
      });
    });

    describe('deleteEpisode', () => {
      it('should not delete episode by own Id', () => {
        return gr(`mutation {
          deleteEpisode(input:{
            podcastId:2
            episodeId:${createEpisode.id}
          }) {
            ok
            error
          }
        }`)
          .expect(200)
          .expect((res) => {
            const { ok, error } = res.body.data.deleteEpisode;
            expect(ok).toBe(false);
            expect(error).toBe("You can't delete this episode");
          });
      });

      it('should delete episode by Id', () => {
        return gr(`mutation {
          deleteEpisode(input:{
            podcastId:${createPodcast.id}
            episodeId:${createEpisode.id}
          }) {
            ok
            error
          }
        }`)
          .expect(200)
          .expect((res) => {
            const { ok, error } = res.body.data.deleteEpisode;
            expect(ok).toBe(true);
            expect(error).toBe(null);
          });
      });
    });

    describe('deletePodcast', () => {
      let podcastId: number;
      beforeAll(async () => {
        const [podcast] = await podcastRepository.find();
        podcastId = podcast.id;
      });
      it('should delete podcast by Id', () => {
        return gr(`
          mutation {
            deletePodcast(input:{
              podcastId:${podcastId}
            }) {
              ok
              error
            }
          }
        `)
          .expect(200)
          .expect((res) => {
            const { ok, error } = res.body.data.deletePodcast;
            expect(ok).toBe(true);
            expect(error).toBe(null);
          });
      });

      it('should not delete podcast by wrong Id', () => {
        return gr(`
          mutation {
            deletePodcast(input:{
              podcastId:2
            }) {
              ok
              error
            }
          }
        `)
          .expect(200)
          .expect((res) => {
            const { ok, error } = res.body.data.deletePodcast;
            expect(ok).toBe(false);
            expect(error).toBe('There is no podcast by the Id');
          });
      });
    });
  });

  describe('Users Resolver', () => {
    describe('createAccount', () => {
      it('should create account', () => {
        return gr(`
        mutation {
          createAccount(input: {
            email:"${testUser.email}",
            password:"${testUser.password}",
            role:Host
          }) {
            ok
            error
          }
        }
      `)
          .expect(200)
          .expect((res) => {
            expect(res.body.data.createAccount.ok).toBe(true);
            expect(res.body.data.createAccount.error).toBe(null);
          });
      });

      it('should fail if account already exist', () => {
        return gr(`
        mutation {
          createAccount(input: {
            email:"${testUser.email}",
            password:"${testUser.password}",
            role:Host
          }) {
            ok
            error
          }
        }
      `)
          .expect(200)
          .expect((res) => {
            expect(res.body.data.createAccount.ok).toBe(false);
            expect(res.body.data.createAccount.error).toBe(
              'Email is already taken',
            );
          });
      });
    });

    describe('login', () => {
      it('should login with correct credentials', () => {
        return gr(`
          mutation {
            login(input: {
              email:"${testUser.email}",
              password:"${testUser.password}"
            }) {
              ok
              error
              token
            }
          }
        `)
          .expect(200)
          .expect((res) => {
            const { ok, error, token } = res.body.data.login;
            expect(ok).toBe(true);
            expect(error).toBe(null);
            expect(token).toEqual(expect.any(String));
            jwtToken = token;
          });
      });
      it('should not be able to login with wrong credentials', () => {
        return gr(`
          mutation {
            login(input: {
              email:"${testUser.email}",
              password:"wrongpassword",
            }) {
              ok
              error
            }
          }
        `)
          .expect(200)
          .expect((res) => {
            const { ok, error, token } = res.body.data.login;
            expect(ok).toBe(false);
            expect(error).toBe('Wrong password');
            expect(token).toBe(undefined);
          });
      });
    });

    describe('userProfile', () => {
      let userId: number;
      beforeAll(async () => {
        const [user] = await userRepository.find();
        userId = user.id;
      });
      it('should see a users profile', () => {
        return request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .set('x-jwt', jwtToken)
          .send({
            query: `
          {
            userProfile(input: {
              userId:${userId}
            }) {
              ok
              error
              user {
                id
              }
            }
          }
          `,
          })
          .expect(200)
          .expect((res) => {
            const {
              ok,
              error,
              user: { id },
            } = res.body.data.userProfile;
            expect(ok).toBe(true);
            expect(error).toBe(null);
            expect(id).toBe(userId);
          });
      });
      it('should not find a profile', () => {
        return request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .set('x-jwt', jwtToken)
          .send({
            query: `
          {
            userProfile(input: {
              userId:1234
            }) {
              ok
              error
              user {
                id
              }
            }
          }
          `,
          })
          .expect(200)
          .expect((res) => {
            const { ok, error, user } = res.body.data.userProfile;
            expect(ok).toBe(false);
            expect(error).toBe("Can't find user");
            expect(user).toBe(null);
          });
      });
    });

    describe('me', () => {
      it('shoud find my profile', () => {
        return request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .set('x-jwt', jwtToken)
          .send({
            query: `
            {
              me {
                email
              }
            }
          `,
          })
          .expect(200)
          .expect((res) => {
            const { email } = res.body.data.me;
            expect(email).toBe(testUser.email);
          });
      });
      it('shoud not allow logged out user', () => {
        return request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .send({
            query: `
            {
              me {
                email
              }
            }
          `,
          })
          .expect(200)
          .expect((res) => {
            const { errors } = res.body;
            const [error] = errors;
            expect(error.message).toBe('Forbidden resource');
          });
      });
    });

    describe('editProfile', () => {
      const NEW_EMAIL = 'new@email.com';
      const NEW_PASSWORD = 'newpassword';
      it('should change email', () => {
        return request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .set('x-jwt', jwtToken)
          .send({
            query: `
              mutation {
                editProfile(input:{
                  email: "${NEW_EMAIL}"
                }) {
                  ok
                  error
                }
              }
          `,
          })
          .expect(200)
          .expect((res) => {
            const { ok, error } = res.body.data.editProfile;
            expect(ok).toBe(true);
            expect(error).toBe(null);
          });
      });

      it('should change password', () => {
        return request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .set('x-jwt', jwtToken)
          .send({
            query: `
              mutation {
                editProfile(input:{
                  password: "${NEW_PASSWORD}"
                }) {
                  ok
                  error
                }
              }
          `,
          })
          .expect(200)
          .expect((res) => {
            const { ok, error } = res.body.data.editProfile;
            expect(ok).toBe(true);
            expect(error).toBe(null);
          });
      });

      it('should have a new email', () => {
        return request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .set('x-jwt', jwtToken)
          .send({
            query: `
            {
              me {
                email
              }
            }
          `,
          })
          .expect(200)
          .expect((res) => {
            const { email } = res.body.data.me;
            expect(email).toBe(NEW_EMAIL);
          });
      });
    });
  });
});
