import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-advert-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  onConfirm: any;

  constructor(
    public dialogRef: MatDialogRef<CreateComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
    this.onConfirm = data.onConfirm;
  }

  confirm(data: any) {
    this.onConfirm(data);
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
