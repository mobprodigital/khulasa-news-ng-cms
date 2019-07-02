import { Injectable } from '@angular/core';
import { UserModel } from 'src/app/model/user.model';
import { HttpService } from '../http/http.service';

import { UserRoleModel } from 'src/app/model/user-role.model';

@Injectable({
  providedIn: 'root'
})
export class UserAccountService {

  private userList: UserModel[] = [];

  constructor(private httpService: HttpService) {
    this.feedUsres();
  }

  public get(): Promise<UserModel[]>;
  public get(userId: number): Promise<UserModel>;
  public get(userId?: undefined | number): Promise<UserModel[] | UserModel> {
    return new Promise((resolve, reject) => {
      const argsType = typeof userId;
      if (argsType === 'number') {
        const usr = this.userList.find(u => u.userId === userId);
        if (usr) {
          resolve(usr);
        } else {
          reject('User not found with id  ' + userId);
        }
      } else if (argsType === 'undefined') {
        this.httpService.get('user/listAllUser.php').then(resp => {
          if (resp.status) {
            if (resp.data && resp.data.length > 0) {
              const users = this.parseUsers(resp.data);
              resolve(users);
            } else {
              reject(resp.message);
            }
          }
        }).catch(err => {
          reject(err);
        });
      } else {
        throw new Error('Argument type mismatch');
      }
    });
  }

  public addUser(newUser: UserModel): Promise<string> {
    return new Promise((res, rej) => {
      this.httpService.post('user/addUser.php', JSON.stringify(newUser)).then(resp => {
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
      this.httpService.get('roles/getRoles.php').then(resp => {
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
      this.httpService.post('user/deleteUser.php', { userId }).then(resp => {
        res(resp.message);
      }).catch(err => console.log(err));
    });
  }

  private feedUsres() {

    const roles: number[] = [10, 20, 30];

    this.userList = Array.from({ length: 100 }, (_, i) => {
      const user = new UserModel();
      user.userId = i;
      user.email = `user${i + 1}@jmm.com`;
      user.firstName = `Fname ${i + 1}`;
      user.lastName = `Lname ${i + 1}`;

      return user;
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
