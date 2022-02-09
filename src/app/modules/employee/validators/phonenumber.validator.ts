import { AbstractControl } from '@angular/forms';

export function PhoneNumberValidator(control: AbstractControl) {
    if (!control.value) return null;
    const reg = new RegExp(
        /^[0-9]{10,10}$/,
    );
    return reg.test(control.value)
        ? null
        : {
              phoneNumber: {
                  message: 'Please input a valid phone number',
              },
          };
}
