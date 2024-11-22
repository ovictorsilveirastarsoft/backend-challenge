import { Injectable } from '@nestjs/common';
import { RedisService } from 'cache/redis.service';  

@Injectable()
export class UserCacheService {
  constructor(private readonly redisService: RedisService) {}

 
  async getCacheVersion(): Promise<string> {
    const cacheVersionKey = 'users_cache_version';
    let cacheVersion = await this.redisService.get(cacheVersionKey);
    if (!cacheVersion) {
      cacheVersion = '1';  
      await this.redisService.set(cacheVersionKey, cacheVersion);
    }
    return cacheVersion;
  }


  async getCachedData<T>(cacheKey: string, cacheVersion: string): Promise<T | null> {
    const cachedData = await this.redisService.get(`${cacheKey}_v${cacheVersion}`);
    if (cachedData) {
      try {
        return JSON.parse(cachedData) as T; 
      } catch (error) {
        console.error('Erro ao analisar dados do cache', error);
        return null; 
      }
    }
    return null; 
  }


  async setCache<T>(cacheKey: string, cacheVersion: string, data: T): Promise<void> {
    await this.redisService.set(`${cacheKey}_v${cacheVersion}`, JSON.stringify(data));
  }


  async invalidateCache(): Promise<void> {
    const cacheVersionKey = 'users_cache_version';
    let currentVersion = await this.redisService.get(cacheVersionKey);
    const newVersion = currentVersion ? parseInt(currentVersion, 10) + 1 : 1;
    await this.redisService.set(cacheVersionKey, newVersion.toString());
  }
}
