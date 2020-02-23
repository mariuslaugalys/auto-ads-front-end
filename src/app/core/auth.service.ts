import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private static readonly key = 'token';

  public readonly tokenSubject: Subject<string> = new Subject<string>();

  constructor(private router: Router) {
  }

  authorizeRequest(source: Observable<object>): Observable<object> {
    return new Observable<object>((observer) => source.subscribe(
      (response) => observer.next(response),
      (error) => {
        if (error.status === 401) {
          this.clearToken();
          this.router.navigate(['/user/login']);
        }
        observer.error(error);
      }
    ));
  }

  clearToken() {
    sessionStorage.removeItem(AuthService.key);
    this.tokenSubject.next('');
  }

  setToken(token: any) {
    sessionStorage.setItem(AuthService.key, token);
    this.tokenSubject.next(token);
  }

  getToken() {
    return sessionStorage.getItem(AuthService.key);
  }
}
