import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {AuthService} from './auth.service';
import {environment} from '../../environments/environment';

interface Headers {
  [fieldName: string]: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private readonly urlPrefix = environment.hostUrl;

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {
  }

  addAuthorizationHeader(headers: Headers) {
    const token = this.authService.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  get(url: string) {
    const headers: Headers = {};
    this.addAuthorizationHeader(headers);
    return this.authService.authorizeRequest(
      this.http.get(this.urlPrefix + url, {headers})
    );
  }

  post(url: string, data: object) {
    const headers: Headers = {};
    this.addAuthorizationHeader(headers);
    headers['Content-Type'] = 'application/json';

    return this.authService.authorizeRequest(
      this.http.post(this.urlPrefix + url, data, {headers})
    );
  }

  put(url: string, data: object) {
    const headers: Headers = {};
    this.addAuthorizationHeader(headers);
    headers['Content-Type'] = 'application/json';
    return this.authService.authorizeRequest(
      this.http.put(this.urlPrefix + url, data, {headers})
    );
  }

  delete(url: string) {
    const headers: Headers = {};
    this.addAuthorizationHeader(headers);
    return this.authService.authorizeRequest(
      this.http.delete(`${this.urlPrefix}${url}`, {headers})
    );
  }

  postFormData(url: string, formData: FormData) {
    const headers: Headers = {};
    this.addAuthorizationHeader(headers);
    return this.authService.authorizeRequest(
      this.http.post(this.urlPrefix + url, formData, {headers})
    );
  }

  getBlob(url: string) {
    const headers: Headers = {};
    this.addAuthorizationHeader(headers);
    return this.authService.authorizeRequest(
      this.http.get(this.urlPrefix + url, {headers, responseType: 'blob'})
    );
  }

  putFormData(url: string, formData: FormData) {
    const headers: Headers = {};
    this.addAuthorizationHeader(headers);
    return this.authService.authorizeRequest(
      this.http.put(this.urlPrefix + url, formData, {headers})
    );
  }
}
