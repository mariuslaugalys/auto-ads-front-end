import {FormGroup} from '@angular/forms';

interface ValidationError {
  validatorType: string;
  message: string;
}

interface Errors {
  [fieldName: string]: string[];
}

interface FieldValidationErrors {
  [fieldName: string]: ValidationError[];
}

export function getValidationError(
  validatorType: string,
  message: string
): ValidationError {
  return {validatorType, message};
}

export function getValueEmptyValidationError(
  fieldName: string
): ValidationError {
  return getValidationError('required', `You must enter a ${fieldName}`);
}

export function getChoiceEmptyValidationError(
  fieldName: string
): ValidationError {
  return getValidationError('required', `Please choose a ${fieldName}`);
}

export function getMinimumLengthValidationError(minLength: number) {
  return getValidationError('minlength', `Must be at least ${minLength} characters long`);
}

export function getMaximumLengthValidationError(maxLength: number) {
  return getValidationError('maxlength', `Must be at most ${maxLength} characters long`);
}

export function getValueMinimumValidationError(minValue: number) {
  return getValidationError('min', `Must be at least ${minValue}`);
}

export function getPatternValidationError(message: string) {
  return getValidationError('pattern', message);
}

export function getEmailValidationError() {
  return getValidationError('email', 'Must be a valid email');
}

export function mapResponseErrors(
  errors: Errors,
  formErrors: FieldValidationErrors,
  validatorType: string,
  formGroup: FormGroup
) {
  Object.entries(errors).forEach(([key, value]) => {
    const formError = formErrors[key].find(entry => entry.validatorType === validatorType);
    if (formError) {
      formError.message = value[0];
    } else {
      formErrors[key].push({validatorType, message: value[0]});
    }

    const existingErrors = {...formGroup.controls[key].errors};

    existingErrors[validatorType] = true;
    formGroup.controls[key].setErrors(existingErrors);
  });
}
