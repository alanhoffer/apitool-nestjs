import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { NewsService } from './news.service';
import { News } from './entities/news.entity';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { AuthGuard } from 'src/auth/auth.guard';


@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Roles('')
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  async findAll(@Request() req): Promise<News[]> {
    return this.newsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<News> {
    return this.newsService.findById(id);
  }

  @Post()
  async create(@Body() news: News): Promise<News> {
    return this.newsService.create(news);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updatedNews: Partial<News>): Promise<News> {
    return this.newsService.update(id, updatedNews);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.newsService.delete(id);
  }
}
