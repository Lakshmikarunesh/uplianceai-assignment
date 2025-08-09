import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  Chip,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import { ExpandMore, Add, Delete } from '@mui/icons-material';
import { FormField, FieldType, ValidationRule, SelectOption } from '../types/form';

interface FieldEditorProps {
  field: FormField | null;
  open: boolean;
  onClose: () => void;
  onSave: (field: FormField) => void;
  availableFields: FormField[];
}

const FieldEditor: React.FC<FieldEditorProps> = ({
  field,
  open,
  onClose,
  onSave,
  availableFields,
}) => {
  const [editedField, setEditedField] = useState<FormField>(() => 
    field || {
      id: Date.now().toString(),
      type: 'text',
      label: '',
      required: false,
      validationRules: [],
      order: 0,
      derivedConfig: {
        isDerived: false,
        parentFields: [],
        computationType: 'concat',
      },
    }
  );

  const [newOption, setNewOption] = useState({ label: '', value: '' });
  const [validationRule, setValidationRule] = useState<{ type: string; value: string }>({
    type: 'required',
    value: '',
  });

  // Reset form when field prop changes
  React.useEffect(() => {
    if (field) {
      setEditedField(field);
    } else if (open) {
      // Reset to default when opening for new field
      setEditedField({
        id: Date.now().toString(),
        type: 'text',
        label: '',
        required: false,
        validationRules: [],
        order: 0,
        derivedConfig: {
          isDerived: false,
          parentFields: [],
          computationType: 'concat',
        },
      });
    }
  }, [field, open]);

  const handleSave = () => {
    if (!editedField.label.trim()) return;
    
    onSave({
      ...editedField,
      options: ['select', 'radio'].includes(editedField.type) ? editedField.options || [] : undefined,
    });
    onClose();
  };

  const addOption = () => {
    if (!newOption.label || !newOption.value) return;
    
    setEditedField(prev => ({
      ...prev,
      options: [...(prev.options || []), newOption],
    }));
    setNewOption({ label: '', value: '' });
  };

  const removeOption = (index: number) => {
    setEditedField(prev => ({
      ...prev,
      options: prev.options?.filter((_, i) => i !== index) || [],
    }));
  };

  const addValidationRule = () => {
    const rule: ValidationRule = { type: validationRule.type } as ValidationRule;
    
    if (['minLength', 'maxLength'].includes(validationRule.type) && validationRule.value) {
      (rule as any).value = parseInt(validationRule.value);
    }

    if (!editedField.validationRules.some(r => r.type === rule.type)) {
      setEditedField(prev => ({
        ...prev,
        validationRules: [...prev.validationRules, rule],
      }));
    }
  };

  const removeValidationRule = (index: number) => {
    setEditedField(prev => ({
      ...prev,
      validationRules: prev.validationRules.filter((_, i) => i !== index),
    }));
  };

  const toggleParentField = (fieldId: string) => {
    const currentParents = editedField.derivedConfig?.parentFields || [];
    const newParents = currentParents.includes(fieldId)
      ? currentParents.filter(id => id !== fieldId)
      : [...currentParents, fieldId];

    setEditedField(prev => ({
      ...prev,
      derivedConfig: {
        ...prev.derivedConfig!,
        parentFields: newParents,
      },
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {field ? 'Edit Field' : 'Add New Field'}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {/* Basic Field Configuration */}
          <TextField
            label="Field Label"
            value={editedField.label}
            onChange={(e) => setEditedField(prev => ({ ...prev, label: e.target.value }))}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Field Type</InputLabel>
            <Select
              value={editedField.type}
              onChange={(e) => setEditedField(prev => ({ 
                ...prev, 
                type: e.target.value as FieldType,
                options: ['select', 'radio'].includes(e.target.value) ? [] : undefined,
              }))}
            >
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="number">Number</MenuItem>
              <MenuItem value="textarea">Textarea</MenuItem>
              <MenuItem value="select">Select</MenuItem>
              <MenuItem value="radio">Radio</MenuItem>
              <MenuItem value="checkbox">Checkbox</MenuItem>
              <MenuItem value="date">Date</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={editedField.required}
                onChange={(e) => setEditedField(prev => ({ ...prev, required: e.target.checked }))}
              />
            }
            label="Required Field"
          />

          {/* Options for Select/Radio fields */}
          {['select', 'radio'].includes(editedField.type) && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>Options ({editedField.options?.length || 0})</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      label="Option Label"
                      value={newOption.label}
                      onChange={(e) => setNewOption(prev => ({ ...prev, label: e.target.value }))}
                      size="small"
                    />
                    <TextField
                      label="Option Value"
                      value={newOption.value}
                      onChange={(e) => setNewOption(prev => ({ ...prev, value: e.target.value }))}
                      size="small"
                    />
                    <Button onClick={addOption} variant="outlined" startIcon={<Add />}>
                      Add
                    </Button>
                  </Box>
                  
                  <List dense>
                    {editedField.options?.map((option, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={option.label}
                          secondary={option.value}
                        />
                        <ListItemSecondaryAction>
                          <IconButton onClick={() => removeOption(index)} size="small">
                            <Delete />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Validation Rules */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>Validation Rules ({editedField.validationRules.length})</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <Select
                      value={validationRule.type}
                      onChange={(e) => setValidationRule(prev => ({ ...prev, type: e.target.value }))}
                    >
                      <MenuItem value="required">Required</MenuItem>
                      <MenuItem value="minLength">Min Length</MenuItem>
                      <MenuItem value="maxLength">Max Length</MenuItem>
                      <MenuItem value="email">Email Format</MenuItem>
                      <MenuItem value="password">Password</MenuItem>
                    </Select>
                  </FormControl>
                  
                  {['minLength', 'maxLength'].includes(validationRule.type) && (
                    <TextField
                      label="Value"
                      type="number"
                      value={validationRule.value}
                      onChange={(e) => setValidationRule(prev => ({ ...prev, value: e.target.value }))}
                      size="small"
                      sx={{ width: 100 }}
                    />
                  )}
                  
                  <Button onClick={addValidationRule} variant="outlined" startIcon={<Add />}>
                    Add Rule
                  </Button>
                </Box>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {editedField.validationRules.map((rule, index) => (
                    <Chip
                      key={index}
                      label={
                        rule.type === 'minLength' || rule.type === 'maxLength'
                          ? `${rule.type}: ${(rule as any).value}`
                          : rule.type
                      }
                      onDelete={() => removeValidationRule(index)}
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Derived Fields */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>Derived Field Configuration</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editedField.derivedConfig?.isDerived || false}
                      onChange={(e) => setEditedField(prev => ({
                        ...prev,
                        derivedConfig: {
                          ...prev.derivedConfig!,
                          isDerived: e.target.checked,
                        },
                      }))}
                    />
                  }
                  label="This is a derived field"
                />

                {editedField.derivedConfig?.isDerived && (
                  <>
                    <Typography variant="subtitle2">Select Parent Fields:</Typography>
                    <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                      {availableFields
                        .filter(f => f.id !== editedField.id && !f.derivedConfig?.isDerived)
                        .map(parentField => (
                          <FormControlLabel
                            key={parentField.id}
                            control={
                              <Checkbox
                                checked={editedField.derivedConfig?.parentFields.includes(parentField.id) || false}
                                onChange={() => toggleParentField(parentField.id)}
                              />
                            }
                            label={parentField.label || 'Untitled Field'}
                          />
                        ))}
                    </Box>

                    <FormControl fullWidth>
                      <InputLabel>Computation Type</InputLabel>
                      <Select
                        value={editedField.derivedConfig?.computationType || 'concat'}
                        onChange={(e) => setEditedField(prev => ({
                          ...prev,
                          derivedConfig: {
                            ...prev.derivedConfig!,
                            computationType: e.target.value as any,
                          },
                        }))}
                      >
                        <MenuItem value="age">Calculate Age from Date</MenuItem>
                        <MenuItem value="sum">Sum of Numbers</MenuItem>
                        <MenuItem value="concat">Concatenate Text</MenuItem>
                        <MenuItem value="custom">Custom Logic</MenuItem>
                      </Select>
                    </FormControl>

                    {editedField.derivedConfig?.computationType === 'custom' && (
                      <TextField
                        label="Custom Logic (JavaScript)"
                        multiline
                        rows={3}
                        value={editedField.derivedConfig?.customLogic || ''}
                        onChange={(e) => setEditedField(prev => ({
                          ...prev,
                          derivedConfig: {
                            ...prev.derivedConfig!,
                            customLogic: e.target.value,
                          },
                        }))}
                        placeholder="return values[0] + values[1];"
                      />
                    )}
                  </>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save Field
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FieldEditor;