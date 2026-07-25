import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import type { CustomApiError } from '../types/exception.type';

export const handleServerFormErrors = <T extends FieldValues>(
  error: CustomApiError,
  setError: UseFormSetError<T>
) => {
  if (error.details && typeof error.details === 'object') {
    Object.keys(error.details).forEach((field) => {
      const rawMessage = error.details[field];
      const message = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;

      setError(field as Path<T>, {
        type: 'server',
        message: message,
      });
    });
  }
};
