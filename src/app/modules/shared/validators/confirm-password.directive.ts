import { AbstractControl, ValidatorFn, FormGroup } from '@angular/forms';

export function confirmPasswordValidator(): ValidatorFn {
    return (control: AbstractControl) => {
        const formGroup = control as FormGroup;
        const controls = formGroup.controls;
        const { newPassword = '', confirmPassword = '' } = formGroup.value || {};

        const isConfirmPasswordDirty = controls.confirmPassword.dirty || controls.confirmPassword.touched;
        const isNewPasswordDirty = controls.newPassword.dirty || controls.newPassword.touched;

        return isConfirmPasswordDirty && isNewPasswordDirty && newPassword !== confirmPassword
            ? { mismatch: true }
            : null;
    };
}
