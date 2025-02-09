"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TagController_1 = require("../controllers/TagController");
const router = (0, express_1.Router)();
const tagController = new TagController_1.TagController();
router.post('/', tagController.create);
router.get('/', tagController.findAll);
router.get('/:id', tagController.findById);
router.patch('/:id', tagController.update);
router.delete('/:id', tagController.delete);
exports.default = router;
