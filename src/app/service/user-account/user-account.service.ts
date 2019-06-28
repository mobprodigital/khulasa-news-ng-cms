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
        resolve(this.userList);
      } else {
        throw new Error('Argument type mismatch');
      }
    });
  }

  public addUser(newUser: UserModel): Promise<string> {
    return new Promise((res, rej) => {
      this.httpService.post('addUser.php', newUser).then(resp => {
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

      res([
        new UserRoleModel(10, 'Admin'),
        new UserRoleModel(20, 'Editor'),
        new UserRoleModel(30, 'Author'),
      ]);

      /*  this.httpService.get('getRoles.php').then(resp => {
         if (resp.status && resp.data) {
 
         }
       }).catch(err => {
 
       });*/
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
      user.roleId = roles[Math.floor(Math.random() * roles.length)];
      return user;
    });


  }

}
