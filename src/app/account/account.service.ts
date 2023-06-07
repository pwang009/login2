import { HttpClient } from '@angular/common/http';
import { EnvironmentInjector, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from '../shared/model/iuser';
import { environment } from 'src/environments.ts/environment';
import { map, tap } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import * as moment from "moment";
import { _isNumberValue } from '@angular/cdk/coercion';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<IUser>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  login(values: any) {
    return this.http.post(this.baseUrl + 'account/login', values)
      .pipe(tap(res => this.setSession));

    //   .pipe(
    //   map((user: IUser) => {
    //     if (user) {
    //       localStorage.setItem('token', user.token);
    //       this.currentUserSource.next(user);
    //     }
    //   })
    // );
  }

  private setSession(res: any) {
    if (res) {
      const expiresAt = moment().add(res.expiresIn, 'second');

      localStorage.setItem('token', res.idToken);
      localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
      this.currentUserSource.next(res);
    }
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    if (expiration) {
      const expiresAt = JSON.parse(expiration);
      return moment(expiresAt);
    }
    else return moment(0);
  }
}

