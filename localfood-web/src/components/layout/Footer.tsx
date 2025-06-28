import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
} from '@mui/icons-material';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
              🍕 LocalFood
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
              Discover amazing local restaurants and order your favorite meals
              with ease. Fresh, fast, and delicious food delivered to your door.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/" color="inherit" underline="hover">
                Home
              </Link>
              <Link href="/products" color="inherit" underline="hover">
                Products
              </Link>
              <Link href="/search" color="inherit" underline="hover">
                Search
              </Link>
              <Link href="/about" color="inherit" underline="hover">
                About Us
              </Link>
            </Box>
          </Grid>

          {/* Support */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom>
              Support
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/help" color="inherit" underline="hover">
                Help Center
              </Link>
              <Link href="/contact" color="inherit" underline="hover">
                Contact Us
              </Link>
              <Link href="/faq" color="inherit" underline="hover">
                FAQ
              </Link>
              <Link href="/delivery" color="inherit" underline="hover">
                Delivery Info
              </Link>
            </Box>
          </Grid>

          {/* Legal */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom>
              Legal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/privacy" color="inherit" underline="hover">
                Privacy Policy
              </Link>
              <Link href="/terms" color="inherit" underline="hover">
                Terms of Service
              </Link>
              <Link href="/cookies" color="inherit" underline="hover">
                Cookie Policy
              </Link>
            </Box>
          </Grid>

          {/* Social Media */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>
              Follow Us
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
              Stay connected for the latest updates and offers
            </Typography>
            <Box>
              <IconButton
                color="inherit"
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook />
              </IconButton>
              <IconButton
                color="inherit"
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter />
              </IconButton>
              <IconButton
                color="inherit"
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram />
              </IconButton>
              <IconButton
                color="inherit"
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, bgcolor: 'rgba(255, 255, 255, 0.2)' }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            © {currentYear} LocalFood. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Built with ❤️ for food lovers everywhere
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;