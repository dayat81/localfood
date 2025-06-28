import React from 'react';
import { Container, Typography } from '@mui/material';

const SearchPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Search Page
      </Typography>
      <Typography variant="body1">
        Search functionality implementation coming soon...
      </Typography>
    </Container>
  );
};

export default SearchPage;