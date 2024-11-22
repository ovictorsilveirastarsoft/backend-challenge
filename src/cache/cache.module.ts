import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Global()
@Module({
  imports: [
    CacheModule.register({
        store: redisStore as any, 
        url: process.env.REDIS_DNS,
        ttl:5,
        max: 100,
      }),
   
  ],
  exports: [CacheModule],
})
export class CacheRedisModule {}
