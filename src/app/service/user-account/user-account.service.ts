import { Injectable } from '@angular/core';
import { UserModel } from 'src/app/model/user.model';
import { HttpService } from '../http/http.service';

import { UserRoleModel } from 'src/app/model/user-role.model';

@Injectable({
  providedIn: 'root'
})
export class UserAccountService {


  constructor(private httpService: HttpService) {

  }

  public getUser(): Promise<UserModel[]>;
  public getUser(userId: number): Promise<UserModel>;
  public getUser(userId?: undefined | number): Promise<UserModel[] | UserModel> {
    return new Promise((resolve, reject) => {
      const argsType = typeof userId;
      let path = 'user';
      if (argsType === 'number') {
        path += '/' + userId.toString();
        this.httpService.get(path).then(resp => {
          const user = this.parseUsers([resp.data]);
          if (user.length > 0) {
            resolve(user[0]);
          } else {
            reject('No user found');
          }
        }).catch(err => reject(err));
      } else if (argsType === 'undefined') {
        this.httpService.get(path).then(resp => {
          if (resp.data && resp.data.length > 0) {
            const users = this.parseUsers(resp.data);
            resolve(users);
          } else {
            reject(resp.message);
          }
        }).catch(err => {
          reject(err);
        });
      } else {
        throw new Error('Argument must be eighter number or undefined');
      }
    });
  }

  public addUser(newUser: UserModel): Promise<string> {
    return new Promise((res, rej) => {
      this.httpService.post('user', JSON.stringify(newUser)).then(resp => {
        if (resp.status) {
          res(resp.message);
        }
      }).catch(err => {
        rej(err);
      });
    });
  }

  public updateUser(user: UserModel): Promise<string> {
    return new Promise((res, rej) => {
      this.httpService.put('user/' + user.userId, JSON.stringify(user)).then(resp => {
        if (resp.status) {
          res(resp.message);
        }
      }).catch(err => {
        rej(err);
      });
    });
  }

  /**
   * Get all user roles
   */
  public getRoles(): Promise<UserRoleModel[]> {
    return new Promise((res, rej) => {
      this.httpService.get('role').then(resp => {
        if (resp.status && resp.data && resp.data.length > 0) {
          const roles = this.parseRoles(resp.data);
          res(roles);
        }
      }).catch(err => {
        rej(err);
      });
    });
  }


  public deleteUser(userId: number): Promise<string> {
    return new Promise((res, rej) => {
      this.httpService.delete('user/' + userId).then(resp => {
        res(resp.message);
      }).catch(err => rej(err));
    });
  }

  public updateProfile(user: UserModel): Promise<UserModel> {
    return new Promise((resolve, reject) => {
      this.httpService.put('profile', user).then(resp => {
        const usre = this.parseUsers([resp.data]);
        resolve(usre[0]);
      }).catch(err => reject(err));
    });
  }

  private parseRoles(roleArr: any[]): UserRoleModel[] {
    let userRoles: UserRoleModel[] = [];
    userRoles = roleArr.map(r => new UserRoleModel(r.roleId, r.roleName, {
      post: {
        add: r.addPost,
        delete: r.addPost,
        edit: r.deletePost
      },
      userAccount: {
        add: r.userRight,
        edit: r.userRight,
        delete: r.userRight,
      }
    }));
    return userRoles;
  }


  private parseUsers(userArr: any[]): UserModel[] {
    let users: UserModel[] = [];
    users = userArr.map(u =>
      new UserModel({
        userId: u.userId,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        mobile: u.mobile,
        skype: u.skype,
        role: new UserRoleModel(
          u.role.roleId,
          u.role.roleName,
          {
            post: {
              add: u.role.addPost,
              delete: u.role.addPost,
              edit: u.role.deletePost
            },
            userAccount: {
              add: u.role.userRight,
              edit: u.role.userRight,
              delete: u.role.userRight,
            }
          }
        )
      })
    );
    return users;
  }



}
