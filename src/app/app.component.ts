import { Component } from '@angular/core';
import { AuthService } from './service/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private authSvc: AuthService, router: Router) {
    router.navigateByUrl(authSvc.isLoggedIn ? window.location.pathname : '/login');
  }
}
