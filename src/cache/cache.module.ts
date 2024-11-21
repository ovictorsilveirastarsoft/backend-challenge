import { Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { RedisClientOptions } from 'redis';

@Module({
  imports: [
    NestCacheModule.registerAsync<RedisClientOptions>({
      useFactory: () => ({
        store: redisStore as any, 
        url: process.env.REDIS_DNS || `redis://:mypassword@redis:6379`,
        ttl:5,
        max: 100,

      }),
    }),
  ],
  exports: [NestCacheModule],
})
export class CacheRedisModule {}
