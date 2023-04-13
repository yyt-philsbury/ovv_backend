import { Global, Module } from '@nestjs/common';
import { CoreController } from 'src/core/core.controller';

@Global()
@Module({
  controllers: [CoreController],
})
export class CoreModule {}

