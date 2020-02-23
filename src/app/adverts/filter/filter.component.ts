import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AdvertFilter, getAdvertFilterFieldType} from '../advert';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-advert-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  @Input() filters;
  @Output() filtersChanged: EventEmitter<AdvertFilter> = new EventEmitter<AdvertFilter>();

  filterEntries: any;
  filterForm: FormGroup;

  panelActive = false;
  showSecondary = false;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.filterForm = this.formBuilder.group(
      {
        activeFilterKey: [''],
        activeFilterValue: [''],
        activeFilterSecondary: [''],
      });
    this.filterForm.setValidators(this.validateForm.bind(this));

    this.generateFilterEntries();
  }

  activatePanel() {
    this.panelActive = !this.panelActive;
  }

  generateFilterEntry(key, value) {
    const fieldType = getAdvertFilterFieldType(key);
    if (!value) {
      return [];
    }
    if (fieldType === 'number' || fieldType === 'array') {
      return [{key, value, secondary: undefined}];
    }
    if (fieldType === 'map') {
      return Object.entries(value)
      .filter(([, secondaryValue]) => secondaryValue)
      .map(([secondaryKey, secondaryValue]) => {
        return {key, secondary: secondaryKey, value: secondaryValue};
      });
    }
    return [];
  }

  generateFilterEntries() {
    this.filterEntries = [];
    for (const [key, value] of Object.entries(this.filters)) {
      for (const entry of this.generateFilterEntry(key, value)) {
        this.filterEntries.push(entry);
      }
    }
  }

  remove(key: string, secondary: string) {
    const fieldType = getAdvertFilterFieldType(key);
    if (fieldType === 'number' || fieldType === 'array') {
      this.filters[key] = undefined;
    }
    if (fieldType === 'map') {
      this.filters[key][secondary] = undefined;
    }
    this.filtersChanged.emit(this.filters);
    this.generateFilterEntries();
  }

  resetFormErrors() {
    this.filterForm.controls.activeFilterKey.markAsUntouched();
    this.filterForm.controls.activeFilterValue.markAsUntouched();
    this.filterForm.controls.activeFilterSecondary.markAsUntouched();

    this.filterForm.controls.activeFilterValue.setErrors(null);
    this.filterForm.controls.activeFilterKey.setErrors(null);
    this.filterForm.controls.activeFilterSecondary.setErrors(null);
  }

  validateForm() {
    if (!this.filterForm) {
      return;
    }

    this.resetFormErrors();

    const activeFilterKey = this.filterForm.controls.activeFilterKey;
    const activeFilterValue = this.filterForm.controls.activeFilterValue;

    const fieldType = getAdvertFilterFieldType(activeFilterKey.value);

    this.showSecondary = fieldType === 'map';

    if (fieldType === 'number' && isNaN(Number(activeFilterValue.value))) {
      activeFilterValue.setErrors({notNumber: true});
    }
    if (fieldType === 'array' && !activeFilterValue.value.trim()) {
      activeFilterValue.setErrors({valueBlank: true});
    }
    if (fieldType === 'map' && !activeFilterValue.value.trim()) {
      activeFilterValue.setErrors({valueBlank: true});
    }
    if (!fieldType) {
      activeFilterValue.setErrors({noFilterKey: true});
    }
  }

  getError() {
    const activeFilterValue = this.filterForm.controls.activeFilterValue;
    if (activeFilterValue.hasError('noFilterKey')) {
      return 'Filter type not selected';
    }
    if (activeFilterValue.hasError('notNumber')) {
      return 'Must be number';
    }
    if (activeFilterValue.hasError('valueBlank')) {
      return 'Cannot be blank';
    }
  }

  updateFilter() {
    const key = this.filterForm.controls.activeFilterKey.value;
    const value = this.filterForm.controls.activeFilterValue.value;
    const secondary = this.filterForm.controls.activeFilterSecondary.value;
    const fieldType = getAdvertFilterFieldType(key);

    if (fieldType === 'number') {
      this.filters[key] = Number(value);
    }
    if (fieldType === 'array') {
      if (!this.filters[key]) {
        this.filters[key] = [];
      }
      this.filters[key].push(value.trim());
    }
    if (fieldType === 'map') {
      if (!this.filters[key]) {
        this.filters[key] = {};
      }
      if (!this.filters[key][value]) {
        this.filters[key][value] = [];
      }
      if (secondary.trim()) {
        this.filters[key][value].push(secondary.trim());
      }
    }
  }

  add() {
    this.filterForm.updateValueAndValidity();

    if (!this.filterForm.invalid) {
      this.updateFilter();
      this.filtersChanged.emit(this.filters);
      this.generateFilterEntries();
    }
  }
}
