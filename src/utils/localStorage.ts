import { FormSchema } from '../types/form';

const STORAGE_KEY = 'formBuilderForms';

export const loadFormsFromStorage = (): FormSchema[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading forms from localStorage:', error);
    return [];
  }
};

export const saveFormsToStorage = (forms: FormSchema[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(forms));
  } catch (error) {
    console.error('Error saving forms to localStorage:', error);
  }
};

export const saveFormToStorage = (form: FormSchema): void => {
  const forms = loadFormsFromStorage();
  const existingIndex = forms.findIndex(f => f.id === form.id);
  
  if (existingIndex !== -1) {
    forms[existingIndex] = form;
  } else {
    forms.push(form);
  }
  
  saveFormsToStorage(forms);
};

export const deleteFormFromStorage = (formId: string): void => {
  const forms = loadFormsFromStorage();
  const updatedForms = forms.filter(f => f.id !== formId);
  saveFormsToStorage(updatedForms);
};