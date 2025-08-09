import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Add, Preview, List } from '@mui/icons-material';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: <Home /> },
    { path: '/create', label: 'Create', icon: <Add /> },
    { path: '/preview', label: 'Preview', icon: <Preview /> },
    { path: '/myforms', label: 'My Forms', icon: <List /> },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            upliance.ai Form Builder
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                startIcon={item.icon}
                onClick={() => navigate(item.path)}
                sx={{
                  bgcolor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;