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
exports.CommentService = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
class CommentService {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.comment.create({ data });
        });
    }
    findAll() {
        return __awaiter(this, arguments, void 0, function* (options = {}) {
            const { post, commenter } = options;
            const where = {};
            if (post) {
                where.post_id = post;
            }
            if (commenter) {
                where.commenter_name = commenter;
            }
            return prisma_1.default.comment.findMany({
                where,
                include: {
                    post: true
                },
                orderBy: {
                    created_at: 'desc'
                }
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.comment.findUnique({
                where: { id },
                include: {
                    post: true
                }
            });
        });
    }
    findByPostId(postId, commenter) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = {
                post_id: postId
            };
            if (commenter) {
                where.commenter_name = commenter;
            }
            return prisma_1.default.comment.findMany({
                where,
                include: {
                    post: true
                },
                orderBy: {
                    created_at: 'desc'
                }
            });
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.findById(id);
            if (!comment)
                return null;
            return prisma_1.default.comment.update({
                where: { id },
                data,
                include: {
                    post: true
                }
            });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield prisma_1.default.comment.delete({
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
exports.CommentService = CommentService;
