import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../core/auth.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {RegisterComponent} from '../register/register.component';
import {ApiService} from '../../core/api.service';

@Component({
  selector: 'app-form',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loading = false;
  error = '';
  form: FormGroup;

  constructor(private api: ApiService, private router: Router, private formBuilder: FormBuilder, private dialog: MatDialog,private authService: AuthService) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: [''],
      password: [''],
    });
  }

  submit() {
    this.loading = true;

    this.api.post('/login', {
      email: this.form.controls.email.value,
      password: this.form.controls.password.value
    }).subscribe((authenticated: any) => {
        if (authenticated) {
          this.authService.setToken(authenticated.token);
          this.router.navigate(['/adverts']);
        }
      },
      (error) => {
        if (error.status === 401) {
          this.error = 'Invalid email or password';
        } else {
          this.error = 'A network error occured';
        }
        this.loading = false;
      });
  }

  showRegisterDialog() {
    this.dialog.open(RegisterComponent);
  }
}
