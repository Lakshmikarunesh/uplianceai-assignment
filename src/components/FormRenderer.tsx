import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  InputLabel,
  Checkbox,
  FormGroup,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import { FormField, FormData, ValidationError } from '../types/form';
import { updateDerivedFields } from '../utils/derivedFields';
import { validateForm } from '../utils/validation';

interface FormRendererProps {
  fields: FormField[];
  formData: FormData;
  onChange: (data: FormData) => void;
  onValidationChange?: (errors: ValidationError[]) => void;
  showValidation?: boolean;
}

const FormRenderer: React.FC<FormRendererProps> = ({
  fields,
  formData,
  onChange,
  onValidationChange,
  showValidation = false,
}) => {
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  useEffect(() => {
    const updatedData = updateDerivedFields(fields, formData);
    // Only update if there are actual changes to avoid infinite loops
    const hasChanges = Object.keys(updatedData).some(key => 
      updatedData[key] !== formData[key]
    );
    if (hasChanges) {
      onChange(updatedData);
    }
  }, [formData, fields, onChange]);

  useEffect(() => {
    if (showValidation) {
      const errors = validateForm(formData, fields);
      setValidationErrors(errors);
      onValidationChange?.(errors);
    }
  }, [formData, fields, showValidation]);

  const handleFieldChange = (fieldId: string, value: any) => {
    const newData = { ...formData, [fieldId]: value };
    onChange(newData);
  };

  const getFieldError = (fieldId: string): string | undefined => {
    return validationErrors.find(error => error.fieldId === fieldId)?.message;
  };

  const sortedFields = [...fields].sort((a, b) => a.order - b.order);

  const renderField = (field: FormField) => {
    const value = formData[field.id] || field.defaultValue || '';
    const error = showValidation ? getFieldError(field.id) : undefined;
    const isDisabled = field.derivedConfig?.isDerived || false;

    switch (field.type) {
      case 'text':
        return (
          <TextField
            fullWidth
            label={field.label}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.required}
            error={!!error}
            helperText={error}
            disabled={isDisabled}
            variant="outlined"
          />
        );

      case 'number':
        return (
          <TextField
            fullWidth
            label={field.label}
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.required}
            error={!!error}
            helperText={error}
            disabled={isDisabled}
            variant="outlined"
          />
        );

      case 'textarea':
        return (
          <TextField
            fullWidth
            label={field.label}
            multiline
            rows={4}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.required}
            error={!!error}
            helperText={error}
            disabled={isDisabled}
            variant="outlined"
          />
        );

      case 'select':
        return (
          <FormControl fullWidth error={!!error}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              label={field.label}
              disabled={isDisabled}
            >
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {error && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, mx: 1.75 }}>
                {error}
              </Typography>
            )}
          </FormControl>
        );

      case 'radio':
        return (
          <FormControl component="fieldset" error={!!error}>
            <FormLabel component="legend">{field.label}</FormLabel>
            <RadioGroup
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
            >
              {field.options?.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio disabled={isDisabled} />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
            {error && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                {error}
              </Typography>
            )}
          </FormControl>
        );

      case 'checkbox':
        return (
          <FormControl component="fieldset" error={!!error}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!value}
                    onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                    disabled={isDisabled}
                  />
                }
                label={field.label}
              />
            </FormGroup>
            {error && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                {error}
              </Typography>
            )}
          </FormControl>
        );

      case 'date':
        return (
          <TextField
            fullWidth
            label={field.label}
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.required}
            error={!!error}
            helperText={error}
            disabled={isDisabled}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
          />
        );

      default:
        return null;
    }
  };

  if (fields.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          No fields to display
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Add some fields to your form to see them here.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {sortedFields.map((field) => (
        <Box key={field.id}>
          {field.derivedConfig?.isDerived && (
            <Alert severity="info" sx={{ mb: 2 }}>
              This field is automatically calculated from other fields
            </Alert>
          )}
          {renderField(field)}
        </Box>
      ))}
    </Box>
  );
};

export default FormRenderer;