import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService extends Redis{
    private readonly redisClient: Redis;
    constructor() {
        super({
            port: Number(process.env.REDIS_PORT),
            host: process.env.REDIS_HOST,
            password: process.env.REDIS_PASSWORD,
            db: 0,
        });
        super.on('error', (err) => {
            console.log('Error on Redis');
            console.log(err);
            process.exit(1);
        });

        super.on('connect', () => {
            console.log('Redis connected!');
        });

        
    }
    async set(key: string, value: string): Promise<"OK"> {
        return await this.redisClient.set(key, value);
      }
    
      async get(key: string): Promise<string> {
        return await this.redisClient.get(key);
      }
}