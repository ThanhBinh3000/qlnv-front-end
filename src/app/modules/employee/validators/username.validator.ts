import { AbstractControl } from '@angular/forms';

export function UsernameValidator(control: AbstractControl) {
    if (!control.value) return null;
    const reg = new RegExp(
        /^[a-zA-Z0-9_.-]*$/,
    );
    return reg.test(control.value)
        ? null
        : {
            username: {
                message: 'Please input a valid username',
            },
        };
}
