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
exports.PostModel = void 0;
const db_1 = __importDefault(require("../db"));
class PostModel {
    static create(post) {
        return __awaiter(this, void 0, void 0, function* () {
            const [newPost] = yield (0, db_1.default)('posts').insert(post).returning('*');
            return newPost;
        });
    }
    static findAll() {
        return __awaiter(this, arguments, void 0, function* (options = {}) {
            const { showDeleted = 'false', status = 'all', category } = options;
            let query = (0, db_1.default)('posts')
                .join('categories', 'posts.category_id', '=', 'categories.id')
                .select('posts.*', 'categories.name as category_name');
            // Handle deleted status
            switch (showDeleted) {
                case 'true':
                    // Return all posts (including deleted)
                    break;
                case 'onlyDeleted':
                    // Return only deleted posts
                    query = query.whereNotNull('posts.deleted_at');
                    break;
                case 'false':
                default:
                    // Return only non-deleted posts
                    query = query.whereNull('posts.deleted_at');
                    break;
            }
            // Handle publication status
            switch (status) {
                case 'published':
                    query = query.whereNotNull('published_at');
                    break;
                case 'draft':
                    query = query.whereNull('published_at');
                    break;
                case 'all':
                default:
                    break;
            }
            // Handle category filtering
            if (category) {
                query = query.where('posts.category_id', category);
            }
            return query;
        });
    }
    static findById(id_1) {
        return __awaiter(this, arguments, void 0, function* (id, options = {}) {
            const { showDeleted = 'false' } = options;
            let query = (0, db_1.default)('posts')
                .where({ 'posts.id': id })
                .join('categories', 'posts.category_id', '=', 'categories.id')
                .select('posts.*', 'categories.name as category_name');
            switch (showDeleted) {
                case 'true':
                    // Return post regardless of deleted status
                    break;
                case 'onlyDeleted':
                    // Return only if deleted
                    query = query.whereNotNull('posts.deleted_at');
                    break;
                case 'false':
                default:
                    // Return only if not deleted
                    query = query.whereNull('posts.deleted_at');
                    break;
            }
            return query.first();
        });
    }
    static findByCategory(categoryId_1) {
        return __awaiter(this, arguments, void 0, function* (categoryId, options = {}) {
            const { showDeleted = 'false', status = 'all' } = options;
            let query = (0, db_1.default)('posts')
                .where({ category_id: categoryId })
                .join('categories', 'posts.category_id', '=', 'categories.id')
                .select('posts.*', 'categories.name as category_name');
            // Handle deleted status
            switch (showDeleted) {
                case 'true':
                    // Return all posts (including deleted)
                    break;
                case 'onlyDeleted':
                    // Return only deleted posts
                    query = query.whereNotNull('posts.deleted_at');
                    break;
                case 'false':
                default:
                    // Return only non-deleted posts
                    query = query.whereNull('posts.deleted_at');
                    break;
            }
            // Handle publication status
            switch (status) {
                case 'published':
                    query = query.whereNotNull('published_at');
                    break;
                case 'draft':
                    query = query.whereNull('published_at');
                    break;
                case 'all':
                default:
                    break;
            }
            return query;
        });
    }
    static update(id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            // First, check if the post exists and is not deleted
            const existingPost = yield this.findById(id);
            if (!existingPost) {
                return undefined;
            }
            const [updatedPost] = yield (0, db_1.default)('posts')
                .where({ id })
                .update(updates)
                .returning('*');
            return updatedPost;
        });
    }
    static softDelete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // First, check if the post exists and is not already deleted
            const existingPost = yield this.findById(id);
            if (!existingPost) {
                return false;
            }
            yield (0, db_1.default)('posts')
                .where({ id })
                .update({ deleted_at: new Date() });
            return true;
        });
    }
}
exports.PostModel = PostModel;
