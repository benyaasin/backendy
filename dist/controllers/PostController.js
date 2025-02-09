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
exports.PostController = void 0;
const PostService_1 = require("../services/PostService");
const postService = new PostService_1.PostService();
class PostController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { category_id, title, content, published_at } = req.body;
                const post = yield postService.create({
                    category: { connect: { id: category_id } },
                    title,
                    content,
                    published_at: published_at ? new Date(published_at) : null
                });
                res.status(201).json(post);
            }
            catch (error) {
                res.status(500).json({ error: 'Gönderi oluşturulamadı' });
            }
        });
    }
    findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { showDeleted, status, category, tags } = req.query;
                const posts = yield postService.findAll({
                    showDeleted: showDeleted,
                    status: status,
                    category: category ? Number(category) : undefined,
                    tags: tags ? tags.split(',').map(Number) : undefined
                });
                res.json(posts);
            }
            catch (error) {
                res.status(500).json({ error: 'Gönderiler getirilemedi' });
            }
        });
    }
    findById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { showDeleted } = req.query;
                const post = yield postService.findById(Number(id), showDeleted);
                if (!post) {
                    res.status(404).json({ error: 'Gönderi bulunamadı' });
                    return;
                }
                res.json(post);
            }
            catch (error) {
                res.status(500).json({ error: 'Gönderi getirilemedi' });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { title, content, published_at } = req.body;
                const post = yield postService.update(Number(id), {
                    title,
                    content,
                    published_at: published_at ? new Date(published_at) : null
                });
                if (!post) {
                    res.status(404).json({ error: 'Gönderi bulunamadı' });
                    return;
                }
                res.json(post);
            }
            catch (error) {
                res.status(500).json({ error: 'Gönderi güncellenemedi' });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const deleted = yield postService.softDelete(Number(id));
                if (!deleted) {
                    res.status(404).json({ error: 'Gönderi bulunamadı' });
                    return;
                }
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: 'Gönderi silinemedi' });
            }
        });
    }
    addTag(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { tagId } = req.body;
                const success = yield postService.addTag(Number(id), Number(tagId));
                if (!success) {
                    res.status(404).json({ error: 'Gönderi veya etiket bulunamadı' });
                    return;
                }
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: 'Etiket eklenemedi' });
            }
        });
    }
    removeTag(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, tagId } = req.params;
                const success = yield postService.removeTag(Number(id), Number(tagId));
                if (!success) {
                    res.status(404).json({ error: 'Gönderi veya etiket bulunamadı' });
                    return;
                }
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: 'Etiket kaldırılamadı' });
            }
        });
    }
}
exports.PostController = PostController;
