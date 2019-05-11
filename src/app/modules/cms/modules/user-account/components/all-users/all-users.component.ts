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

  displayedColumns: string[] = ['name', 'role', 'email', 'action'];
  dataSource: MatTableDataSource<UserModel>;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private userService: UserAccountService) {
    this.feedUsres();
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  private async feedUsres() {

    let userList: UserModel[] = await this.userService.get();
    this.dataSource = new MatTableDataSource(userList);
  }

}
