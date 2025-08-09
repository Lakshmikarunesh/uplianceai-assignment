import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Fab,
  Chip,
  Divider,
  Alert,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Save,
  DragIndicator,
  MoreVert,
  Preview,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import {
  createNewForm,
  updateFormName,
  addField,
  updateField,
  deleteField,
  reorderFields,
} from '../store/slices/formBuilderSlice';
import { saveForm } from '../store/slices/savedFormsSlice';
import { FormField } from '../types/form';
import { saveFormToStorage } from '../utils/localStorage';
import FieldEditor from '../components/FieldEditor';

// Install react-beautiful-dnd for drag and drop
const FormBuilderPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentForm } = useSelector((state: RootState) => state.formBuilder);

  const [fieldEditorOpen, setFieldEditorOpen] = useState(false);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [menuAnchor, setMenuAnchor] = useState<{
    element: HTMLElement;
    fieldId: string;
  } | null>(null);

  useEffect(() => {
    if (!currentForm) {
      dispatch(createNewForm());
    }
  }, [currentForm, dispatch]);

  useEffect(() => {
    if (currentForm) {
      setFormName(currentForm.name);
    }
  }, [currentForm]);

  const handleAddField = () => {
    setEditingField(null);
    setFieldEditorOpen(true);
  };

  const handleEditField = (field: FormField) => {
    setEditingField(field);
    setFieldEditorOpen(true);
    setMenuAnchor(null);
  };

  const handleSaveField = (field: FormField) => {
    if (editingField) {
      dispatch(updateField({ id: field.id, updates: field }));
    } else {
      const newField = {
        ...field,
        id: Date.now().toString(),
        order: currentForm?.fields.length || 0,
      };
      dispatch(addField(newField));
    }
    setFieldEditorOpen(false);
    setEditingField(null);
  };

  const handleDeleteField = (fieldId: string) => {
    dispatch(deleteField(fieldId));
    setMenuAnchor(null);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !currentForm) return;

    const fields = Array.from(currentForm.fields);
    const [reorderedField] = fields.splice(result.source.index, 1);
    fields.splice(result.destination.index, 0, reorderedField);

    dispatch(reorderFields(fields));
  };

  const handleSaveForm = () => {
    if (!currentForm || !formName.trim()) return;

    const formToSave = {
      ...currentForm,
      name: formName,
      updatedAt: new Date().toISOString(),
    };

    dispatch(saveForm(formToSave));
    saveFormToStorage(formToSave);
    setSaveDialogOpen(false);

    // Show success message or redirect
    alert('Form saved successfully!');
  };

  const handlePreview = () => {
    navigate('/preview');
  };

  const openFieldMenu = (event: React.MouseEvent<HTMLButtonElement>, fieldId: string) => {
    setMenuAnchor({ element: event.currentTarget, fieldId });
  };

  const closeFieldMenu = () => {
    setMenuAnchor(null);
  };

  if (!currentForm) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Form Builder
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Preview />}
            onClick={handlePreview}
            disabled={currentForm.fields.length === 0}
          >
            Preview
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={() => setSaveDialogOpen(true)}
            disabled={currentForm.fields.length === 0}
          >
            Save Form
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Form Configuration Panel */}
        <Paper sx={{ p: 3, minWidth: 350, height: 'fit-content' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Form Configuration
          </Typography>
          
          <TextField
            fullWidth
            label="Form Name"
            value={formName}
            onChange={(e) => {
              setFormName(e.target.value);
              dispatch(updateFormName(e.target.value));
            }}
            sx={{ mb: 2 }}
          />

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Fields ({currentForm.fields.length})
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={handleAddField}
              size="small"
            >
              Add Field
            </Button>
          </Box>

          {currentForm.fields.length === 0 ? (
            <Alert severity="info">
              No fields added yet. Click "Add Field" to get started.
            </Alert>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="fields">
                {(provided) => (
                  <List
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    dense
                    sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
                  >
                    {currentForm.fields.map((field, index) => (
                      <Draggable key={field.id} draggableId={field.id} index={index}>
                        {(provided, snapshot) => (
                          <ListItem
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            sx={{
                              bgcolor: snapshot.isDragging ? 'action.hover' : 'inherit',
                              mb: 1,
                              borderRadius: 1,
                              border: '1px solid',
                              borderColor: 'divider',
                            }}
                          >
                            <Box {...provided.dragHandleProps} sx={{ mr: 1 }}>
                              <DragIndicator />
                            </Box>
                            
                            <ListItemText
                              primary={field.label || 'Untitled Field'}
                              secondary={
                                <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                  <Chip label={field.type} size="small" variant="outlined" />
                                  {field.required && (
                                    <Chip label="Required" size="small" color="error" variant="outlined" />
                                  )}
                                  {field.derivedConfig?.isDerived && (
                                    <Chip label="Derived" size="small" color="secondary" variant="outlined" />
                                  )}
                                </Box>
                              }
                            />
                            
                            <ListItemSecondaryAction>
                              <IconButton
                                onClick={(e) => openFieldMenu(e, field.id)}
                                size="small"
                              >
                                <MoreVert />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </List>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </Paper>

        {/* Form Preview */}
        <Box sx={{ flexGrow: 1 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Form Preview
            </Typography>
            
            {currentForm.fields.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="textSecondary">
                  Your form is empty
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Add fields using the panel on the left to see them here.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {currentForm.fields.map((field) => (
                  <Box key={field.id} sx={{ p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                      {field.type.toUpperCase()} FIELD
                    </Typography>
                    <Typography variant="h6">
                      {field.label || 'Untitled Field'}
                    </Typography>
                    {field.required && (
                      <Typography variant="caption" color="error">
                        * Required
                      </Typography>
                    )}
                    {field.derivedConfig?.isDerived && (
                      <Typography variant="caption" color="secondary.main" sx={{ display: 'block' }}>
                        Derived from: {field.derivedConfig.parentFields.length} field(s)
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Box>
      </Box>

      {/* Add Field FAB */}
      <Fab
        color="primary"
        aria-label="add field"
        onClick={handleAddField}
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
      >
        <Add />
      </Fab>

      {/* Field Editor Dialog */}
      <FieldEditor
        field={editingField}
        open={fieldEditorOpen}
        onClose={() => {
          setFieldEditorOpen(false);
          setEditingField(null);
        }}
        onSave={handleSaveField}
        availableFields={currentForm.fields.filter(f => f.id !== editingField?.id)}
      />

      {/* Save Form Dialog */}
      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>Save Form</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Form Name"
            fullWidth
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveForm} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Field Context Menu */}
      <Menu
        anchorEl={menuAnchor?.element}
        open={!!menuAnchor}
        onClose={closeFieldMenu}
      >
        <MenuItem
          onClick={() => {
            const field = currentForm.fields.find(f => f.id === menuAnchor?.fieldId);
            if (field) handleEditField(field);
          }}
        >
          <Edit sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menuAnchor?.fieldId) {
              handleDeleteField(menuAnchor.fieldId);
            }
          }}
        >
          <Delete sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default FormBuilderPage;