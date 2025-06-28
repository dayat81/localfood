import React, { useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search as SearchIcon,
  Restaurant as RestaurantIcon,
  LocalOffer as OfferIcon,
  DeliveryDining as DeliveryIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchCategories } from '../store/slices/categorySlice';
import CategoryGrid from '../components/categories/CategoryGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch<AppDispatch>();
  
  const { items: categories, loading: categoriesLoading } = useSelector(
    (state: RootState) => state.categories
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const features = [
    {
      icon: <SearchIcon sx={{ fontSize: 40 }} />,
      title: 'Easy Search',
      description: 'Find your favorite restaurants and dishes with our smart search',
    },
    {
      icon: <RestaurantIcon sx={{ fontSize: 40 }} />,
      title: 'Local Restaurants',
      description: 'Discover amazing local restaurants in your neighborhood',
    },
    {
      icon: <DeliveryIcon sx={{ fontSize: 40 }} />,
      title: 'Fast Delivery',
      description: 'Get your food delivered hot and fresh to your doorstep',
    },
    {
      icon: <OfferIcon sx={{ fontSize: 40 }} />,
      title: 'Best Deals',
      description: 'Enjoy exclusive offers and discounts on your favorite meals',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: { xs: 6, md: 10 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                }}
              >
                Delicious Food
                <br />
                Delivered Fast
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  fontSize: { xs: '1rem', md: '1.25rem' },
                }}
              >
                Discover amazing local restaurants and order your favorite meals
                with ease. Fresh, fast, and delicious food delivered to your door.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  startIcon={<SearchIcon />}
                  onClick={() => navigate('/search')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                  }}
                >
                  Start Searching
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/products')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Browse Restaurants
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: { xs: 4, md: 0 },
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Delicious food"
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: '16px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Categories Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
            Browse by Category
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Find exactly what you're craving
          </Typography>
        </Box>

        {categoriesLoading ? (
          <LoadingSpinner message="Loading categories..." />
        ) : (
          <CategoryGrid categories={categories} />
        )}

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/products')}
          >
            View All Products
          </Button>
        </Box>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
              Why Choose LocalFood?
            </Typography>
            <Typography variant="h6" color="text.secondary">
              We make food ordering simple and enjoyable
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 2,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        color: 'primary.main',
                        mb: 2,
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: 'secondary.main',
          color: 'white',
          py: 8,
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
              Ready to Get Started?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join thousands of satisfied customers who trust LocalFood
              for their daily meals
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<RestaurantIcon />}
              onClick={() => navigate('/products')}
              sx={{
                px: 6,
                py: 2,
                fontSize: '1.2rem',
              }}
            >
              Order Now
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;