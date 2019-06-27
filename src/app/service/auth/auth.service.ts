import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginModel } from 'src/app/model/login.model';
import { LocalStorageService } from '../local-storage/local-storage.service';


@Injectable()
export class AuthService {


  private baseUrl: string = 'http://192.168.0.7/khulasa-news-panel/';

  /** return true if user is logged in else returns false */
  public get isLoggedIn(): boolean {
    const token = this.token;
    if (token) {
      return true;
    } else {
      return false;
    }
  }


  /** Get token */
  public get token(): string {
    const token = localStorage.getItem(btoa('token'));
    if (token) {
      return token;
    } else {
      return null;
    }
  }


  // store the URL so we can redirect after logging in
  redirectUrl: string = '/dashboard';

  constructor(
    private http: HttpClient,
    private route: Router,
    private localStSvc: LocalStorageService
  ) {

  }


  login(loginCredentials: LoginModel): Promise<boolean> {
    return new Promise((res, rej) => {
      this.http.post(this.baseUrl + 'login.php', JSON.stringify(loginCredentials)).subscribe(
        (resp: any) => {
          if (resp && resp.status) {
            if (resp.data.token) {
              // this.localStSvc.setData('isLoggedIn', resp.data.token);
              localStorage.setItem(btoa('token'), btoa(resp.data.token));
              res(true);
            } else {
              res(false);
            }
          } else {
            rej(false);
          }
        },
        err => { }
      );
    });
  }

  logout(): Promise<boolean> {
    this.localStSvc.clear();
    this.route.navigateByUrl('/login');
    return Promise.resolve(false);
  }


}
