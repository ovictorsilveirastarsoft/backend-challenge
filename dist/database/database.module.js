"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const users_entity_1 = require("../users/entity/users.entity");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: async (configService) => {
                    console.log('Conectando ao banco de dados com as seguintes configurações:');
                    console.log(`Host: ${configService.get('TYPEORM_HOST')}`);
                    console.log(`Port: ${configService.get('TYPEORM_PORT')}`);
                    return {
                        type: configService.get('TYPEORM_CONNECTION'),
                        host: configService.get('TYPEORM_HOST'),
                        port: configService.get('TYPEORM_PORT'),
                        username: configService.get('TYPEORM_USERNAME'),
                        password: configService.get('TYPEORM_PASSWORD'),
                        database: configService.get('TYPEORM_DATABASE'),
                        entities: [users_entity_1.Users],
                        synchronize: configService.get('TYPEORM_SYNCHRONIZE'),
                        logging: true,
                        extra: {
                            connectionLimit: 10,
                            idleTimeoutMillis: 30000,
                        },
                    };
                },
                inject: [config_1.ConfigService],
            }),
        ],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map