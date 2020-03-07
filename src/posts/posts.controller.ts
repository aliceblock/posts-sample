import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { Post } from './entity/post';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async findAll(): Promise<Post[]> {
    return await this.postsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const post = await this.postsService.findOne(id);
    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }
}
