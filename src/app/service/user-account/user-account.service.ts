import { Injectable } from '@angular/core';
import { UserModel } from 'src/app/model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserAccountService {

  private userList: UserModel[] = [];

  constructor() {
    this.feedUsres();
  }

  public get(): Promise<UserModel[]>;
  public get(userId: string): Promise<UserModel>;
  public get(userId?: undefined | string): Promise<UserModel[] | UserModel> {
    return new Promise((resolve, reject) => {
      let argsType = typeof userId;
      if (argsType === "string") {
        let usr = this.userList.find(u => u.userId === userId);
        if (usr) {
          resolve(usr);
        }
        else {
          reject('User not found with id  ' + userId);
        }
      }
      else if (argsType === "undefined") {
        resolve(this.userList);
      }
      else {
        throw "Argument type mismatch";
      }
    })
  }

  private feedUsres() {

    const roles: string[] = ['admin', 'author', 'editor'];

    this.userList = Array.from({ length: 100 }, (_, i) => {
      let _user = new UserModel();
      _user.userId = i.toString();
      _user.email = `user${i + 1}@jmm.com`;
      _user.firstName = `Fname ${i + 1}`;
      _user.lastName = `Lname ${i + 1}`;
      _user.middleName = `Middle ${i + 1}`;
      _user.role = roles[Math.floor(Math.random() * roles.length)];
      return _user;
    })


  }

}
