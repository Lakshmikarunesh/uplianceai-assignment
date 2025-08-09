import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Container,
} from '@mui/material';
import { Add, Preview, List, Build } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Create Forms',
      description: 'Build dynamic forms with various field types, validation rules, and derived fields',
      icon: <Add sx={{ fontSize: 40 }} />,
      action: () => navigate('/create'),
      buttonText: 'Start Building',
      color: 'primary.main',
    },
    {
      title: 'Preview Forms',
      description: 'Test your forms as end users would see them with real-time validation',
      icon: <Preview sx={{ fontSize: 40 }} />,
      action: () => navigate('/preview'),
      buttonText: 'Preview Form',
      color: 'secondary.main',
    },
    {
      title: 'Manage Forms',
      description: 'View, edit, and organize all your saved forms in one place',
      icon: <List sx={{ fontSize: 40 }} />,
      action: () => navigate('/myforms'),
      buttonText: 'View Forms',
      color: 'success.main',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
          <Build sx={{ fontSize: 48, mr: 2, color: 'primary.main' }} />
          <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Dynamic Form Builder
          </Typography>
        </Box>
        
        <Typography variant="h5" color="textSecondary" sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}>
          Create powerful, interactive forms with advanced validation, derived fields, and seamless user experiences.
          Built for upliance.ai with React, TypeScript, Material UI, and Redux.
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ mb: 6 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 4 }}>
                <Box sx={{ color: feature.color, mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {feature.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  onClick={feature.action}
                  size="large"
                  sx={{
                    bgcolor: feature.color,
                    '&:hover': {
                      bgcolor: feature.color,
                      filter: 'brightness(0.9)',
                    },
                  }}
                >
                  {feature.buttonText}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ textAlign: 'center', py: 4, bgcolor: 'grey.50', borderRadius: 2 }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
          Key Features
        </Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {[
            'Multiple Field Types',
            'Advanced Validation',
            'Derived Fields',
            'Drag & Drop Reordering',
            'Real-time Preview',
            'Local Storage Persistence',
            'TypeScript Support',
            'Responsive Design',
          ].map((feature) => (
            <Grid item xs={6} sm={3} key={feature}>
              <Typography variant="body2" sx={{ 
                bgcolor: 'white',
                p: 1,
                borderRadius: 1,
                fontWeight: 'medium',
              }}>
                {feature}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage;