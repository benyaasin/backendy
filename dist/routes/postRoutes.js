"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PostController_1 = require("../controllers/PostController");
const router = (0, express_1.Router)();
const postController = new PostController_1.PostController();
router.post('/', postController.create);
router.get('/', postController.findAll);
router.get('/:id', postController.findById);
router.patch('/:id', postController.update);
router.delete('/:id', postController.delete);
// Tag routes
router.post('/:id/tags', postController.addTag);
router.delete('/:id/tags/:tagId', postController.removeTag);
exports.default = router;
