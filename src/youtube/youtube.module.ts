import { Global, Module } from '@nestjs/common';
import { YoutubeController } from 'src/youtube/youtube.controller';
import { YoutubeService } from 'src/youtube/youtube.service';

@Global()
@Module({
  controllers: [YoutubeController],
  providers: [YoutubeService],
  exports: [YoutubeService],
})
export class YoutubeModule {}

