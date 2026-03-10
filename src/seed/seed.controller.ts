import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {

  constructor(private readonly seedService: SeedService) { }

  @Get(':item')
  public async executeSeed(@Param('item') item: string) {
    return await this.seedService.executeSeed(+item);
  }
}
