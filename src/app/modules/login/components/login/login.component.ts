import { Component, OnInit } from '@angular/core';
import { LoginModel } from 'src/app/model/login.model';
import { AuthService } from 'src/app/service/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers : [AuthService]
})
export class LoginComponent implements OnInit {
  public pwdHide: boolean = true;
  public logInModel: LoginModel = new LoginModel('', '');
  constructor(private authService : AuthService) { }

  ngOnInit() {
  }

  logInSubmit() {
    console.log(this.logInModel);
  }

  
}
