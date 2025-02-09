import prisma from '../lib/prisma';
import * as bcrypt from 'bcryptjs';

async function seed() {
  try {
    // Kullanıcılar
    const adminPassword = await bcrypt.hash('admin123', 10);
    const moderatorPassword = await bcrypt.hash('moderator123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        username: 'admin',
        hashed_password: adminPassword,
        role: 'admin',
      },
    });

    const moderator = await prisma.user.create({
      data: {
        name: 'Moderator User',
        username: 'moderator',
        hashed_password: moderatorPassword,
        role: 'moderator',
      },
    });

    const user = await prisma.user.create({
      data: {
        name: 'Normal User',
        username: 'user',
        hashed_password: userPassword,
        role: 'member',
      },
    });

    // Kategoriler
    const technology = await prisma.category.create({
      data: {
        name: 'Teknoloji',
      },
    });

    const science = await prisma.category.create({
      data: {
        name: 'Bilim',
      },
    });

    const art = await prisma.category.create({
      data: {
        name: 'Sanat',
      },
    });

    // Gönderiler
    const post1 = await prisma.post.create({
      data: {
        title: 'Yapay Zeka ve Geleceğimiz',
        content: `Yapay zeka teknolojisi her geçen gün hayatımızın daha fazla alanına giriyor. 
        Özellikle makine öğrenimi ve derin öğrenme alanındaki gelişmeler, birçok sektörde devrim yaratıyor.
        
        Bu yazıda, yapay zekanın geleceğimizi nasıl şekillendireceğini ve bunun için nasıl hazırlanmamız gerektiğini ele alacağız.`,
        user_id: admin.id,
        category_id: technology.id,
        published_at: new Date(),
      },
    });

    const post2 = await prisma.post.create({
      data: {
        title: 'Mars'ta Yaşam İzleri',
        content: `NASA'nın Perseverance aracı, Mars'ta organik moleküller buldu! 
        Bu keşif, Kızıl Gezegen'de bir zamanlar yaşam olabileceğine dair en güçlü kanıtlardan biri.
        
        Peki bu buluş ne anlama geliyor ve gelecekteki Mars araştırmaları için ne gibi sonuçlar doğuracak?`,
        user_id: moderator.id,
        category_id: science.id,
        published_at: new Date(),
      },
    });

    const post3 = await prisma.post.create({
      data: {
        title: 'Modern Sanatın Yükselişi',
        content: `Dijital çağda sanat yeni bir boyut kazanıyor. NFT'ler, dijital enstalasyonlar ve sanal gerçeklik,
        sanat dünyasını baştan aşağı değiştiriyor.
        
        Bu yazıda modern sanatın geldiği noktayı ve geleceğini tartışacağız.`,
        user_id: user.id,
        category_id: art.id,
        published_at: new Date(),
      },
    });

    // Yorumlar
    await prisma.comment.create({
      data: {
        content: 'Harika bir yazı olmuş! Yapay zeka konusunda daha fazla içerik bekliyoruz.',
        user_id: user.id,
        post_id: post1.id,
      },
    });

    await prisma.comment.create({
      data: {
        content: 'Mars keşifleri gerçekten heyecan verici. Bu konuda daha detaylı bilgi paylaşabilir misiniz?',
        user_id: moderator.id,
        post_id: post2.id,
      },
    });

    await prisma.comment.create({
      data: {
        content: 'NFT'ler konusunda çok güzel bir bakış açısı sunmuşsunuz.',
        user_id: admin.id,
        post_id: post3.id,
      },
    });

    console.log('Seed data başarıyla oluşturuldu! 🌱');
  } catch (error) {
    console.error('Seed data oluşturulurken hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed(); 