import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth/auth.service';
import { UserModel } from 'src/app/model/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public loggedInUser: UserModel = new UserModel();

  constructor(private authService: AuthService, private router: Router) {
    this.loggedInUser = authService.loggedInUser;
  }

  ngOnInit() {
  }

  public logOut() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }

}
