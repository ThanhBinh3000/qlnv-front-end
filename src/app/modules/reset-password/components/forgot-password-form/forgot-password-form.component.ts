import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/modules/shared/formly-fields/wrap-question/custom-validators';
import { TouchedErrorStateMatcher } from 'src/app/modules/shared/validators/touched-error-state.matcher';
import { ForgotPasswordInfo } from '../../types';

@Component({
    selector: 'app-forgot-password-form',
    templateUrl: './forgot-password-form.component.html',
    styleUrls: ['./forgot-password-form.component.scss'],
})
export class ForgotPasswordFormComponent implements OnInit {
    matcher = new TouchedErrorStateMatcher();
    @Output()
    forgotPasswordClicked = new EventEmitter<ForgotPasswordInfo>();

    @Output()
    loginClicked = new EventEmitter();

    @Input()
    errorMessages: string[] = [];

    form: FormGroup;
    checkError: boolean;

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.form = this.fb.group({
            email: new FormControl('', { validators: [Validators.required, CustomValidators.emailType] }),
        });
    }

    get email() {
        return this.form.controls.email as FormControl;
    }

    clicked() {
        if(this.form.valid){
            this.forgotPasswordClicked.emit(this.form.value);
        }
    }
}
