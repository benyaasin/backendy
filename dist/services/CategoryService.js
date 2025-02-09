"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
class CategoryService {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.category.create({ data });
        });
    }
    findAll(showDeleted) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = {};
            switch (showDeleted) {
                case 'true':
                    // Return all categories (including deleted)
                    break;
                case 'onlyDeleted':
                    where.deleted_at = { not: null };
                    break;
                case 'false':
                default:
                    where.deleted_at = null;
                    break;
            }
            return prisma_1.default.category.findMany({ where });
        });
    }
    findById(id, showDeleted) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = { id };
            switch (showDeleted) {
                case 'true':
                    // Return category regardless of deleted status
                    break;
                case 'onlyDeleted':
                    where.deleted_at = { not: null };
                    break;
                case 'false':
                default:
                    where.deleted_at = null;
                    break;
            }
            return prisma_1.default.category.findFirst({ where });
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.findById(id);
            if (!category || category.deleted_at)
                return null;
            return prisma_1.default.category.update({
                where: { id },
                data
            });
        });
    }
    softDelete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.findById(id);
            if (!category || category.deleted_at)
                return false;
            yield prisma_1.default.category.update({
                where: { id },
                data: { deleted_at: new Date() }
            });
            return true;
        });
    }
}
exports.CategoryService = CategoryService;
