import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  // Önce veritabanını temizleyelim
  await prisma.comment.deleteMany();
  await prisma.postTag.deleteMany();
  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  // Kullanıcılar
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      username: 'admin',
      hashed_password: await argon2.hash('admin123'),
      role: 'admin'
    }
  });

  const moderatorUser = await prisma.user.create({
    data: {
      name: 'Moderator User',
      username: 'moderator',
      hashed_password: await argon2.hash('moderator123'),
      role: 'moderator'
    }
  });

  const memberUser = await prisma.user.create({
    data: {
      name: 'Member User',
      username: 'member',
      hashed_password: await argon2.hash('member123'),
      role: 'member'
    }
  });

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
      category: { connect: { id: techCategory.id } },
      user: { connect: { id: adminUser.id } },
      published_at: new Date(),
      post_tags: {
        create: [
          { tag_id: tags[1].id }
        ]
      }
    }
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'Yapay Zeka ve Mobil Uygulamalar',
      content: 'Yapay zeka teknolojileri mobil uygulama geliştirmede yeni ufuklar açıyor...',
      category: { connect: { id: techCategory.id } },
      user: { connect: { id: moderatorUser.id } },
      published_at: new Date(),
      post_tags: {
        create: [
          { tag_id: tags[0].id },
          { tag_id: tags[2].id }
        ]
      }
    }
  });

  const post3 = await prisma.post.create({
    data: {
      title: 'Mars\'ta Yaşam İzleri',
      content: 'NASA\'nın son keşifleri Mars\'ta yaşam olasılığını güçlendiriyor...',
      category: { connect: { id: scienceCategory.id } },
      user: { connect: { id: memberUser.id } },
      published_at: new Date(),
      post_tags: {
        create: [
          { tag_id: tags[3].id }
        ]
      }
    }
  });

  const post4 = await prisma.post.create({
    data: {
      title: 'Sağlıklı Yaşam İçin 10 İpucu',
      content: 'Sağlıklı bir yaşam için dikkat etmeniz gereken 10 önemli ipucu...',
      category: { connect: { id: healthCategory.id } },
      user: { connect: { id: memberUser.id } },
      published_at: new Date(),
      post_tags: {
        create: [
          { tag_id: tags[4].id },
          { tag_id: tags[5].id }
        ]
      }
    }
  });

  // Yorumlar
  await prisma.comment.create({
    data: {
      post: { connect: { id: post1.id } },
      user: { connect: { id: memberUser.id } },
      content: 'Harika bir yazı olmuş!',
      commenter_name: memberUser.name
    }
  });

  await prisma.comment.create({
    data: {
      post: { connect: { id: post2.id } },
      user: { connect: { id: adminUser.id } },
      content: 'Çok bilgilendirici, teşekkürler.',
      commenter_name: adminUser.name
    }
  });

  await prisma.comment.create({
    data: {
      post: { connect: { id: post3.id } },
      user: { connect: { id: moderatorUser.id } },
      content: 'Mars hakkında daha fazla bilgi edinmek isterim.',
      commenter_name: moderatorUser.name
    }
  });

  await prisma.comment.create({
    data: {
      post_id: post4.id,
      user_id: memberUser.id,
      content: 'Sağlık ipuçları için teşekkürler!',
      commenter_name: memberUser.name
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