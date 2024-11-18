import { DynamicModule } from '@nestjs/common';
import { ConfigModuleOptions, ConfigModule as NestConfigModule } from '@nestjs/config';
export declare class ConfigModule extends NestConfigModule {
    static forRoot(options?: ConfigModuleOptions): Promise<DynamicModule>;
}
