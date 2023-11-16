import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './entities/news.entity';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
  ) {}

  async findAll(): Promise<News[]> {
    return this.newsRepository.find({ order: { date: 'DESC' } });
  }

  async findById(id: number): Promise<News> {
    return this.newsRepository.findOne({where:{id}});
  }

  async create(news: News): Promise<News> {
    return this.newsRepository.save(news);
  }

  async update(id: number, updatedNews: Partial<News>): Promise<News> {
    await this.newsRepository.update(id, updatedNews);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.newsRepository.delete(id);
  }
}
