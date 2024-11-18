import { AppService } from './app.service';
import { Cache } from 'cache-manager';
export declare class AppController {
    private readonly appService;
    private cacheManager;
    constructor(appService: AppService, cacheManager: Cache);
    getHello(): Promise<string>;
}
