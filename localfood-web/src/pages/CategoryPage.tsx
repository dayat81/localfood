import React from 'react';
import { Container, Typography } from '@mui/material';

const CategoryPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Category Page
      </Typography>
      <Typography variant="body1">
        Category-specific products implementation coming soon...
      </Typography>
    </Container>
  );
};

export default CategoryPage;