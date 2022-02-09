import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, shareReplay, takeUntil } from 'rxjs/operators';
import { CrossFieldErrorMatcher, MIN_PASSWORD_LEN } from 'src/app/modules/shared';
import { ResetPasswordInfo } from '../../types';

@Component({
    selector: 'app-reset-password-form',
    templateUrl: './reset-password-form.component.html',
    styleUrls: ['./reset-password-form.component.scss'],
})
export class ResetPasswordFormComponent implements OnInit, OnDestroy {
    @Input()
    email: string;

    @Input()
    errorMessages: string[] = [];

    @Output()
    resetPasswordClicked = new EventEmitter<ResetPasswordInfo>();

    @Output()
    cancelClicked = new EventEmitter<ResetPasswordInfo>();

    errorMatcher = new CrossFieldErrorMatcher();
    unsubscribe$ = new Subject();
    checkError: boolean = false;

    tooltipList = `Valid Password format:
    ● Have at least 8 characters
    ● Have at least 1 uppercase
    ● Have at least 1 lowercase
    ● Have at least 1 numeric character
    ● Have at least 1 special characters: ! @ # $ % ^ & *
    ● Must not contain space
    `;

    form: FormGroup;
    hideNewPassword = true;
    hideConfirmPassword = true;
    minPasswordLen = MIN_PASSWORD_LEN;

    smallScreen$ = this.breakpointObserver.observe(['(max-width: 1100px)']).pipe(
        map(observer => (observer.matches ? 'yes' : 'no')),
        takeUntil(this.unsubscribe$),
        shareReplay(1),
    );

    constructor(
        private fb: FormBuilder,
        private breakpointObserver: BreakpointObserver,
        private cdr: ChangeDetectorRef,
    ) {}

    ngOnInit() {
        this.form = this.fb.group({
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
        });
        this.newPassword.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => {
            this.cdr.markForCheck();
        });
    }

    get newPassword() {
        return this.form.controls.newPassword as FormControl;
    }

    get confirmPassword() {
        return this.form.controls.confirmPassword as FormControl;
    }

    resetPassword() {
        if (this.form.valid) {
            this.resetPasswordClicked.emit(this.form.value);
        }
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    hasError(control: AbstractControl, errorName: string) {
        return control && (control.touched || control.dirty) && control.hasError(errorName);
    }

    passwordCf() {
        if (this.form !== null && this.form !== undefined) {
            const newPass = this.form.controls.newPassword;
            const confirmPass = this.form.controls.confirmPassword;
            return newPass.value === confirmPass.value ? null : { passwordNotMatch: true };
        }
        return null;
    }
}
