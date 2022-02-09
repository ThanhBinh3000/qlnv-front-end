import { AbstractControl } from "@angular/forms";

export function EmailValidator(control: AbstractControl) {
    if(!control.value) return null;
    const reg = new RegExp(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
    return reg.test(control.value)
    ? null
    : {
        email: {
            message: 'Please input a valid email',
        }
    }
}

export function EmailValidatorLogin(control: AbstractControl) {
    if(!control.value) return null;
    let findEmail = control.value.includes("@");
    if(findEmail){
        const reg = new RegExp(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        );
        return reg.test(control.value)
        ? null
        : {
            email: {
                message: 'Please input a valid email',
            }
        }
    }
    else {
        return null;
    }
}
