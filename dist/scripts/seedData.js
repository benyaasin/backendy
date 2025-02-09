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
const Category_1 = require("../models/Category");
const Post_1 = require("../models/Post");
const Comment_1 = require("../models/Comment");
const categories = [
    'Teknoloji',
    'Yazılım',
    'Seyahat',
    'Yemek',
    'Spor',
    'Müzik',
    'Sinema'
];
const generateRandomContent = (type) => {
    const titles = [
        'Harika Bir Makale',
        'Güncel Gelişmeler',
        'Keşfettiğim İpuçları',
        'Unutulmaz Anılar',
        'Teknoloji Dünyasından'
    ];
    const contents = [
        'Bu yazıda çok önemli konulara değineceğiz.',
        'Teknoloji hızla gelişirken, biz de ona ayak uydurmaya çalışıyoruz.',
        'Seyahat etmek, yeni kültürleri keşfetmek ne kadar güzel!',
        'Her gün yeni bir şeyler öğrenmenin heyecanını yaşıyoruz.'
    ];
    return type === 'title'
        ? titles[Math.floor(Math.random() * titles.length)]
        : contents[Math.floor(Math.random() * contents.length)];
};
function seedData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Kategorileri Oluştur
            for (const categoryName of categories) {
                yield Category_1.CategoryModel.create({ name: categoryName });
            }
            // Postları Oluştur
            for (let i = 1; i <= 20; i++) {
                const categoryId = Math.floor(Math.random() * categories.length) + 1;
                yield Post_1.PostModel.create({
                    category_id: categoryId,
                    title: generateRandomContent('title'),
                    content: generateRandomContent('content'),
                    published_at: new Date()
                });
            }
            // Yorumları Oluştur
            for (let i = 1; i <= 50; i++) {
                const postId = Math.floor(Math.random() * 20) + 1;
                yield Comment_1.CommentModel.create({
                    post_id: postId,
                    content: 'Harika bir yazı! 👏',
                    commenter_name: `Kullanıcı ${i}`
                });
            }
            console.log('Toplu veri ekleme başarılı! 🎉');
        }
        catch (error) {
            console.error('Veri ekleme sırasında hata:', error);
        }
    });
}
seedData();
