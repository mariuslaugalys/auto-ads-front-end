import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UserRoutingModule} from './user-routing.module';
import {ProfileComponent} from './profile/profile.component';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatSelectModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ConfirmComponent} from './confirm/confirm.component';
import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';
import {AdvertsModule} from '../adverts/adverts.module';
import {CreateComponent} from '../adverts/create/create.component';


@NgModule({
  declarations: [ProfileComponent, ConfirmComponent, RegisterComponent, LoginComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatCardModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule,
    AdvertsModule
  ],
  entryComponents: [
    ConfirmComponent,
    CreateComponent,
    RegisterComponent
  ]
})
export class UserModule {
}
