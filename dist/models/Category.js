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
exports.CategoryModel = void 0;
const db_1 = __importDefault(require("../db"));
class CategoryModel {
    static create(category) {
        return __awaiter(this, void 0, void 0, function* () {
            const [newCategory] = yield (0, db_1.default)('categories').insert(category).returning('*');
            return newCategory;
        });
    }
    static findAll() {
        return __awaiter(this, arguments, void 0, function* (options = {}) {
            const { showDeleted = 'false' } = options;
            let query = (0, db_1.default)('categories');
            switch (showDeleted) {
                case 'true':
                    // Return all categories (including deleted)
                    break;
                case 'onlyDeleted':
                    // Return only deleted categories
                    query = query.whereNotNull('deleted_at');
                    break;
                case 'false':
                default:
                    // Return only non-deleted categories
                    query = query.whereNull('deleted_at');
                    break;
            }
            return query;
        });
    }
    static findById(id_1) {
        return __awaiter(this, arguments, void 0, function* (id, options = {}) {
            const { showDeleted = 'false' } = options;
            let query = (0, db_1.default)('categories').where({ id });
            switch (showDeleted) {
                case 'true':
                    // Return category regardless of deleted status
                    break;
                case 'onlyDeleted':
                    // Return only if deleted
                    query = query.whereNotNull('deleted_at');
                    break;
                case 'false':
                default:
                    // Return only if not deleted
                    query = query.whereNull('deleted_at');
                    break;
            }
            return query.first();
        });
    }
    static update(id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            // First, check if the category exists and is not deleted
            const existingCategory = yield this.findById(id);
            if (!existingCategory) {
                return undefined;
            }
            const [updatedCategory] = yield (0, db_1.default)('categories')
                .where({ id })
                .update(updates)
                .returning('*');
            return updatedCategory;
        });
    }
    static softDelete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // First, check if the category exists and is not already deleted
            const existingCategory = yield this.findById(id);
            if (!existingCategory) {
                return false;
            }
            yield (0, db_1.default)('categories')
                .where({ id })
                .update({ deleted_at: new Date() });
            return true;
        });
    }
}
exports.CategoryModel = CategoryModel;
