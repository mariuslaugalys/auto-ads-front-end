import {Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ApiService} from '../../core/api.service';
import {MatDialog} from '@angular/material';
import {CreateComponent} from '../../adverts/create/create.component';
import {RegisterComponent} from '../register/register.component';

@Component({
  selector: 'app-edit',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: any;
  error = '';
  form: FormGroup;

  constructor(private api: ApiService, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.updateProfileData();
  }

  updateProfileData(data ?: any) {
    this.api.get('/api/users').subscribe(
      (response: any) => {
        this.user = response;
      }
    );
  }

  showCreateDialog() {
    this.dialog.open(CreateComponent, {
      maxWidth: '750px',
      data: {
        onConfirm: this.updateProfileData.bind(this)
      }
    });
  }

  showEditProfileDialog() {
    this.dialog.open(RegisterComponent, {
      maxWidth: '750px',
      data: {
        user: this.user,
        onConfirm: this.updateProfileData.bind(this)
      }
    });
  }
}
