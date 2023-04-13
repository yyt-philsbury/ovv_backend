import { Controller, Get, Query } from '@nestjs/common';
import { CustomWinstonLogger } from 'src/logger/custom_winston_logger.service';
import { YoutubeService } from 'src/youtube/youtube.service';

@Controller('v1/yt')
export class YoutubeController {
  constructor(
    private readonly logger: CustomWinstonLogger,
    private readonly ytService: YoutubeService,
  ) {
    logger.setContext(YoutubeController.name);
  }

  @Get('videoinfo')
  async getVideoInfo(@Query('id') id: string) {
    return this.ytService.getVideoInfo(id);
  }
}

