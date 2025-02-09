import { CategoryModel } from '../models/Category';
import { PostModel } from '../models/Post';
import { CommentModel } from '../models/Comment';

const categories = [
  'Teknoloji', 
  'Yazılım', 
  'Seyahat', 
  'Yemek', 
  'Spor', 
  'Müzik', 
  'Sinema'
];

const generateRandomContent = (type: 'title' | 'content') => {
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

async function seedData() {
  try {
    // Kategorileri Oluştur
    for (const categoryName of categories) {
      await CategoryModel.create({ name: categoryName });
    }

    // Postları Oluştur
    for (let i = 1; i <= 20; i++) {
      const categoryId = Math.floor(Math.random() * categories.length) + 1;
      await PostModel.create({
        category_id: categoryId,
        title: generateRandomContent('title'),
        content: generateRandomContent('content'),
        published_at: new Date()
      });
    }

    // Yorumları Oluştur
    for (let i = 1; i <= 50; i++) {
      const postId = Math.floor(Math.random() * 20) + 1;
      await CommentModel.create({
        post_id: postId,
        content: 'Harika bir yazı! 👏',
        commenter_name: `Kullanıcı ${i}`
      });
    }

    console.log('Toplu veri ekleme başarılı! 🎉');
  } catch (error) {
    console.error('Veri ekleme sırasında hata:', error);
  }
}

seedData(); 