"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const tagRoutes_1 = __importDefault(require("./routes/tagRoutes"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(express_1.default.json());
// Routes
app.use('/categories', categoryRoutes_1.default);
app.use('/posts', postRoutes_1.default);
app.use('/comments', commentRoutes_1.default);
app.use('/tags', tagRoutes_1.default);
// 1. Kök dizin için route ekleyin
app.get('/', (req, res) => {
    res.json({ status: 'OK', message: 'Blog API is running' });
});
// 2. Static dosyaları servis etme (React/Vue/Angular kullanıyorsanız)
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Hata:', err);
    res.status(500).json({
        message: 'Sunucuda bir hata oluştu',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        message: 'Endpoint bulunamadı',
        path: req.path
    });
});
// Start server
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor 🚀`);
});
exports.default = app;
