import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from 'src/core/core.module';
import { ExampleModule } from 'src/example/example.module';
import { LoggerModule } from 'src/logger/logger.module';
import { YoutubeModule } from 'src/youtube/youtube.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `.env.${process.env.NODE_ENV}` }),
    ExampleModule,
    LoggerModule,
    YoutubeModule,
    CoreModule,
  ],
})
export class AppModule {}
