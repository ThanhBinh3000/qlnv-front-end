import { BreakpointObserver } from '@angular/cdk/layout';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/modules';
import { ChangePasswordInfo } from 'src/app/modules/admin/admin-type';
import { AdminService } from 'src/app/modules/admin/services';
import {
    ConfirmationDialog,
    confirmPasswordValidator,
    CrossFieldErrorMatcher,
    MIN_PASSWORD_LEN,
} from '../../../shared';

@Component({
    selector: 'change-password-form',
    templateUrl: './change-password-form.component.html',
    styleUrls: ['./change-password-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordFormComponent implements OnInit, OnDestroy {
    @ViewChild('f', { static: true })
    formDirective: NgForm;

    @Input()
    errorMessages: string[];

    @Output()
    changePasswordClicked = new EventEmitter<ChangePasswordInfo>();

    errorMatcher = new CrossFieldErrorMatcher();
    unsubscribe$ = new Subject();

    form: FormGroup;
    hide = true;
    hideNewPassword = true;
    hideReEnterPassword = true;
    minPasswordLen = MIN_PASSWORD_LEN;
    successChangePass$ = this.adminService.success$;
    errorsChangePass$ = this.adminService.errors$;
    errorMessagesPass = new BehaviorSubject<string[]>([]);

    smallScreen$ = this.breakpointObserver
        .observe(['(max-width: 600px)'])
        .pipe(map(observer => (observer.matches ? 'yes' : 'no')));

    // criteria = this.updateCriteria('');

    tooltipList = `Valid Password format:
    - Have at least 8 characters
    - Have at least 1 uppercase
    - Have at least 1 lowercase
    - Have at least 1 numeric character
    - Have at least 1 special characters: ! @ # $ % ^ & *
    - Must not contain space
    `;

    constructor(
        private fb: FormBuilder,
        private breakpointObserver: BreakpointObserver,
        private spinner: NgxSpinnerService,
        private adminService: AdminService,
        private dialog: MatDialog,
        private authService: AuthService,
        private matDialogRef: MatDialogRef<ChangePasswordFormComponent>,
    ) {}

    ngOnInit() {
        this.form = this.fb.group(
            {
                password: new FormControl('', {
                    validators: [
                        Validators.required,
                        Validators.pattern(/^(?=.{8,}$)(?=.*[a-z])(?!.*[\s])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/),
                    ],
                }),
                newPassword: new FormControl('', {
                    validators: [
                        Validators.required,
                        Validators.minLength(this.minPasswordLen),
                        Validators.pattern(/^(?=.{8,}$)(?=.*[a-z])(?!.*[\s])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/),
                    ],
                }),
                confirmPassword: new FormControl('', {
                    validators: [Validators.required, this.passwordCf.bind(this)],
                }),
            },
            { validators: confirmPasswordValidator() },
        );

        this.successChangePass$.pipe(takeUntil(this.unsubscribe$)).subscribe(result => {
            this.spinner.hide();
            this.closePopup();
            if (result) {
                const confirmDialogRef = this.dialog.open(ConfirmationDialog, {
                    width: '600px',
                    data: {
                        title: 'New password has been saved',
                        message: 'Please login Quoc Gia again with you new password',
                        closeButtonText: 'OK',
                    },
                });

                confirmDialogRef.afterClosed().subscribe(() => {
                    this.authService.logout();
                });
            }
        });

        this.errorsChangePass$.pipe(takeUntil(this.unsubscribe$)).subscribe(result => {
            this.spinner.hide();
            this.closePopup();
            this.errorMessagesPass.next(result);
            let resultDialog;
            if (result && result.length > 0) {
                resultDialog = this.dialog.open(ConfirmationDialog, {
                    width: '600px',
                    data: {
                        title: 'Unable to save change',
                        message: result[0] || 'Your change has not been saved due to an error. Please try again',
                        closeButtonText: 'Close',
                    },
                });
            }
            resultDialog.afterClosed().subscribe(() => {
                this.dialog.open(ChangePasswordFormComponent, {
                    width: '37.5rem',
                    height: '30.5rem',
                });
            });
        });
    }

    get password() {
        return this.form.controls.password as FormControl;
    }

    get newPassword() {
        return this.form.controls.newPassword as FormControl;
    }

    get confirmPassword() {
        return this.form.controls.confirmPassword as FormControl;
    }

    changePassword() {
        const inputEmployer: ChangePasswordInfo = {
            newPassword: this.newPassword.value,
            currentPassword: this.password.value,
            confirmPassword: this.confirmPassword.value,
        };
        this.spinner.show();
        this.adminService.updatePassword(inputEmployer);
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    passwordChanged(value: string) {
        if (this.form !== null && this.form !== undefined) {
            const repassword = this.form.controls.confirmPassword;
            if (repassword.value !== '' && value !== repassword.value) {
                this.form.controls.confirmPassword.setErrors({ passwordNotMatch: true });
            }
            if (repassword.value !== '' && value === repassword.value) {
                this.form.controls.confirmPassword.setErrors(null);
            }
        }
    }

    passwordCf() {
        if (this.form !== null && this.form !== undefined) {
            const newPass = this.form.controls.newPassword;
            const confirmPass = this.form.controls.confirmPassword;
            return newPass?.value === confirmPass?.value ? null : { passwordNotMatch: true };
        }
        return null;
    }

    hasError(control: AbstractControl, errorName: string) {
        return control && (control.touched || control.dirty) && control.hasError(errorName);
    }

    closePopup() {
        this.matDialogRef.close();
        this.resetForm();
    }

    resetForm() {
        this.formDirective.resetForm();
        this.form.reset();

        Object.keys(this.form.controls).forEach(key => this.form.controls[key].setErrors(null));
    }
}
