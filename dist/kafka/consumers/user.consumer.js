"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserConsumer = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const users_entity_1 = require("../../users/entity/users.entity");
let UserConsumer = class UserConsumer {
    onModuleInit() {
        console.log('Kafka Consumer is initialized');
    }
    handleUserCreated(user) {
        console.log('User created event received:', user);
        console.log('Tamanho da mensagem:', JSON.stringify(user).length);
    }
    handleUserUpdated(user) {
        console.log('User updated event received:', user);
        console.log('Tamanho da mensagem:', JSON.stringify(user).length);
    }
};
exports.UserConsumer = UserConsumer;
__decorate([
    (0, microservices_1.MessagePattern)('user_created'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.Users]),
    __metadata("design:returntype", void 0)
], UserConsumer.prototype, "handleUserCreated", null);
__decorate([
    (0, microservices_1.MessagePattern)('user_updated'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.Users]),
    __metadata("design:returntype", void 0)
], UserConsumer.prototype, "handleUserUpdated", null);
exports.UserConsumer = UserConsumer = __decorate([
    (0, common_1.Injectable)()
], UserConsumer);
//# sourceMappingURL=user.consumer.js.map