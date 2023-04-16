import {
  Controller,
  Get,
  NotFoundException,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import * as moment from 'moment';
import { CustomWinstonLogger } from 'src/logger/custom_winston_logger.service';
import { PrismaClientService } from 'src/prisma/prisma.service';
import { YoutubeService } from 'src/youtube/youtube.service';

@Controller('v1/core')
export class CoreController {
  constructor(
    private readonly logger: CustomWinstonLogger,
    private readonly prisma: PrismaClientService,
    private readonly ytService: YoutubeService,
  ) {
    logger.setContext(CoreController.name);
  }

  @Post('addvideo')
  async addVideo(@Query('id') id: string) {
    const videoExists = await this.prisma.videos.findUnique({
      where: {
        id,
      },
    });
    if (videoExists) {
      return {
        video: videoExists,
        isNewVideo: false,
      };
    } else {
      const videoInfo = await this.ytService.getVideoInfo(id);
      const video = await this.prisma.videos.create({
        data: {
          added_on: moment(new Date()).format('YYYY-MM-DD'),
          author: videoInfo.author,
          id,
          original_upload_date: videoInfo.publishDate,
          title: videoInfo.title,
          views: videoInfo.viewCount,
        },
      });

      return {
        video,
        isNewVideo: true,
      };
    }
  }

  @Get('get_recent_videos')
  async getRecentVideos(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) take: number,
  ) {
    return this.prisma.videos.findMany({
      skip,
      take,
    });
  }

  @Get('video')
  async getVideo(@Query('id') id: string) {
    const video = this.prisma.videos.findFirst({
      where: {
        id,
      },
    });
    if (!video) throw new NotFoundException('Video not found');
    return video;
  }
}

