import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ApiService} from '../../core/api.service';
import {MatDialog} from '@angular/material/dialog';
import {DialogComponent} from '../dialog/dialog.component';
import {AdvertFilter} from '../advert';
import {ConfirmComponent} from '../../user/confirm/confirm.component';
import {EditComponent} from '../edit/edit.component';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  @Input() adverts: any[] = [];
  @Input() ownerView = false;

  @Output() updateList: EventEmitter<any> = new EventEmitter<any>();

  filters: AdvertFilter = {
    manufacturersModels: undefined,
    colors: undefined,
    driveTypes: undefined,
    chassisTypes: undefined,
    transmissionTypes: undefined,
    fuelTypes: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    minManufactureYear: undefined,
    maxManufactureYear: undefined,
    minPower: undefined,
    maxPower: undefined,
    minKilometers: undefined,
    maxKilometers: undefined,
    minVolume: undefined,
    maxVolume: undefined
  };

  setFilter(filters: AdvertFilter) {
    this.filters = filters;
    this.api.post('/api/adverts/search', this.filters).subscribe(
      (response: any[]) => {
        this.adverts = response;
      }
    );
  }

  constructor(private api: ApiService, public dialog: MatDialog) {
  }

  ngOnInit() {
    if (!this.ownerView) {
      this.api.get('/api/adverts').subscribe(
        (response: any[]) => {
          this.adverts = response;
        }
      );
    }
  }

  showAdvertDialog(advert) {
    this.dialog.open(DialogComponent, {
      width: '110vh',
      data: {
        advert
      }
    });
  }

  showConfirmDeleteDialog(advert) {
    this.dialog.open(ConfirmComponent, {
      data: {
        onConfirm: () => {
          this.deleteAdvert(advert);
        },
        message: 'Are you sure you want to remove this advert?'
      }
    });
  }

  deleteAdvert(advert) {
    this.api.delete(`/api/adverts/${advert.id}`).subscribe(
      (response) => {
        this.updateList.emit(advert);
      }
    );

  }

  showEditAdvertDialog(advert) {
    this.dialog.open(EditComponent, {
      maxWidth: '750px',
      data: {
        advert,
        onConfirm: this.editAdvertConfirmed.bind(this)
      }
    });
  }

  editAdvertConfirmed(advert) {
    this.updateList.emit(advert);
  }
}
