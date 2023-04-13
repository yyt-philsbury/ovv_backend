import { Global, Module } from '@nestjs/common';
import { PrismaClientService } from 'src/prisma/prisma.service';

@Global()
@Module({
  providers: [PrismaClientService],
  exports: [PrismaClientService],
})
export class PrismaModule {}
