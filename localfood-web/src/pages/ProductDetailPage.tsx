import React from 'react';
import { Container, Typography } from '@mui/material';

const ProductDetailPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Product Detail Page
      </Typography>
      <Typography variant="body1">
        Product details implementation coming soon...
      </Typography>
    </Container>
  );
};

export default ProductDetailPage;