import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const port = 3333;
  const baseUrl = `http://localhost:${port}`;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await app.listen(port);

    prisma = app.get(PrismaService);
    await prisma.cleanDB();
    pactum.request.setBaseUrl(baseUrl);
  });

  afterAll(() => {
    app.close();
  });

  describe('User', () => {
    describe('Signup', () => {
      it('should response bad request', () => {
        const body = {
          name: 'test',
        };

        return pactum
          .spec()
          .post('/user/signup')
          .withBody(body)
          .expectStatus(400)
          .inspect();
      });

      it('should success signup', () => {
        const body = {
          name: 'test',
          email: 'test@gmail.com',
          password: 'password',
        };

        return pactum
          .spec()
          .post('/user/signup')
          .withBody(body)
          .expectStatus(201)
          .inspect();
      });
    });

    describe('get profile', () => {});
  });

  describe('Auth', () => {
    describe('Signin', () => {
      it('should response bad request', () => {
        const body = {
          email: 'test@mail.com',
        };

        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(body)
          .expectStatus(400)
          .inspect();
      });

      it('should success signin', () => {
        const body = {
          email: 'test@gmail.com',
          password: 'password',
        };

        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(body)
          .expectStatus(200)
          .inspect()
          .stores('token', 'data.accessToken');
      });
    });

    describe('get profile', () => {
      it('should response 401 unauthorized', () => {
        return pactum.spec().get('/user/profile').expectStatus(401).inspect();
      });

      it('should success get profile', () => {
        return pactum
          .spec()
          .get('/user/profile')
          .withBearerToken('$S{token}')
          .expectStatus(200)
          .inspect();
      });
    });
  });

  describe('Bookmark', () => {
    describe('create', () => {
      it('should response 401 unathorized', () => {
        const body = {
          url: 'https://test.com',
          title: 'Test',
          description: 'testing',
        };

        return pactum
          .spec()
          .post('/bookmarks')
          .withBody(body)
          .expectStatus(401)
          .inspect();
      });

      it('should response 400 BadRequest', () => {
        const body = {};

        return pactum
          .spec()
          .post('/bookmarks')
          .withBody(body)
          .withBearerToken('$S{token}')
          .expectStatus(400)
          .inspect();
      });

      it('should success create bookmark', () => {
        const body = {
          url: 'https://test.com',
          title: 'Test',
          description: 'testing',
        };

        return pactum
          .spec()
          .post('/bookmarks')
          .withBearerToken('$S{token}')
          .withBody(body)
          .expectStatus(201)
          .stores('bookmarkId', 'data.id')
          .inspect();
      });
    });
    describe('get bookmarks', () => {
      it('should response 401 unathorized', () => {
        return pactum.spec().get('/bookmarks').expectStatus(401).inspect();
      });

      it('should success get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withBearerToken('$S{token}')
          .expectStatus(200)
          .expectJson('ok', true)
          .expectJsonLength('data', 1)
          .inspect();
      });
    });

    describe('get bookmark by id', () => {
      it('should response 401 unathorized', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(401)
          .inspect();
      });

      it('should response not found if bookmark not found', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withBearerToken('$S{token}')
          .withPathParams('id', '123')
          .expectStatus(404)
          .inspect();
      });

      it('should response 200', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withBearerToken('$S{token}')
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(200)
          .expectJson('ok', true)
          .expectJson('data.id', '$S{bookmarkId}')
          .inspect();
      });
    });
    describe('update', () => {
      it('should response 401 unathorized', () => {
        return pactum
          .spec()
          .put('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(401)
          .inspect();
      });

      it('should response not found if bookmark not found', () => {
        return pactum
          .spec()
          .put('/bookmarks/{id}')
          .withBearerToken('$S{token}')
          .withPathParams('id', '123')
          .expectStatus(404)
          .inspect();
      });

      it('should response 200', () => {
        return pactum
          .spec()
          .put('/bookmarks/{id}')
          .withBearerToken('$S{token}')
          .withPathParams('id', '$S{bookmarkId}')
          .withBody({ title: 'test edit' })
          .expectStatus(200)
          .expectJson('ok', true)
          .expectJson('data.id', '$S{bookmarkId}')
          .inspect();
      });
    });
    describe('delete', () => {
      it('should response 401 unathorized', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(401)
          .inspect();
      });

      it('should response not found if bookmark not found', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withBearerToken('$S{token}')
          .withPathParams('id', '123')
          .expectStatus(404)
          .inspect();
      });

      it('should response 200', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withBearerToken('$S{token}')
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(200)
          .expectJson('ok', true)
          .inspect();
      });

      it('should response not found after bookmark deleted', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withBearerToken('$S{token}')
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(404)
          .inspect();
      });
    });
  });
});
