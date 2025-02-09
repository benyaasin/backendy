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
exports.TagService = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
class TagService {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.tag.create({ data });
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.tag.findMany({
                include: {
                    post_tags: true
                }
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.tag.findUnique({
                where: { id },
                include: {
                    post_tags: {
                        include: {
                            post: true
                        }
                    }
                }
            });
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const tag = yield this.findById(id);
            if (!tag)
                return null;
            return prisma_1.default.tag.update({
                where: { id },
                data
            });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield prisma_1.default.tag.delete({
                    where: { id }
                });
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
}
exports.TagService = TagService;
