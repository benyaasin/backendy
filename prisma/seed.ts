import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Önce veritabanını temizleyelim
  await prisma.comment.deleteMany();
  await prisma.postTag.deleteMany();
  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();

  // Kategoriler
  const techCategory = await prisma.category.create({
    data: {
      name: 'Teknoloji'
    }
  });

  const scienceCategory = await prisma.category.create({
    data: {
      name: 'Bilim'
    }
  });

  const healthCategory = await prisma.category.create({
    data: {
      name: 'Sağlık'
    }
  });

  // Etiketler
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { name: 'Yapay Zeka' },
      update: {},
      create: { name: 'Yapay Zeka' }
    }),
    prisma.tag.upsert({
      where: { name: 'Web Geliştirme' },
      update: {},
      create: { name: 'Web Geliştirme' }
    }),
    prisma.tag.upsert({
      where: { name: 'Mobil' },
      update: {},
      create: { name: 'Mobil' }
    }),
    prisma.tag.upsert({
      where: { name: 'Uzay' },
      update: {},
      create: { name: 'Uzay' }
    }),
    prisma.tag.upsert({
      where: { name: 'Sağlık' },
      update: {},
      create: { name: 'Sağlık' }
    }),
    prisma.tag.upsert({
      where: { name: 'Yenilik' },
      update: {},
      create: { name: 'Yenilik' }
    })
  ]);

  // Gönderiler
  const post1 = await prisma.post.create({
    data: {
      title: 'TypeScript ile Web Geliştirme',
      content: 'TypeScript, JavaScript\'in üzerine inşa edilmiş güçlü bir programlama dilidir...',
      category_id: techCategory.id,
      published_at: new Date(),
      post_tags: {
        create: [
          { tag_id: tags[1].id }, // Web Geliştirme
        ]
      }
    }
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'Yapay Zeka ve Mobil Uygulamalar',
      content: 'Yapay zeka teknolojileri mobil uygulama geliştirmede yeni ufuklar açıyor...',
      category_id: techCategory.id,
      published_at: new Date(),
      post_tags: {
        create: [
          { tag_id: tags[0].id }, // Yapay Zeka
          { tag_id: tags[2].id }  // Mobil
        ]
      }
    }
  });

  const post3 = await prisma.post.create({
    data: {
      title: 'Mars\'ta Yaşam İzleri',
      content: 'NASA\'nın son keşifleri Mars\'ta yaşam olasılığını güçlendiriyor...',
      category_id: scienceCategory.id,
      published_at: new Date(),
      post_tags: {
        create: [
          { tag_id: tags[3].id }, // Uzay
        ]
      }
    }
  });

  const post4 = await prisma.post.create({
    data: {
      title: 'Sağlıklı Yaşam İçin 10 İpucu',
      content: 'Sağlıklı bir yaşam için dikkat etmeniz gereken 10 önemli ipucu...',
      category_id: healthCategory.id,
      published_at: new Date(),
      post_tags: {
        create: [
          { tag_id: tags[4].id }, // Sağlık
          { tag_id: tags[5].id }  // Yenilik
        ]
      }
    }
  });

  // Yorumlar
  await prisma.comment.create({
    data: {
      post_id: post1.id,
      content: 'Harika bir yazı olmuş!',
      commenter_name: 'Ahmet'
    }
  });

  await prisma.comment.create({
    data: {
      post_id: post2.id,
      content: 'Çok bilgilendirici, teşekkürler.',
      commenter_name: 'Mehmet'
    }
  });

  await prisma.comment.create({
    data: {
      post_id: post3.id,
      content: 'Mars hakkında daha fazla bilgi edinmek isterim.',
      commenter_name: 'Elif'
    }
  });

  await prisma.comment.create({
    data: {
      post_id: post4.id,
      content: 'Sağlık ipuçları için teşekkürler!',
      commenter_name: 'Zeynep'
    }
  });

  console.log('Örnek veriler başarıyla oluşturuldu! 🌱');
}

main()
  .catch((e) => {
    console.error('Hata:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 