import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormField, FormSchema, ValidationRule } from '../../types/form';

interface FormBuilderState {
  currentForm: FormSchema | null;
  isEditing: boolean;
}

const initialState: FormBuilderState = {
  currentForm: null,
  isEditing: false,
};

const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    createNewForm: (state) => {
      state.currentForm = {
        id: Date.now().toString(),
        name: 'Untitled Form',
        fields: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.isEditing = true;
    },
    loadForm: (state, action: PayloadAction<FormSchema>) => {
      state.currentForm = action.payload;
      state.isEditing = true;
    },
    updateFormName: (state, action: PayloadAction<string>) => {
      if (state.currentForm) {
        state.currentForm.name = action.payload;
        state.currentForm.updatedAt = new Date().toISOString();
      }
    },
    addField: (state, action: PayloadAction<FormField>) => {
      if (state.currentForm) {
        state.currentForm.fields.push(action.payload);
        state.currentForm.updatedAt = new Date().toISOString();
      }
    },
    updateField: (state, action: PayloadAction<{ id: string; updates: Partial<FormField> }>) => {
      if (state.currentForm) {
        const fieldIndex = state.currentForm.fields.findIndex(f => f.id === action.payload.id);
        if (fieldIndex !== -1) {
          state.currentForm.fields[fieldIndex] = {
            ...state.currentForm.fields[fieldIndex],
            ...action.payload.updates,
          };
          state.currentForm.updatedAt = new Date().toISOString();
        }
      }
    },
    deleteField: (state, action: PayloadAction<string>) => {
      if (state.currentForm) {
        state.currentForm.fields = state.currentForm.fields.filter(f => f.id !== action.payload);
        state.currentForm.updatedAt = new Date().toISOString();
      }
    },
    reorderFields: (state, action: PayloadAction<FormField[]>) => {
      if (state.currentForm) {
        state.currentForm.fields = action.payload.map((field, index) => ({
          ...field,
          order: index,
        }));
        state.currentForm.updatedAt = new Date().toISOString();
      }
    },
    clearCurrentForm: (state) => {
      state.currentForm = null;
      state.isEditing = false;
    },
  },
});

export const {
  createNewForm,
  loadForm,
  updateFormName,
  addField,
  updateField,
  deleteField,
  reorderFields,
  clearCurrentForm,
} = formBuilderSlice.actions;

export default formBuilderSlice.reducer;