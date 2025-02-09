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
exports.PostService = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
class PostService {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.post.create({ data });
        });
    }
    findAll() {
        return __awaiter(this, arguments, void 0, function* (options = {}) {
            const { showDeleted = 'false', status = 'all', category, tags } = options;
            const where = {};
            // Handle deleted status
            switch (showDeleted) {
                case 'true':
                    // Return all posts (including deleted)
                    break;
                case 'onlyDeleted':
                    where.deleted_at = { not: null };
                    break;
                case 'false':
                default:
                    where.deleted_at = null;
                    break;
            }
            // Handle publication status
            switch (status) {
                case 'published':
                    where.published_at = { not: null };
                    break;
                case 'draft':
                    where.published_at = null;
                    break;
                case 'all':
                default:
                    break;
            }
            // Handle category filtering
            if (category) {
                where.category_id = category;
            }
            // Handle tag filtering
            if (tags && tags.length > 0) {
                where.post_tags = {
                    some: {
                        tag_id: { in: tags }
                    }
                };
            }
            return prisma_1.default.post.findMany({
                where,
                include: {
                    category: true,
                    post_tags: {
                        include: {
                            tag: true
                        }
                    }
                }
            });
        });
    }
    findById(id, showDeleted) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = { id };
            switch (showDeleted) {
                case 'true':
                    // Return post regardless of deleted status
                    break;
                case 'onlyDeleted':
                    where.deleted_at = { not: null };
                    break;
                case 'false':
                default:
                    where.deleted_at = null;
                    break;
            }
            return prisma_1.default.post.findFirst({
                where,
                include: {
                    category: true,
                    comments: true,
                    post_tags: {
                        include: {
                            tag: true
                        }
                    }
                }
            });
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.findById(id);
            if (!post || post.deleted_at)
                return null;
            return prisma_1.default.post.update({
                where: { id },
                data,
                include: {
                    category: true,
                    post_tags: {
                        include: {
                            tag: true
                        }
                    }
                }
            });
        });
    }
    softDelete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.findById(id);
            if (!post || post.deleted_at)
                return false;
            yield prisma_1.default.post.update({
                where: { id },
                data: { deleted_at: new Date() }
            });
            return true;
        });
    }
    addTag(postId, tagId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield prisma_1.default.postTag.create({
                    data: {
                        post_id: postId,
                        tag_id: tagId
                    }
                });
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
    removeTag(postId, tagId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield prisma_1.default.postTag.delete({
                    where: {
                        post_id_tag_id: {
                            post_id: postId,
                            tag_id: tagId
                        }
                    }
                });
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
}
exports.PostService = PostService;
