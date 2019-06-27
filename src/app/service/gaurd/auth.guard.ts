import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(private authService: AuthService, private router: Router) { }

  canLoad(
    route: import('@angular/router').Route,
  ): Promise<boolean> {
    return this.checkLogin();
  }

  checkLogin(): Promise<boolean> {
    if (this.authService.isLoggedIn) {
      // this.router.navigate(['/']);
      return Promise.resolve(this.authService.isLoggedIn);
    } else {
      // this.router.navigate(['/login']);
      Promise.resolve(this.authService.isLoggedIn);
    }
  }

}
