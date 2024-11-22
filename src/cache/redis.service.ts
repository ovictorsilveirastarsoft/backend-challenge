import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit {
  private redisClient: RedisClientType;

  async onModuleInit() {
    const redisUrl = process.env.REDIS_DNS;
    this.redisClient = createClient({ url: redisUrl });
    this.redisClient.on('error', (err) => console.error('Redis Client Error', err));

    try {
      await this.redisClient.connect();
      console.log('Redis connected successfully');
    } catch (error) {
      console.error('Error connecting to Redis:', error);
    }
  }


  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (!this.redisClient) {
      throw new Error('Redis client is not initialized');
    }
    await this.redisClient.set(key, value);
  }

  
  async get(key: string): Promise<string | null> {
    if (!this.redisClient) {
      throw new Error('Redis client is not initialized');
    }
    return await this.redisClient.get(key);
  }

  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
  
}
