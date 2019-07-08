import { Component, OnInit, ViewChild } from '@angular/core';
import { UserModel } from 'src/app/model/user.model';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { UserAccountService } from 'src/app/service/user-account/user-account.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss']
})
export class AllUsersComponent implements OnInit {

  public loading: boolean;
  displayedColumns: string[] = ['name', 'role', 'email', 'action'];
  dataSource: MatTableDataSource<UserModel>;
  public userList: UserModel[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private userService: UserAccountService) {

  }

  ngOnInit() {
    this.getUsers();
  }


  private getUsers() {
    this.loading = true;
    this.userService.getUser().then(users => {
      this.userList = users;
      this.dataSource = new MatTableDataSource(this.userList);

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;


    }).catch(err => {
      console.log(err);
    }).finally(() => this.loading = false);
  }

  public deleteUser(userId: number) {

    if (!confirm('Are you sure to delete this user ?')) {
      return;
    }

    this.userService.deleteUser(userId).then(msg => {
      const userIndex = this.userList.findIndex(u => u.userId === userId);
      this.userList.splice(userIndex, 1);
      this.dataSource = new MatTableDataSource(this.userList);
    }).catch(err => console.log());
    console.log(userId);
  }

}
