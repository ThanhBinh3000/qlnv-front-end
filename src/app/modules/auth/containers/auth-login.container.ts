import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { exhaustMap, takeUntil, tap } from 'rxjs/operators';
import { AuthService } from '..';
import { AuthenticateInfo } from '../types';

@Component({
    selector: 'auth-login-container',
    template: `
        <div class="language-switcher-included">
            <div class="login-container">
                <div class="child-container">
                    <auth-login-form
                        class="component-form"
                        (loginClicked)="login$.next($event)"
                        (forgetPasswordClicked)="forgetPassword$.next()"
                        [errorMessages]="loginError$ | async"
                    ></auth-login-form>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
            .main-container {
                display: flex;
                justify-content: center;
                margin: 30px 0;
            }

            .switcher-language {
                width: 100%;
                padding: 30px 0;
            }

            .child-container {
                width: 400px;
            }

            .login-container {
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
            }

            app-language-switcher {
                float: right;
                padding-right: 40px;
            }

            auth-login-form {
                max-width: 100%;
                margin: 0 auto;
            }

            .language-switcher-included {
                display: flex;
                background-color: #EAEEF4;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLoginContainer implements OnInit, OnDestroy{
    private unsubscribe$ = new Subject();
    login$ = new Subject<AuthenticateInfo>();
    loginError$ = this.authService.loginError$;
    forgetPassword$ = new Subject();

    constructor(
        private authService: AuthService,
        private router: Router,
        private spinner: NgxSpinnerService,
    ) {}

    ngOnInit() {
        this.login$
        .pipe(
            tap(() => this.spinner.show()),
            exhaustMap(loginValues => this.authService.login(loginValues)),
            takeUntil(this.unsubscribe$),
        )
        .subscribe(() => this.spinner.hide());

        this.authService.loginError$.subscribe(() => this.spinner.hide());

        this.forgetPassword$.subscribe(() => {
            this.router.navigate(['/reset-password']);
        });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
