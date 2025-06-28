import React from 'react';
import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Category } from '../../store/slices/categorySlice';

interface CategoryGridProps {
  categories: Category[];
  maxItems?: number;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ 
  categories, 
  maxItems = 8 
}) => {
  const navigate = useNavigate();

  const displayCategories = categories.slice(0, maxItems);

  const handleCategoryClick = (category: Category) => {
    navigate(`/category/${category.id}`, { 
      state: { categoryName: category.name } 
    });
  };

  return (
    <Grid container spacing={3}>
      {displayCategories.map((category) => (
        <Grid item xs={6} sm={4} md={3} key={category.id}>
          <Card
            sx={{
              height: '100%',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6,
              },
            }}
          >
            <CardActionArea
              onClick={() => handleCategoryClick(category)}
              sx={{ height: '100%' }}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 140,
                  textAlign: 'center',
                }}
              >
                {/* Category Icon */}
                <Box
                  sx={{
                    fontSize: '3rem',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: 'primary.light',
                    color: 'white',
                  }}
                >
                  {category.icon || '🍽️'}
                </Box>

                {/* Category Name */}
                <Typography
                  variant="h6"
                  component="h3"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    mb: 1,
                  }}
                >
                  {category.name}
                </Typography>

                {/* Product Count */}
                {category.productCount && (
                  <Chip
                    label={`${category.productCount} items`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}

                {/* Description */}
                {category.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    {category.description}
                  </Typography>
                )}
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CategoryGrid;