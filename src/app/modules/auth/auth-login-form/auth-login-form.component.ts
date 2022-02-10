import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { CustomValidators } from '../../shared/formly-fields/wrap-question/custom-validators';
import { TouchedErrorStateMatcher } from '../../shared/validators/touched-error-state.matcher';
import { AuthenticateInfo } from '../types';

@Component({
    selector: 'auth-login-form',
    templateUrl: './auth-login-form.component.html',
    styleUrls: ['./auth-login-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLoginFormComponent {
    matcher = new TouchedErrorStateMatcher()
    @Output()
    loginClicked = new EventEmitter<AuthenticateInfo>();

    @Output()
    forgetPasswordClicked = new EventEmitter();

    @Input()
    errorMessages: string[] = [];

    form: FormGroup;
    hide = true;
    smallScreen: Observable<boolean>;
    checkError: boolean;

    tooltipList = `Valid Password format:
    ● Have at least 8 characters
    ● Have at least 1 uppercase
    ● Have at least 1 lowercase
    ● Have at least 1 numeric character
    ● Have at least 1 special characters: ! @ # $ % ^ & *
    ● Must not contain space
    `;

    constructor(private fb: FormBuilder, private breakpointObserver: BreakpointObserver, private router: Router) { }

    ngOnInit() {
        this.form = this.fb.group({
            email: new FormControl('', {
                validators: [Validators.required, CustomValidators.emailTypeLogin]
            }),
            password: new FormControl('', {
                validators: [
                    Validators.required,
                    // Validators.pattern(/^(?=.{8,}$)(?=.*[a-z])(?!.*[\s])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/),
                ]
            }),
        });

        this.smallScreen = this.breakpointObserver.observe([Breakpoints.HandsetPortrait]).pipe(pluck('matches'));
        this.form.valueChanges.subscribe(() => {
            this.errorMessages = [];
        })
    }

    get email() {
        return this.form.controls.email as FormControl;
    }

    get password() {
        return this.form.controls.password as FormControl;
    }

    clicked() {
        if (this.form.valid) {
            this.loginClicked.emit(this.form.value);
        }
    }

    navigateSignup() {
        this.router.navigate(['sign-up']);
    }
}
