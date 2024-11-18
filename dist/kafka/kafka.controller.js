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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaController = void 0;
const common_1 = require("@nestjs/common");
const kafka_service_1 = require("./kafka.service");
let KafkaController = class KafkaController {
    constructor(kafkaService) {
        this.kafkaService = kafkaService;
    }
    async sendMessageCreated(body) {
        const topic = 'user_created';
        await this.kafkaService.send(topic, body);
        return { success: true };
    }
    async sendMessageUpdated(body) {
        const topic = 'user_updated';
        await this.kafkaService.send(topic, body);
        return { success: true };
    }
};
exports.KafkaController = KafkaController;
__decorate([
    (0, common_1.Post)('send-user-created'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], KafkaController.prototype, "sendMessageCreated", null);
__decorate([
    (0, common_1.Patch)('send-user-updated'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], KafkaController.prototype, "sendMessageUpdated", null);
exports.KafkaController = KafkaController = __decorate([
    (0, common_1.Controller)('kafka'),
    __metadata("design:paramtypes", [kafka_service_1.KafkaService])
], KafkaController);
//# sourceMappingURL=kafka.controller.js.map