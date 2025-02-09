import React from 'react';
import { Typography, Grid, Card, CardContent, CardMedia, CardActionArea } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Hoş Geldiniz
      </Typography>
      
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Öne Çıkan Gönderiler
      </Typography>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardActionArea component={RouterLink} to="/posts/1">
              <CardMedia
                component="img"
                height="140"
                image="https://source.unsplash.com/random/800x600?technology"
                alt="Teknoloji"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  TypeScript ile Web Geliştirme
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  TypeScript, JavaScript'in üzerine inşa edilmiş güçlü bir programlama dilidir...
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardActionArea component={RouterLink} to="/posts/2">
              <CardMedia
                component="img"
                height="140"
                image="https://source.unsplash.com/random/800x600?artificial-intelligence"
                alt="Yapay Zeka"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Yapay Zeka ve Mobil Uygulamalar
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Yapay zeka teknolojileri mobil uygulama geliştirmede yeni ufuklar açıyor...
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardActionArea component={RouterLink} to="/posts/3">
              <CardMedia
                component="img"
                height="140"
                image="https://source.unsplash.com/random/800x600?space"
                alt="Uzay"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Mars'ta Yaşam İzleri
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  NASA'nın son keşifleri Mars'ta yaşam olasılığını güçlendiriyor...
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home; 