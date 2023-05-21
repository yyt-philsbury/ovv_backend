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
import moment = require('moment');
import he = require('he');
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

  // @Get('fix')
  // async fixVideos() {
  //   const videos = await this.prisma.videos.findMany();

  //   for (let i = 0; i < videos.length; i += 1) {
  //     const { author, title } = videos[i];

  //     await this.prisma.videos.update({
  //       data: {
  //         author: he.decode(author),
  //         title: he.decode(title),
  //       },
  //       where: {
  //         id: videos[i].id,
  //       },
  //     });
  //   }
  // }

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

      const { author, title } = videoInfo;

      const decodedAuthor = he.decode(author);
      const decodedTitle = he.decode(title);

      const [video] = await this.prisma.$transaction([
        this.prisma.videos.create({
          data: {
            added_on: new Date(),
            author: decodedAuthor,
            id,
            original_upload_date: videoInfo.publishDate,
            title: decodedTitle,
            views: videoInfo.viewCount,
          },
        }),
        this.prisma.$executeRawUnsafe(
          `INSERT INTO video_search(id, title, author, original_upload_year) VALUES ('${id}','${decodedTitle
            .replaceAll("'", "''")
            .replaceAll('"', '""')}', '${decodedAuthor
            .replaceAll("'", "''")
            .replaceAll('"', '""')}', '${videoInfo.publishDate.slice(0, 4)}')`,
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
    @Query('take', new DefaultValuePipe(500), ParseIntPipe) take: number,
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
        orderBy: {
          added_on: 'desc',
        },
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

