import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-advert-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  advert: any;
  onConfirm: any;

  constructor(
    public dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
    this.advert = data.advert;
    this.onConfirm = data.onConfirm;
  }

  confirm(data: any) {
    this.onConfirm(data);
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
