import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../core/api.service';
import {Router} from '@angular/router';

import {
  getChoiceEmptyValidationError,
  getPatternValidationError,
  getValueEmptyValidationError,
  getValueMinimumValidationError,
  mapResponseErrors
} from '../../util/validation.utils';
import {DomSanitizer} from '@angular/platform-browser';

const priceMin = 1;
const volumeMin = 1;
const kilometersMin = 1;
const powerMin = 1;
const mYearMin = 1;

@Component({
  selector: 'app-advert-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  @Input() advert: any;
  @Output() submitSuccess: EventEmitter<any> = new EventEmitter<any>();

  loading = false;
  error = '';
  images = [];
  advertForm: FormGroup;

  formErrors = {
    manufacturer: [getValueEmptyValidationError('manufacturer')],
    model: [getChoiceEmptyValidationError('model')],
    chassisType: [getChoiceEmptyValidationError('chassis type')],
    transmissionType: [getChoiceEmptyValidationError('transmission type')],
    driveType: [getChoiceEmptyValidationError('drive type')],
    fuelType: [getChoiceEmptyValidationError('fuel type')],
    manufactureYear: [
      getValueEmptyValidationError('manufacture year'),
      getValueMinimumValidationError(mYearMin)
    ],
    price: [
      getValueEmptyValidationError('price'),
      getValueMinimumValidationError(priceMin)
    ],
    kilometers: [
      getValueEmptyValidationError('value'),
      getValueMinimumValidationError(kilometersMin)
    ],
    power: [
      getValueEmptyValidationError('value'),
      getValueMinimumValidationError(powerMin)
    ],
    volume: [
      getValueEmptyValidationError('value'),
      getValueMinimumValidationError(volumeMin)
    ],
    color: [
      getValueEmptyValidationError('color'),
      getPatternValidationError(
        'Can contain only uppercase and lowercase letters'
      )
    ]
  };

  constructor(private api: ApiService, private router: Router, private sanitizer: DomSanitizer, private formBuilder: FormBuilder) {
    this.advertForm = formBuilder.group(
      {
        manufacturer: ['', [Validators.required]],
        manufactureYear: ['', [Validators.required, Validators.min(mYearMin)]],
        model: ['', [Validators.required]],
        chassisType: ['', [Validators.required]],
        transmissionType: ['', [Validators.required]],
        driveType: ['', [Validators.required]],
        fuelType: ['', [Validators.required]],
        price: ['', [Validators.required, Validators.min(priceMin)]],
        kilometers: ['', [Validators.required, Validators.min(kilometersMin)]],
        power: ['', [Validators.required, Validators.min(powerMin)]],
        volume: ['', [Validators.required, Validators.min(volumeMin)]],
        color: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]]
      }
    );
  }

  ngOnInit() {
    if (this.advert) {
      this.advertForm.setValue({
        manufacturer: this.advert.manufacturer,
        manufactureYear: this.advert.manufactureYear,
        model: this.advert.model,
        chassisType: this.advert.chassisType,
        transmissionType: this.advert.transmissionType,
        driveType: this.advert.driveType,
        fuelType: this.advert.fuelType,
        price: this.advert.price,
        kilometers: this.advert.kilometers,
        power: this.advert.power,
        volume: this.advert.volume,
        color: this.advert.color,
      });

      this.advert.images.forEach((url: any) => {
        const fileName = url.split('/').pop();
        this.api.getBlob('/images/' + fileName).subscribe(
          (imageBlob: any) => {
            imageBlob.lastModifiedDate = new Date();
            imageBlob.name = fileName;
            this.images.push({
              file: imageBlob,
              url: this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(imageBlob))
            });
          }
        );
      });
    }
  }

  getError(fieldName: string) {
    for (const error of this.formErrors[fieldName]) {
      if (this.advertForm.controls[fieldName].hasError(error.validatorType)) {
        return error.message;
      }
    }
    return '';
  }

  errorResponseHandler(response) {
    this.loading = false;
    if (response.error && response.error.validationErrors) {
      mapResponseErrors(
        response.error.validationErrors,
        this.formErrors,
        'backend',
        this.advertForm
      );
    } else {
      this.error = 'A network error occurred';
    }
  }

  submit() {
    this.error = '';

    if (this.advertForm.status === 'VALID') {
      this.loading = true;

      const formData = new FormData();
      this.images.forEach(({file}) => {
        formData.append('file', file, file.name);
      });

      Object.entries(this.advertForm.getRawValue()).forEach(([key, value]) => {
        // @ts-ignore
        formData.append(key, value);
      });

      let observable;

      if (this.advert) {
        observable = this.api.putFormData(`/api/adverts/${this.advert.id}`, formData);
      } else {
        observable = this.api.postFormData('/api/adverts', formData);
      }

      observable.subscribe(
        (response) => {
          this.loading = false;
          this.submitSuccess.emit(response);
        },
        this.errorResponseHandler.bind(this)
      );
    }
  }

  onDrop(event) {
    event.preventDefault();
    for (const file of event.dataTransfer.files) {
      this.images.push({
        file,
        url: this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file))
      });
    }
  }

  onDragOver(event) {
    event.preventDefault();
  }

  moveImage(image: any, up: boolean) {
    const index = this.images.indexOf(image);
    if (up && index >= 0) {
      this.images.splice(index, 1);
      this.images.splice(index - 1, 0, image);
    }
    if (!up && index < this.images.length - 1) {
      this.images.splice(index, 1);
      this.images.splice(index + 1, 0, image);
    }
  }

  clearImage(image: any) {
    const index = this.images.indexOf(image);
    this.images.splice(index, 1);
  }
}
