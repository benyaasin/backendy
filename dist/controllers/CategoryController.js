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
exports.CategoryController = void 0;
const CategoryService_1 = require("../services/CategoryService");
const categoryService = new CategoryService_1.CategoryService();
class CategoryController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.body;
                const category = yield categoryService.create({ name });
                res.status(201).json(category);
            }
            catch (error) {
                console.error('Kategori oluşturma hatası:', error);
                res.status(500).json({
                    message: 'Kategori oluşturulamadı',
                    error: error instanceof Error ? error.message : 'Bilinmeyen hata'
                });
            }
        });
    }
    findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { showDeleted } = req.query;
                const categories = yield categoryService.findAll(showDeleted);
                res.json(categories);
            }
            catch (error) {
                res.status(500).json({ error: 'Kategoriler getirilemedi' });
            }
        });
    }
    findById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { showDeleted } = req.query;
                const category = yield categoryService.findById(Number(id), showDeleted);
                if (!category) {
                    res.status(404).json({ error: 'Kategori bulunamadı' });
                    return;
                }
                res.json(category);
            }
            catch (error) {
                res.status(500).json({ error: 'Kategori getirilemedi' });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { name } = req.body;
                const category = yield categoryService.update(Number(id), { name });
                if (!category) {
                    res.status(404).json({ error: 'Kategori bulunamadı' });
                    return;
                }
                res.json(category);
            }
            catch (error) {
                res.status(500).json({ error: 'Kategori güncellenemedi' });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const deleted = yield categoryService.softDelete(Number(id));
                if (!deleted) {
                    res.status(404).json({ error: 'Kategori bulunamadı' });
                    return;
                }
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: 'Kategori silinemedi' });
            }
        });
    }
}
exports.CategoryController = CategoryController;
