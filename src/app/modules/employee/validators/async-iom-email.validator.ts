import { ChangeDetectorRef } from '@angular/core';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { of } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { EmployeeService } from '../services';

export function validateIomEmail(service: EmployeeService, cdr: ChangeDetectorRef, ignoreFn?: () => string,): AsyncValidatorFn {
    return (control: AbstractControl) => {
        if (!control.dirty && !control.touched) {
            return of(null);
        }
        const value = control.value as string;
        const ignore = typeof ignoreFn === 'function' ? ignoreFn() : null;
        if (value && ignore && ignore === value) {
            return of(null);
        }
        return service.isEmailUnique(value).pipe(
            map((result: boolean) => (result ? null : { taken: true })),
            finalize(() => cdr.markForCheck()),
        );
    };
}
