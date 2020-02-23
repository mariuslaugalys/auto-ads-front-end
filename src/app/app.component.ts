import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from './core/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'auto-ads-fe';
  token = '';

  constructor(private router: Router, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.token = this.authService.getToken();
    this.authService.tokenSubject.subscribe((token) => this.token = token);
  }

  logOut() {
    this.authService.clearToken();
    this.router.navigate(['/user/login']);
  }
}
