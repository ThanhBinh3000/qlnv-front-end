import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    private checkLogin(url: string) {
        if (this.authService.isLogin()) {
            if (url === '/login') {
                this.router.navigate(['/']);
            }
            return true;
        }

        if (url !== '/login') {
            this.authService.redirectUrl = url;
            this.router.navigate(['/login']);
            return false;
        }
        return true;
    }

    private checkRole(url: string) {
        if (!this.authService.isLogin()) {
            return of(true);
        }

        console.log('checkRole - url: ', url);

        // this.authService.checkAccess(url);
        // return this.authService.checkAccess$.pipe(
        //     take(1),
        //     tap(allowed => {
        //         if (!allowed) {
        //             this.router.navigate(['/']);
        //         }
        //     }),
        //     map(() => true),
        // );
        return true;
    }

    constructor(protected authService: AuthService, protected router: Router) {}

    canActivate(_next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const url = state.url;
        if (url === '/brand-register' && !this.authService.isLogin()) return true;
        const validLogin = this.checkLogin(url);
        if (url === '/brand-register' && validLogin) {
            this.router.navigate(['/']);
        }

        if (!validLogin) {
            return of(true);
        }

        const urlSegments = url.split('/');
        const stripIdUrl = urlSegments
            .slice()
            .splice(0, urlSegments.length - 1)
            .join('/');
        if (
            ['/questionnaire/edit', '/pra', '/questionnaire/preview', '/cases/selfassessment/results'].indexOf(
                stripIdUrl,
            ) >= 0
        ) {
            return this.checkRole(stripIdUrl);
        }

        return this.checkRole(url);
    }
}
