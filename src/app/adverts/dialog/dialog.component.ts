import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-advert-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  advert;

  constructor(@Inject(MAT_DIALOG_DATA) data) {
    this.advert = data.advert;
  }

  ngOnInit() {
  }
}
