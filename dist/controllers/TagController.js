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
exports.TagController = void 0;
const TagService_1 = require("../services/TagService");
const tagService = new TagService_1.TagService();
class TagController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.body;
                const tag = yield tagService.create({ name });
                res.status(201).json(tag);
            }
            catch (error) {
                res.status(500).json({ error: 'Etiket oluşturulamadı' });
            }
        });
    }
    findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tags = yield tagService.findAll();
                res.json(tags);
            }
            catch (error) {
                res.status(500).json({ error: 'Etiketler getirilemedi' });
            }
        });
    }
    findById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const tag = yield tagService.findById(Number(id));
                if (!tag) {
                    res.status(404).json({ error: 'Etiket bulunamadı' });
                    return;
                }
                res.json(tag);
            }
            catch (error) {
                res.status(500).json({ error: 'Etiket getirilemedi' });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { name } = req.body;
                const tag = yield tagService.update(Number(id), { name });
                if (!tag) {
                    res.status(404).json({ error: 'Etiket bulunamadı' });
                    return;
                }
                res.json(tag);
            }
            catch (error) {
                res.status(500).json({ error: 'Etiket güncellenemedi' });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const deleted = yield tagService.delete(Number(id));
                if (!deleted) {
                    res.status(404).json({ error: 'Etiket bulunamadı' });
                    return;
                }
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: 'Etiket silinemedi' });
            }
        });
    }
}
exports.TagController = TagController;
