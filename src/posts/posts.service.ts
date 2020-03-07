import { Injectable } from '@nestjs/common';
import { Post } from './entity/post';
import posts from './mock/posts.json';
import https from 'https';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PostsService {
  private env: string;

  constructor(private readonly configService: ConfigService) {
    this.env = this.configService.get<string>('NODE_ENV');
  }

  async findAll(): Promise<Post[]> {
    if (this.env == 'production') {
      return await this.findAllFromAPI();
    } else {
      return await Promise.resolve(posts);
    }
  }

  async findOne(id: number): Promise<Post> {
    if (this.env == 'production') {
      return await this.findOneFromAPI(id);
    } else {
      const post = posts.find(post => post.id == id);
      return await Promise.resolve(post);
    }
  }

  private async findAllFromAPI(): Promise<Post[]> {
    return await this.callAPI<Post[]>('posts');
  }

  private async findOneFromAPI(id: number): Promise<Post> {
    return await this.callAPI<Post>(`posts/${id}`);
  }

  private async callAPI<T>(path: string): Promise<T> {
    return new Promise(resolve => {
      const basePath = this.configService.get<string>('API_URL');
      let data = '';
      https.get(`${basePath}/${path}`, res => {
        res.on('data', chunk => {
          data += chunk;
        });

        res.on('end', () => {
          const output = JSON.parse(data) as T;
          resolve(output);
        });
      });
    });
  }
}
