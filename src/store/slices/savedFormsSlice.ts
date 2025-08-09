import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormSchema } from '../../types/form';

interface SavedFormsState {
  forms: FormSchema[];
}

const initialState: SavedFormsState = {
  forms: [],
};

const savedFormsSlice = createSlice({
  name: 'savedForms',
  initialState,
  reducers: {
    loadSavedForms: (state, action: PayloadAction<FormSchema[]>) => {
      state.forms = action.payload;
    },
    saveForm: (state, action: PayloadAction<FormSchema>) => {
      const existingIndex = state.forms.findIndex(f => f.id === action.payload.id);
      if (existingIndex !== -1) {
        state.forms[existingIndex] = action.payload;
      } else {
        state.forms.push(action.payload);
      }
    },
    deleteForm: (state, action: PayloadAction<string>) => {
      state.forms = state.forms.filter(f => f.id !== action.payload);
    },
  },
});

export const { loadSavedForms, saveForm, deleteForm } = savedFormsSlice.actions;

export default savedFormsSlice.reducer;