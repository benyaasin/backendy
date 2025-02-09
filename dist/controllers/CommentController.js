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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentController = void 0;
const Comment_1 = require("../models/Comment");
const Post_1 = require("../models/Post");
class CommentController {
    static createComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { post_id, content, commenter_name } = req.body;
                // Validate that the post exists
                const post = yield Post_1.PostModel.findById(post_id);
                if (!post) {
                    res.status(404).json({ error: 'Post not found' });
                    return;
                }
                const newComment = {
                    post_id,
                    content,
                    commenter_name
                };
                const comment = yield Comment_1.CommentModel.create(newComment);
                res.status(201).json(comment);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to create comment' });
            }
        });
    }
    static getAllComments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { post, commenter } = req.query;
                const options = {
                    post: post ? Number(post) : undefined,
                    commenter: commenter
                };
                const comments = yield Comment_1.CommentModel.findAll(options);
                res.json(comments);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to fetch comments' });
            }
        });
    }
    static getCommentsByPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.params;
                const { commenter } = req.query;
                const options = {
                    commenter: commenter
                };
                const comments = yield Comment_1.CommentModel.findByPostId(Number(postId), options);
                res.json(comments);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to fetch comments' });
            }
        });
    }
    static getCommentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const comment = yield Comment_1.CommentModel.findById(Number(id));
                if (!comment) {
                    res.status(404).json({ error: 'Comment not found' });
                    return;
                }
                res.json(comment);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to fetch comment' });
            }
        });
    }
    static updateComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { content } = req.body;
                const updatedComment = yield Comment_1.CommentModel.update(Number(id), { content });
                if (!updatedComment) {
                    res.status(404).json({ error: 'Comment not found' });
                    return;
                }
                res.json(updatedComment);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to update comment' });
            }
        });
    }
    static deleteComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const deleted = yield Comment_1.CommentModel.deleteComment(Number(id));
                if (!deleted) {
                    res.status(404).json({ error: 'Comment not found' });
                    return;
                }
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to delete comment' });
            }
        });
    }
}
exports.CommentController = CommentController;
