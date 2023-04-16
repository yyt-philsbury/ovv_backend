import {
  Injectable,
  RequestTimeoutException,
  UnprocessableEntityException,
} from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import * as moment from 'moment';
import timeoutSignalController from 'src/common/utils/abort_timeout';
import { CustomWinstonLogger } from 'src/logger/custom_winston_logger.service';

@Injectable()
export class YoutubeService {
  constructor(private readonly logger: CustomWinstonLogger) {
    logger.setContext(YoutubeService.name);
  }

  async getVideoInfo(videoId: string) {
    const controller = timeoutSignalController(5000);
    const ytLink = `https://www.youtube.com/watch?v=${videoId}`;

    try {
      const response = await axios.get(ytLink, {
        signal: controller.signal,
        timeout: 5000,
        timeoutErrorMessage: `Timed out waiting for response from ${ytLink}`,
      });

      const html = response.data as string;
      const viewCount = html.split('viewCount":"')?.[1]?.split('"')?.[0];
      if (!viewCount) {
        this.logger.warn(
          `https://www.youtube.com/watch?v=${videoId} - could not parse view count`,
        );
        throw new UnprocessableEntityException(
          'Could not find views info on this video',
        );
      }

      // YYYY-MM-DD
      const publishDate = html.split('"publishDate":"')?.[1]?.slice(0, 10);
      if (!publishDate || !moment(publishDate, 'YYYY-MM-DD', true).isValid()) {
        this.logger.warn(
          `https://www.youtube.com/watch?v=${videoId} - could not parse date`,
        );
        throw new UnprocessableEntityException(
          'Could not find upload date info on this video',
        );
      }

      const title = html
        ?.split('<meta name="title" content="')?.[1]
        .split('"')?.[0];
      if (!title) {
        this.logger.warn(
          `https://www.youtube.com/watch?v=${videoId} - could not parse title`,
        );
        throw new UnprocessableEntityException(
          'Could not find title info on this video',
        );
      }

      const author = html.split('"author":"')?.[1]?.split('",')?.[0];
      if (!author) {
        this.logger.warn(
          `https://www.youtube.com/watch?v=${videoId} - could not parse author`,
        );
        throw new UnprocessableEntityException(
          'Could not find author info on this video',
        );
      }

      return {
        viewCount: parseInt(viewCount),
        publishDate,
        title,
        author,
      };
    } catch (err) {
      if (err instanceof AxiosError) {
        this.logger.warn(`${ytLink} response timed out`);
        throw new RequestTimeoutException(err.message);
      } else if (controller.signal.aborted) {
        this.logger.warn(`${ytLink} connection timed out`);
        throw new RequestTimeoutException(
          `Timed out trying to reach ${ytLink}`,
        );
      } else throw err;
    }
  }
}

