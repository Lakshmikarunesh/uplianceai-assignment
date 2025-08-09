import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  Snackbar,
} from '@mui/material';
import { Save, ArrowBack } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import { FormData, ValidationError } from '../types/form';
import FormRenderer from '../components/FormRenderer';

const FormPreviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentForm } = useSelector((state: RootState) => state.formBuilder);

  const [formData, setFormData] = useState<FormData>({});
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [showValidation, setShowValidation] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSubmit = () => {
    setShowValidation(true);
    
    // Simulate form submission
    setTimeout(() => {
      if (validationErrors.length === 0) {
        setSnackbarOpen(true);
        console.log('Form submitted:', formData);
      }
    }, 100);
  };

  const handleReset = () => {
    setFormData({});
    setShowValidation(false);
    setValidationErrors([]);
    
    // Reset to default values if they exist
    if (currentForm) {
      const defaultData: FormData = {};
      currentForm.fields.forEach(field => {
        if (field.defaultValue !== undefined) {
          defaultData[field.id] = field.defaultValue;
        }
      });
      setFormData(defaultData);
    }
  };

  if (!currentForm) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          No form to preview. Please create a form first.
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/create')}
        >
          Go to Form Builder
        </Button>
      </Box>
    );
  }

  if (currentForm.fields.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          This form has no fields to display.
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/create')}
        >
          Add Fields to Form
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {currentForm.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Form Preview • {currentForm.fields.length} fields
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/create')}
        >
          Back to Builder
        </Button>
      </Box>

      <Paper sx={{ p: 4 }}>
        <FormRenderer
          fields={currentForm.fields}
          formData={formData}
          onChange={setFormData}
          onValidationChange={setValidationErrors}
          showValidation={showValidation}
        />

        <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={handleReset}>
            Reset Form
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSubmit}
          >
            Submit Form
          </Button>
        </Box>

        {showValidation && validationErrors.length > 0 && (
          <Alert severity="error" sx={{ mt: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Please fix the following errors:
            </Typography>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {validationErrors.map((error, index) => (
                <li key={index}>{error.message}</li>
              ))}
            </ul>
          </Alert>
        )}

        {showValidation && validationErrors.length === 0 && (
          <Alert severity="success" sx={{ mt: 3 }}>
            Form is valid and ready to submit!
          </Alert>
        )}
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message="Form submitted successfully!"
      />
    </Box>
  );
};

export default FormPreviewPage;