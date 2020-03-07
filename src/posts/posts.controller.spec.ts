import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Post } from './entity/post';
import { NotFoundException } from '@nestjs/common';

jest.mock('./posts.service');

describe('Post Controller', () => {
  let controller: PostsController;
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [PostsService],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Get posts', () => {
    const expectedPost = new Post(1, 1, 'Title', 'Body');
    const expectedPosts = [expectedPost];

    it('Should return array of Post', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue(expectedPosts);

      const posts = await controller.findAll();

      expect(service.findAll).toBeCalled();
      expect(posts).toEqual(expectedPosts);
    });

    it('Should return only specific Post', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(expectedPost);

      const post = await controller.findOne(1);

      expect(service.findOne).toBeCalled();
      expect(post).toEqual(expectedPost);
    });

    it('Should error if no Post return', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      expect(controller.findOne(1)).rejects.toThrow(NotFoundException);
      expect(service.findOne).toBeCalled();
    });
  });
});
