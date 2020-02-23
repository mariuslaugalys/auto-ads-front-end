import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../core/api.service';
import {Router} from '@angular/router';
import {
  getEmailValidationError,
  getMaximumLengthValidationError,
  getMinimumLengthValidationError,
  getPatternValidationError,
  getValueEmptyValidationError,
  mapResponseErrors
} from '../../util/validation.utils';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

const nameMinLength = 3;
const nameMaxLength = 50;
const passwordMinLength = 8;
const passwordMaxLength = 50;
const phoneMinLength = 8;
const phoneMaxLength = 15;

@Component({
  selector: 'app-form',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: any;
  onConfirm: any;

  loading = false;
  error = '';

  userForm: FormGroup;

  formErrors = {
    name: [
      getValueEmptyValidationError('name'),
      getPatternValidationError(`Can contain only uppercase lowercase letters and numbers`),
      getMinimumLengthValidationError(nameMinLength),
      getMaximumLengthValidationError(nameMaxLength)
    ],
    email: [
      getValueEmptyValidationError('email'),
      getEmailValidationError()
    ],
    password: [
      getValueEmptyValidationError('password'),
      getMinimumLengthValidationError(passwordMinLength),
      getMaximumLengthValidationError(passwordMaxLength),
    ],
    firstName: [
      getValueEmptyValidationError('first name'),
      getMinimumLengthValidationError(nameMinLength),
      getMaximumLengthValidationError(nameMaxLength),
      getPatternValidationError(`Can contain only uppercase lowercase letters`)
    ],
    lastName: [
      getValueEmptyValidationError('last name'),
      getMinimumLengthValidationError(nameMinLength),
      getMaximumLengthValidationError(nameMaxLength),
      getPatternValidationError(`Can contain only uppercase lowercase letters`)
    ],
    phone: [
      getValueEmptyValidationError('phone'),
      getMinimumLengthValidationError(phoneMinLength),
      getMaximumLengthValidationError(phoneMaxLength)
    ]
  };

  constructor(
    private api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<RegisterComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {

    this.userForm = formBuilder.group({
      name: ['', [
        Validators.required,
        Validators.minLength(nameMinLength),
        Validators.maxLength(nameMaxLength),
        Validators.pattern(/^[A-Z0-9a-z]+$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(passwordMinLength),
        Validators.maxLength(passwordMaxLength),
        Validators.pattern(/^[A-Z0-9a-z]+$/),
      ]],
      firstName: ['', [
        Validators.required,
        Validators.minLength(nameMinLength),
        Validators.maxLength(nameMaxLength),
        Validators.pattern(/^[A-Z0-9a-z]+$/),
      ]],
      lastName: ['', [
        Validators.required,
        Validators.minLength(nameMinLength),
        Validators.maxLength(nameMaxLength),
        Validators.pattern(/^[A-Z0-9a-z]+$/),
      ]],
      phone: ['', [
        Validators.required,
        Validators.minLength(phoneMinLength),
        Validators.maxLength(phoneMaxLength),
      ]]
    });

    if (!data) {
      return;
    }
    this.onConfirm = data.onConfirm;

    if (data.user) {
      this.user = data.user;
      this.userForm.setValue({
        name: this.user.name,
        email: this.user.email,
        password: '',
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        phone: this.user.phone
      });
    }
  }

  ngOnInit() {
  }

  getError(fieldName: string) {
    for (const error of this.formErrors[fieldName]) {
      if (this.userForm.controls[fieldName].hasError(error.validatorType)) {
        return error.message;
      }
    }
    return '';
  }

  errorResponseHandler(response) {
    this.loading = false;
    if (response.error.validationErrors) {
      mapResponseErrors(
        response.error.validationErrors,
        this.formErrors,
        'backend',
        this.userForm
      );
    } else {
      this.error = 'A network error occurred';
    }
  }

  submit() {
    this.error = '';
    if (this.userForm.status === 'VALID') {
      this.loading = true;

      let observable;

      if (this.user) {
        observable = this.api.put('/api/users', this.userForm.getRawValue());
      } else {
        observable = this.api.post('/api/users', this.userForm.getRawValue());
      }

      observable.subscribe(
        (response) => {
          if (this.onConfirm) {
            this.onConfirm(response);
          }
          this.dialogRef.close();
          this.loading = false;
        },
        this.errorResponseHandler.bind(this)
      );
    }
  }
}
