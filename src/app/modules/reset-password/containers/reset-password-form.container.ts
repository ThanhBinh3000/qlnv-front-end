import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { exhaustMap, takeUntil, tap } from 'rxjs/operators';
import { ConfirmationDialog } from '../../shared';
import { ResetPasswordFormComponent } from '../components';
import { ResetPasswordService } from '../services/reset-password.service';
import { ResetPasswordInfo } from '../types';

@Component({
    selector: 'reset-password-form-container',
    template: `
        <div class="language-switcher-included">
            <div class="login-container">
                <div class="child-container" *ngIf="validLink$ | async; else invalidLink">
                    <app-reset-password-form
                        #resetPassword
                        class="component-form"
                        [email]="email"
                        (resetPasswordClicked)="request$.next($event)"
                        (cancelClicked)="gotoLogin()"
                        [errorMessages]="error$ | async"
                    ></app-reset-password-form>
                </div>
                <ng-template #invalidLink>
                    <div class="container">
                        <mat-card class="mat-elevation-z0" style="text-align: center">
                            <mat-card-header>
                                <mat-card-title>Expired Reset password link</mat-card-title>
                            </mat-card-header>
                            <mat-card-content class="content-container">
                                <h3 class="message">
                                    This link is no longer valid. Please try resetting your password again.
                                </h3>
                                <div class="actions">
                                    <button
                                        (click)="gotoLogin()"
                                        mat-button
                                        type="button"
                                        color="primary"
                                        class="mat-slim"
                                    >
                                        Go to login
                                    </button>
                                </div>
                            </mat-card-content>
                        </mat-card>
                    </div>
                </ng-template>
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
                width: 450px;
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

            .container {
                height: 100%;
                padding: 3rem;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
            }

            .action-box {
                margin: 1rem 0;
            }

            .head-title {
                margin-bottom: 2rem;
            }

            .message {
                margin-bottom: 1rem;
            }
            .actions button {
                color: #fff;
            }
        `,
    ],
    styleUrls: ['./reset-password-form.container.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordFormContainer implements OnInit, OnDestroy {
    @ViewChild('resetPassword') resetPassword: ResetPasswordFormComponent;

    private unsubscribe$ = new Subject();
    request$ = new Subject<ResetPasswordInfo>();
    error$ = this.resetPasswordService.error$;
    validLink$ = this.resetPasswordService.validLink$;

    email = '';
    forgotPasswordId = '';
    userId = '';
    code = '';
    time = '';
    isReset = false;

    constructor(
        private resetPasswordService: ResetPasswordService,
        private router: Router,
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef,
        private dialog: MatDialog,
        private spinner: NgxSpinnerService,
    ) {}

    ngOnInit() {
        this.userId = this.route.snapshot.params.id;
        this.code = this.route.snapshot.params.code;
        this.time = this.route.snapshot.queryParams.time;
        this.resetPasswordService.checkForgotPassword(this.userId, this.code, this.time);
        this.request$
            .pipe(
                tap(() => this.spinner.show()),
                exhaustMap((data: ResetPasswordInfo) =>
                    this.resetPasswordService.update(data, this.userId, this.code, this.time),
                ),
                takeUntil(this.unsubscribe$),
            )
            .subscribe(() => {
                this.isReset = true;
                this.cdr.markForCheck();
                this.spinner.hide();
                const confirmDialogRef = this.dialog.open(ConfirmationDialog, {
                    data: {
                        title: 'Reset password successfully!',
                        message: 'Your password was reset successfully. Click button to login again',
                        closeButtonText: 'Go to Login',
                    },
                });

                confirmDialogRef
                    .afterClosed()
                    .pipe(takeUntil(this.unsubscribe$))
                    .subscribe(() => this.gotoLogin());
            });
    }

    gotoLogin() {
        this.router.navigate(['/login']);
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
