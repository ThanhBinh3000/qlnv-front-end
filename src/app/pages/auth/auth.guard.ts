import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {of} from 'rxjs';
import {AuthService} from 'src/app/services/auth.service';
import {UserService} from 'src/app/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    protected authService: AuthService,
    protected router: Router,
    protected userService: UserService,
  ) {
  }

  canActivate(_next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const url = state.url;
    const validLogin = this.checkLogin(url);
    if (!validLogin) {
      return of(true);
    }
    return validLogin;
  }

  private checkLogin(url: string) {
    if (this.authService.getToken() && this.authService.getToken() != "") {
      if (!this.userService.isAccessUrlPermisson(url)) {
        this.router.navigate(['/error/401']);
      }
      return true;
    }
    if (url !== '/login') {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
