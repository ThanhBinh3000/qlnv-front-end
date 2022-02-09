import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EMPTY, Subject } from 'rxjs';
import { catchError, map, shareReplay, takeUntil } from 'rxjs/operators';
import { ConfirmationDialog } from 'src/app/modules/shared';
import { MIN_PASSWORD_LEN } from 'src/app/modules/types';
import { MyAccountService } from '../../services/user-settings.service';
import { EmployerAccountInfo } from '../../user-settings-types';
import { ChangePasswordFormComponent } from '../change-password-form/change-password-form.component';

@Component({
  selector: 'app-employer-user',
  templateUrl: './employer-user.component.html',
  styleUrls: ['./employer-user.component.scss']
})
export class EmployerUserComponent implements OnInit, OnDestroy {

    constructor(
        private fb: FormBuilder,
        private myAccountService: MyAccountService,
        private dialog: MatDialog,
    ) {}
    form: FormGroup;
    hidePassword = true;
    hideNewPassword = true;
    hideReEnterPassword = true;
    originAccountInfo: EmployerAccountInfo;
    minPasswordLen = MIN_PASSWORD_LEN;
    formChanged = false;
    private unsubscribe$ = new Subject();

    ngOnInit(): void {
        this.form = this.fb.group({
            username: new FormControl({}),
            email: new FormControl(''),
            firstname: new FormControl(''),
            lastname: new FormControl(''),
            phoneNumber: new FormControl(''),
            address: new FormControl(''),
            genderId: new FormControl(''),
            dob: new FormControl(''),
            countryId: new FormControl(''),
            educationId: new FormControl(''),
        });

        this.form.controls.username.disable();
        this.form.controls.email.disable();
        this.form.controls.firstname.disable();
        this.form.controls.lastname.disable();
        this.form.controls.phoneNumber.disable();
        this.form.controls.address.disable();
        this.form.controls.genderId.disable();
        this.form.controls.dob.disable();
        this.form.controls.countryId.disable();
        this.form.controls.educationId.disable();

        this.myAccountService
            .getAccountInfoForAdmin()
            .pipe(
                catchError(() => {
                    this.dialog.open(ConfirmationDialog, {
                        data: {
                            title: 'Operation failed!',
                            message: 'Failed to get your account info!',
                            closeButtonText: 'Cancel',
                        },
                    });
                    return EMPTY;
                }),
                map(res => {
                    this.originAccountInfo = res as EmployerAccountInfo;
                    this.listenToFormChanges();
                    this.bindFormValues(this.originAccountInfo);
                }),
                shareReplay(1),
                takeUntil(this.unsubscribe$),
            )
            .subscribe();
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    get firstname() {
        return this.form.controls.firstname as FormControl;
    }

    get lastname() {
        return this.form.controls.lastname as FormControl;
    }

    get email() {
        return this.form.controls.email as FormControl;
    }
    get dob() {
        return this.form.controls.dob as FormControl;
    }

    get genderId() {
        return this.form.controls.genderId as FormControl;
    }

    get phoneNumber() {
        return this.form.controls.phoneNumber as FormControl;
    }

    get countryId() {
        return this.form.controls.countryId as FormControl;
    }

    get address() {
        return this.form.controls.address as FormControl;
    }

    get educationId() {
        return this.form.controls.educationId as FormControl;
    }

    listenToFormChanges() {
        this.form.valueChanges.subscribe(val => {
            this.formChanged = val.fullName !== this.originAccountInfo.username;
            this.formChanged = val.email !== this.originAccountInfo.email;
            this.formChanged = val.firstname !== this.originAccountInfo.firstname;
            this.formChanged = val.lastname !== this.originAccountInfo.lastname;
            this.formChanged = val.phoneNumber !== this.originAccountInfo.phoneNumber;
            this.formChanged = val.address !== this.originAccountInfo.address;
            this.formChanged = val.genderId !== this.originAccountInfo.genderId;
            this.formChanged = val.dob !== this.originAccountInfo.dob;
            this.formChanged = val.countryId !== this.originAccountInfo.countryId;
            this.formChanged = val.educationId !== this.originAccountInfo.educationId;
        });
    }

    bindFormValues(info: EmployerAccountInfo) {
        if (info) {
            this.form.controls.username.setValue(info.username);
            this.form.controls.email.setValue(info.email);
            this.form.controls.firstname.setValue(info.firstname);
            this.form.controls.lastname.setValue(info.lastname);
            this.form.controls.phoneNumber.setValue(info.phoneNumber);
            this.form.controls.address.setValue(info.address);
            this.form.controls.genderId.setValue(info.genderId);
            this.form.controls.dob.setValue(info.dob);
            this.form.controls.countryId.setValue(info.countryId);
            this.form.controls.educationId.setValue(info.educationId);
        }
    }

    popupChangePassword() {
        this.dialog.open(ChangePasswordFormComponent, {
            width: '37.5rem',
            height: '30.5rem',
        });
    }

    changeInfo() {

    }
}
