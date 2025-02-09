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
exports.CommentModel = void 0;
const db_1 = __importDefault(require("../db"));
class CommentModel {
    static create(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            const [newComment] = yield (0, db_1.default)('comments').insert(comment).returning('*');
            return newComment;
        });
    }
    static findAll() {
        return __awaiter(this, arguments, void 0, function* (options = {}) {
            const { post, commenter } = options;
            let query = (0, db_1.default)('comments');
            // Handle post filtering
            if (post) {
                query = query.where({ post_id: post });
            }
            // Handle commenter filtering
            if (commenter) {
                query = query.where({ commenter_name: commenter });
            }
            return query.orderBy('created_at', 'desc');
        });
    }
    static findByPostId(postId_1) {
        return __awaiter(this, arguments, void 0, function* (postId, options = {}) {
            const { commenter } = options;
            let query = (0, db_1.default)('comments').where({ post_id: postId });
            // Handle commenter filtering
            if (commenter) {
                query = query.where({ commenter_name: commenter });
            }
            return query.orderBy('created_at', 'desc');
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, db_1.default)('comments')
                .where({ id })
                .first();
        });
    }
    static update(id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            // First, check if the comment exists
            const existingComment = yield this.findById(id);
            if (!existingComment) {
                return undefined;
            }
            const [updatedComment] = yield (0, db_1.default)('comments')
                .where({ id })
                .update(updates)
                .returning('*');
            return updatedComment;
        });
    }
    static deleteComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // First, check if the comment exists
            const existingComment = yield this.findById(id);
            if (!existingComment) {
                return false;
            }
            yield (0, db_1.default)('comments')
                .where({ id })
                .del();
            return true;
        });
    }
}
exports.CommentModel = CommentModel;
