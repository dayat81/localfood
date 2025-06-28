import React from 'react';
import { Container, Typography } from '@mui/material';

const ProductsPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Products Page
      </Typography>
      <Typography variant="body1">
        Product listing implementation coming soon...
      </Typography>
    </Container>
  );
};

export default ProductsPage;