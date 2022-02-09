import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { exhaustMap, takeUntil, tap } from 'rxjs/operators';
import { ConfirmationDialog } from '../../shared';
import { ResetPasswordService } from '../services/reset-password.service';
import { ForgotPasswordInfo } from '../types';

@Component({
    selector: 'forgot-password-form-container',
    template: `
        <div class="language-switcher-included">
            <div class="login-container">
                <div class="child-container">
                    <app-forgot-password-form
                        class="component-form"
                        (forgotPasswordClicked)="request$.next($event)"
                        (loginClicked)="backToLogin$.next()"
                        [errorMessages]="error$ | async"
                    ></app-forgot-password-form>
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
                width: 980px;
                box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.04);
            }

            .login-container {
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            app-language-switcher {
                float: right;
                padding-right: 40px;
            }

            auth-login-form {
                max-width: 40rem;
            }

            .language-switcher-included {
                height: calc(100vh - 100px);
                display: flex;
            }
        `,
    ],
    styleUrls: ['./forgot-password-form.container.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordFormContainer implements OnInit, OnDestroy {
    private unsubscribe$ = new Subject();
    backToLogin$ = new Subject();
    request$ = new Subject<ForgotPasswordInfo>();
    error$ = this.resetPasswordService.error$;
    requestSuccess$ = this.resetPasswordService.request$;
    isSent = false;
    isShowDialogSuccess = false;
    message = '';

    constructor(
        private resetPasswordService: ResetPasswordService,
        private cdr: ChangeDetectorRef,
        private router: Router,
        private dialog: MatDialog,
        private spinner: NgxSpinnerService,
    ) {}

    ngOnInit() {
        this.request$
            .pipe(
                tap(() => this.spinner.show()),
                exhaustMap((data: ForgotPasswordInfo) => this.resetPasswordService.request(data)),
                takeUntil(this.unsubscribe$),
            )
            .subscribe(() => {
                this.isSent = true;
                this.cdr.markForCheck();
            });

        this.backToLogin$.subscribe(() => {
            this.router.navigate(['/login']);
        });

        this.requestSuccess$.subscribe(data => {
            if(data) {
                this.spinner.hide();
                if(this.isShowDialogSuccess) {
                    return;
                }
                this.isShowDialogSuccess = true;
                const confirmDialogRef = this.dialog.open(ConfirmationDialog, {
                    data: {
                        title: 'Email was sent!',
                        message:
                            'A system email with reset password URL was sent to your email. Please open your email box and continue reset password process.',
                        closeButtonText: 'Go to Login',
                    },
                });

                confirmDialogRef
                .afterClosed()
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe(() => {
                    this.gotoLogin();
                })
            }
        });
        this.error$.subscribe(() => this.spinner.hide());
    }

    gotoLogin() {
        this.router.navigate(['/login']);
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
