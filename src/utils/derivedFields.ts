import { FormField, FormData } from '../types/form';
import { differenceInYears, parseISO } from 'date-fns';

export const calculateDerivedValue = (
  field: FormField,
  formData: FormData
): any => {
  if (!field.derivedConfig?.isDerived) return undefined;

  const { parentFields, computationType, customLogic } = field.derivedConfig;
  const parentValues = parentFields.map(id => formData[id]).filter(val => val !== undefined);

  if (parentValues.length === 0) return '';

  switch (computationType) {
    case 'age':
      if (parentValues[0]) {
        try {
          const birthDate = parseISO(parentValues[0]);
          return differenceInYears(new Date(), birthDate);
        } catch {
          return '';
        }
      }
      return '';

    case 'sum':
      return parentValues.reduce((sum, val) => sum + (parseFloat(val) || 0), 0);

    case 'concat':
      return parentValues.join(' ');

    case 'custom':
      try {
        // Simple custom logic evaluation (in production, you'd want a safer approach)
        const func = new Function('values', customLogic || 'return "";');
        return func(parentValues);
      } catch {
        return '';
      }

    default:
      return '';
  }
};

export const updateDerivedFields = (
  fields: FormField[],
  formData: FormData
): FormData => {
  const updatedData = { ...formData };
  
  fields
    .filter(field => field.derivedConfig?.isDerived)
    .forEach(field => {
      updatedData[field.id] = calculateDerivedValue(field, updatedData);
    });

  return updatedData;
};