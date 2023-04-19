import {
  BadRequestException,
  Controller,
  DefaultValuePipe,
  Get,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import * as moment from 'moment';
import { CustomWinstonLogger } from 'src/logger/custom_winston_logger.service';
import { PrismaClientService } from 'src/prisma/prisma.service';
import { YoutubeService } from 'src/youtube/youtube.service';

const MINIMUM_VIEW_COUNT = 1000000;
const MAXIMUM_UPLOAD_DATE = '2011-01-01';

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

      if (videoInfo.viewCount < MINIMUM_VIEW_COUNT) {
        throw new BadRequestException('Video has less than 1 million views');
      }
      if (
        moment(videoInfo.publishDate, 'YYYY-MM-DD') >
        moment(MAXIMUM_UPLOAD_DATE, 'YYYY-MM-DD')
      ) {
        throw new BadRequestException(
          `Video must be uploaded before ${MAXIMUM_UPLOAD_DATE}`,
        );
      }

      const [video] = await this.prisma.$transaction([
        this.prisma.videos.create({
          data: {
            added_on: moment(new Date()).format('YYYY-MM-DD'),
            author: videoInfo.author,
            id,
            original_upload_date: videoInfo.publishDate,
            title: videoInfo.title,
            views: videoInfo.viewCount,
          },
        }),
        this.prisma.$executeRawUnsafe(
          `INSERT videos_search(id, title, author, original_upload_date) VALUES ('${id}','${videoInfo.title
            .replaceAll("'", "''")
            .replaceAll('"', '""')}', '${videoInfo.author
            .replaceAll("'", "''")
            .replaceAll('"', '""')}', '${videoInfo.publishDate}')`,
        ),
      ]);

      return {
        video,
        isNewVideo: true,
      };
    }
  }

  @Get('videos')
  async getVideos(
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Query('take', new DefaultValuePipe(100), ParseIntPipe) take: number,
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query(
      'years',
      new DefaultValuePipe([]),
      new ParseArrayPipe({ items: Number, separator: ',' }),
    )
    years: number[],
  ) {
    // return latest videos
    if (search === '') {
      return this.prisma.videos.findMany({
        where: {
          OR:
            years.length > 0
              ? years.map(e => ({
                  original_upload_date: {
                    startsWith: e.toString(),
                  },
                }))
              : undefined,
        },
        skip,
        take,
      });
    } else {
      const ids = (await this.prisma.$queryRawUnsafe(
        `SELECT id from video_search WHERE video_search = \'${search
          .replaceAll("'", "''")
          .replaceAll('"', '""')}\' ORDER BY RANK`,
      )) as { id: string }[];

      return this.prisma.videos.findMany({
        where: {
          AND: [
            {
              id: {
                in: ids.map(e => e.id),
              },
            },
            {
              OR:
                years.length > 0
                  ? years.map(e => ({
                      original_upload_date: {
                        startsWith: e.toString(),
                      },
                    }))
                  : undefined,
            },
          ],
        },
        skip,
        take,
      });
    }
  }
}

