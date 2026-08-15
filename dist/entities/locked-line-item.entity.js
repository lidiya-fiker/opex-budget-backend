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
exports.LockedLineItem = void 0;
const typeorm_1 = require("typeorm");
let LockedLineItem = class LockedLineItem {
    id;
    lineItemCode;
    lineItemName;
    reason;
    lockedAt;
    unlockedAt;
};
exports.LockedLineItem = LockedLineItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], LockedLineItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'line_item_code' }),
    __metadata("design:type", String)
], LockedLineItem.prototype, "lineItemCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'line_item_name' }),
    __metadata("design:type", String)
], LockedLineItem.prototype, "lineItemName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], LockedLineItem.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'locked_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], LockedLineItem.prototype, "lockedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unlocked_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], LockedLineItem.prototype, "unlockedAt", void 0);
exports.LockedLineItem = LockedLineItem = __decorate([
    (0, typeorm_1.Entity)('locked_line_items')
], LockedLineItem);
//# sourceMappingURL=locked-line-item.entity.js.map