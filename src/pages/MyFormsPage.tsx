import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Preview,
  MoreVert,
  DateRange,
  Description,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { RootState } from '../store';
import { loadSavedForms, deleteForm } from '../store/slices/savedFormsSlice';
import { loadForm, createNewForm } from '../store/slices/formBuilderSlice';
import { FormSchema } from '../types/form';
import { loadFormsFromStorage, deleteFormFromStorage } from '../utils/localStorage';

const MyFormsPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { forms } = useSelector((state: RootState) => state.savedForms);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState<FormSchema | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<{
    element: HTMLElement;
    form: FormSchema;
  } | null>(null);

  useEffect(() => {
    // Load forms from localStorage on component mount
    const savedForms = loadFormsFromStorage();
    dispatch(loadSavedForms(savedForms));
  }, [dispatch]);

  const handleCreateNew = () => {
    dispatch(createNewForm());
    navigate('/create');
  };

  const handlePreviewForm = (form: FormSchema) => {
    dispatch(loadForm(form));
    navigate('/preview');
    setMenuAnchor(null);
  };

  const handleEditForm = (form: FormSchema) => {
    dispatch(loadForm(form));
    navigate('/create');
    setMenuAnchor(null);
  };

  const handleDeleteForm = (form: FormSchema) => {
    setFormToDelete(form);
    setDeleteDialogOpen(true);
    setMenuAnchor(null);
  };

  const confirmDelete = () => {
    if (formToDelete) {
      dispatch(deleteForm(formToDelete.id));
      deleteFormFromStorage(formToDelete.id);
      setDeleteDialogOpen(false);
      setFormToDelete(null);
    }
  };

  const openFormMenu = (event: React.MouseEvent<HTMLButtonElement>, form: FormSchema) => {
    setMenuAnchor({ element: event.currentTarget, form });
  };

  const closeFormMenu = () => {
    setMenuAnchor(null);
  };

  if (forms.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Description sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
          No Forms Created Yet
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
          Start building your first dynamic form with advanced validation, derived fields, and more.
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<Add />}
          onClick={handleCreateNew}
        >
          Create Your First Form
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            My Forms
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {forms.length} form{forms.length !== 1 ? 's' : ''} saved
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateNew}
        >
          Create New Form
        </Button>
      </Box>

      <Grid container spacing={3}>
        {forms.map((form) => (
          <Grid item xs={12} sm={6} lg={4} key={form.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', flex: 1 }}>
                    {form.name}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => openFormMenu(e, form)}
                  >
                    <MoreVert />
                  </IconButton>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Chip
                    label={`${form.fields.length} fields`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  {form.fields.some(f => f.required) && (
                    <Chip
                      label="Has required fields"
                      size="small"
                      color="error"
                      variant="outlined"
                    />
                  )}
                  {form.fields.some(f => f.derivedConfig?.isDerived) && (
                    <Chip
                      label="Has derived fields"
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  )}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', mb: 1 }}>
                  <DateRange sx={{ fontSize: 16, mr: 0.5 }} />
                  <Typography variant="caption">
                    Created: {format(new Date(form.createdAt), 'MMM dd, yyyy')}
                  </Typography>
                </Box>

                {form.updatedAt !== form.createdAt && (
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                    <Edit sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="caption">
                      Updated: {format(new Date(form.updatedAt), 'MMM dd, yyyy')}
                    </Typography>
                  </Box>
                )}
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  size="small"
                  startIcon={<Preview />}
                  onClick={() => handlePreviewForm(form)}
                >
                  Preview
                </Button>
                <Button
                  size="small"
                  startIcon={<Edit />}
                  onClick={() => handleEditForm(form)}
                >
                  Edit
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Form Context Menu */}
      <Menu
        anchorEl={menuAnchor?.element}
        open={!!menuAnchor}
        onClose={closeFormMenu}
      >
        <MenuItem onClick={() => menuAnchor && handlePreviewForm(menuAnchor.form)}>
          <Preview sx={{ mr: 1 }} /> Preview
        </MenuItem>
        <MenuItem onClick={() => menuAnchor && handleEditForm(menuAnchor.form)}>
          <Edit sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem
          onClick={() => menuAnchor && handleDeleteForm(menuAnchor.form)}
          sx={{ color: 'error.main' }}
        >
          <Delete sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Form</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone.
          </Alert>
          <Typography>
            Are you sure you want to delete "{formToDelete?.name}"? This will permanently
            remove the form and all its configuration.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete Form
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyFormsPage;