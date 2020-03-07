import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, NotFoundException } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PostsService } from '../src/posts/posts.service';
import { Post } from '../src/posts/entity/post';

jest.mock('../src/posts/posts.service');

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let postService: PostsService;

  const expectedPost = new Post(1, 1, 'Test', 'Body');
  const expectedPosts = [expectedPost];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    postService = moduleFixture.get<PostsService>(PostsService);
    await app.init();
  });

  it('/posts (GET)', () => {
    jest.spyOn(postService, 'findAll').mockResolvedValue(expectedPosts);
    return request(app.getHttpServer())
      .get('/posts')
      .expect(200)
      .expect(JSON.stringify(expectedPosts));
  });

  it('/posts/1 (GET)', () => {
    jest.spyOn(postService, 'findOne').mockResolvedValue(expectedPost);
    return request(app.getHttpServer())
      .get('/posts/1')
      .expect(200)
      .expect(JSON.stringify(expectedPost));
  });

  it('/posts/1 (GET) - Not Found', () => {
    jest.spyOn(postService, 'findOne').mockResolvedValue(null);
    return request(app.getHttpServer())
      .get('/posts/1')
      .expect(404)
      .expect(new NotFoundException().getResponse());
  });
});
