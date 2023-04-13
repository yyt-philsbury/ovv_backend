import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaClientService extends PrismaClient implements OnModuleInit {
  constructor() {
    super();
    /*
     * prisma middlewares
     * store_id_check(this);
     * no_deletes(this);
     * soft_delete_checker(this);
     */
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
