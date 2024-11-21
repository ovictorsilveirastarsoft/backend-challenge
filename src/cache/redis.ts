import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit {
  private redisClient: RedisClientType;

  // Conectando ao Redis no método onModuleInit
  async onModuleInit() {
    const redisUrl = process.env.REDIS_DNS || 'redis://redis:6379'; // Usando a variável de ambiente REDIS_DNS
    this.redisClient = createClient({ url: redisUrl });
    this.redisClient.on('error', (err) => console.error('Redis Client Error', err));

    try {
      await this.redisClient.connect();  // Conecta de forma assíncrona
      console.log('Redis connected successfully');
    } catch (error) {
      console.error('Error connecting to Redis:', error);
    }
  }

  // Definindo o valor no Redis
  async set(key: string, value: string): Promise<void> {
    if (!this.redisClient) {
      throw new Error('Redis client is not initialized');
    }
    await this.redisClient.set(key, value);
  }

  // Obtendo o valor do Redis
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
