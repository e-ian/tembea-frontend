import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUser } from '../shared/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authUrl = `${environment.tembeaBackEndUrl}/api/v1/auth/login/verify`;
  andelaAuthServiceToken;
  currentUser: IUser;
  isAuthenticated = false;
  isAuthorized = true;

  constructor(private http: HttpClient) {}

  login(): Observable<any> {
    const setHeaders: HttpHeaders = new HttpHeaders({
      Authorization: this.andelaAuthServiceToken
    });
    return this.http
      .get<any>(this.authUrl, { headers: setHeaders })
  }
}
