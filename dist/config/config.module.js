"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const Joi = require("joi");
let ConfigModule = class ConfigModule extends config_1.ConfigModule {
    static forRoot(options = {}) {
        return super.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                TYPEORM_CONNECTION: Joi.string().valid('postgres').required(),
                TYPEORM_HOST: Joi.string().required(),
                TYPEORM_PORT: Joi.number().required(),
                TYPEORM_USERNAME: Joi.string().required(),
                TYPEORM_PASSWORD: Joi.string().required(),
                TYPEORM_DATABASE: Joi.string().required(),
                TYPEORM_SYNCHRONIZE: Joi.boolean().required(),
                REDIS_DNS: Joi.string().required(),
            }),
            ...options,
        });
    }
};
exports.ConfigModule = ConfigModule;
exports.ConfigModule = ConfigModule = __decorate([
    (0, common_1.Module)({})
], ConfigModule);
//# sourceMappingURL=config.module.js.map