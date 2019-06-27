import { Component, OnInit } from '@angular/core';
import { LoginModel } from 'src/app/model/login.model';
import { AuthService } from 'src/app/service/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthService]
})
export class LoginComponent implements OnInit {
  public pwdHide: boolean = true;
  public logInModel: LoginModel = new LoginModel('', '');

  public showLoader = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  logInSubmit() {
    this.showLoader = true;
    this.authService.login(this.logInModel).then(data => {
      if (data) {
        this.router.navigateByUrl('/');
      } else {

      }
    }).catch(err => {
      alert(err);
    }).finally(() => {
      this.showLoader = false;
    });
  }


}
