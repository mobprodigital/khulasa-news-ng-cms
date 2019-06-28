import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth/auth.service';
import { UserModel } from 'src/app/model/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public loggedInUser: UserModel = new UserModel();

  constructor(private authService: AuthService) {
    this.loggedInUser = authService.loggedInUser;
  }

  ngOnInit() {
  }

  public logOut() {
    this.authService.logout();
  }

}
