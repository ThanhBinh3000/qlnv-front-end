import {FormControl } from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

export class TouchedErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null): boolean {
        return !!(control && control.invalid && control.value !== undefined && (control.dirty || control.touched));
    }
}