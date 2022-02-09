import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class CrossFieldErrorMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        if (control && form) {
            const dirty = control.dirty as boolean;
            const hasMismatchError = form.hasError('mismatch');
            return dirty && (!!control.errors || hasMismatchError);
        }
        return false;
    }
}
