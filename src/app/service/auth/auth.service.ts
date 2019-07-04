import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginModel } from 'src/app/model/login.model';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { UserModel } from 'src/app/model/user.model';
import { UserRoleModel } from 'src/app/model/user-role.model';


@Injectable()
export class AuthService {


  // private baseUrl: string = 'http://192.168.0.7/khulasa-news-panel/';
  // private baseUrl: string = 'http://development.bdigimedia.com/riccha_dev/khulasa-News-Panel/';
  private baseUrl: string = 'http://development.bdigimedia.com/riccha_dev/khulasa-En-Panel/';

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
      return atob(token);
    } else {
      return null;
    }
  }




  /** Get logged in user */
  public get loggedInUser(): UserModel {

    const localUserInfo = localStorage.getItem(btoa('loggedIn'));
    let localUser: UserModel;
    if (localUserInfo) {
      try {
        localUser = JSON.parse(atob(localUserInfo)) as UserModel;
        return localUser;
      } catch {
        return null;
      }
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
      this.http.post(this.baseUrl + 'user/login', JSON.stringify(loginCredentials)).subscribe(
        (resp: any) => {
          if (resp && resp.status) {
            if (resp.data.token) {

              const usr = new UserModel({
                firstName: resp.data.firstName,
                lastName: resp.data.lastName,
                email: resp.data.email,
                mobile: resp.data.mobile,
                skype: resp.data.skype,
                userId: resp.data.userId,
                role: new UserRoleModel(
                  resp.data.role.roleId,
                  resp.data.role.roleName,
                  {
                    post: {
                      add: resp.data.role.addPost === true,
                      edit: resp.data.role.editPost === true,
                      delete: resp.data.role.deletePost === true,
                    },
                    userAccount: {
                      add: resp.data.role.userRight === true,
                      delete: resp.data.role.userRight === true,
                      edit: resp.data.role.userRight === true
                    }
                  }
                )
              });

              console.log(usr);

              localStorage.setItem(btoa('loggedIn'), btoa(JSON.stringify(usr)));

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

    return new Promise((res, rej) => {
      this.http.get(this.baseUrl + 'user/logout').subscribe(
        resp => {

        },
        err => {

        },
        () => {
          this.localStSvc.clear();
          res(true);
        }
      );
    });

  }




}
