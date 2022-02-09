import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import {
    Component,
    Inject,
    Input,
    OnInit,
    ChangeDetectorRef,
    ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { QuanLyDanhMucHangDTQGService } from '../../services';
import * as myGlobals from '../../../../globals';
import { PaginateOptions } from 'src/app/modules/types';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationDialog } from 'src/app/modules/shared/dialogs';

@Component({
    selector: 'them-sua-danh-muc-hang-dtqg',
    templateUrl: './them-sua-danh-muc-hang-dtqg.component.html',
    styleUrls: ['./them-sua-danh-muc-hang-dtqg.component.scss'],
})
export class ThemSuaDanhMucHangDTQG implements OnInit {
    @ViewChild('f', { static: true })
    formDirective: NgForm;

    constructor(
        private fb: FormBuilder,
        private matDialogRef: MatDialogRef<ThemSuaDanhMucHangDTQG>,
        private breakpointObserver: BreakpointObserver,
        private service: QuanLyDanhMucHangDTQGService,
        private spinner: NgxSpinnerService,
        private dialog: MatDialog,
        private cdr: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            title?: string,
            userId?: string,
            username?: string,
            email?: string,
            firstname?: string,
            lastname?: string,
            genderId?: string,
            countryId?: string,
            educationId?: string,
            address?: string,
            dob?: Date,
            phoneNumber?: string,
            hideCancelButton?: boolean;
        },
    ) {

    }

    @Input()
    errorMessages: string[];


    form: FormGroup;


    private unsubscribed$ = new Subject();


    smallScreen$ = this.breakpointObserver
        .observe(['(max-width: 1200px)'])
        .pipe(map(observer => (observer.matches ? 'yes' : 'no')));

    ngOnInit(): void {
        this.matDialogRef.backdropClick().subscribe(async () => await this.closeDialog());
        if(this.data.userId == null || this.data.userId == '') {
            this.form = this.fb.group({
                username: new FormControl('', {
                    // validators: [Validators.required, UsernameValidator],
                    // asyncValidators: [validateIomUsername(this.service, this.cdr)],
                }),
                email: new FormControl('', {
                    // validators: [Validators.required, EmailValidator],
                    // asyncValidators: [validateIomEmail(this.service, this.cdr)],
                }),
                firstname: new FormControl('', {
                    validators: [Validators.required],
                }),
                lastname: new FormControl('', {
                    validators: [Validators.required],
                }),
                dob: new FormControl(''),
                genderId: new FormControl('', {
                    validators: [Validators.required],
                }),
                phoneNumber: new FormControl('', {
                    // validators: [Validators.required, PhoneNumberValidator],
                }),
                countryId: new FormControl('', {
                    validators: [Validators.required],
                }),
                educationId: new FormControl('', {
                    validators: [Validators.required],
                }),
                address: new FormControl(''),
            });
        }
        else {
            this.form = this.fb.group({
                username: new FormControl({value: this.data.username, disabled: true}, {
                    // validators: [Validators.required, UsernameValidator],
                    // asyncValidators: [validateIomUsername(this.service, this.cdr)],
                }),
                email: new FormControl({value: this.data.email, disabled: true}, {
                    // validators: [Validators.required, EmailValidator],
                    // asyncValidators: [validateIomEmail(this.service, this.cdr)],
                }),
                firstname: new FormControl(this.data.firstname, {
                    validators: [Validators.required],
                }),
                lastname: new FormControl(this.data.lastname, {
                    validators: [Validators.required],
                }),
                dob: new FormControl(this.data.dob),
                genderId: new FormControl(this.data.genderId, {
                    validators: [Validators.required],
                }),
                phoneNumber: new FormControl(this.data.phoneNumber, {
                    // validators: [Validators.required, PhoneNumberValidator],
                }),
                countryId: new FormControl(this.data.countryId, {
                    validators: [Validators.required],
                }),
                educationId: new FormControl(this.data.educationId, {
                    validators: [Validators.required],
                }),
                address: new FormControl(this.data.address),
            });
        }
    }

    get email() {
        return this.form.controls.email as FormControl;
    }

    get username() {
        return this.form.controls.username as FormControl;
    }

    get firstname() {
        return this.form.controls.firstname as FormControl;
    }

    get lastname() {
        return this.form.controls.lastname as FormControl;
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

    get educationId() {
        return this.form.controls.educationId as FormControl;
    }

    get address() {
        return this.form.controls.address as FormControl;
    }

    async closeDialog() {
        this.matDialogRef.close();
        this.resetForm();
    }

    submitForm() {
        if (this.form.valid) {
            const userInfo = this.form.getRawValue();

            const options:PaginateOptions = {pageIndex: 0, pageSize: 10};
            this.spinner.show();
            if(this.data.userId != null && this.data.userId != ''){
                this.service.updateUser(userInfo, options, this.data.userId).subscribe(() => {
                    myGlobals.emailAddUserSub$.next('')
                    myGlobals.userNameAddUserSub$.next('')
                    this.spinner.hide();
                    this.closeDialog();
                    this.dialog.open(ConfirmationDialog, {
                        data: {
                            title: 'Update user successfully!',
                            message:
                                `Successfully updated ` + userInfo['username'] + ` to Quoc Gia.`,
                        },
                    });
                }, err => {
                    console.log(err);
                    this.spinner.hide();
                });
            }
            else {
                this.service.createNewUser(userInfo, options).subscribe(() => {
                    myGlobals.emailAddUserSub$.next('')
                    myGlobals.userNameAddUserSub$.next('')
                    this.spinner.hide();
                    this.closeDialog();
                    this.dialog.open(ConfirmationDialog, {
                        data: {
                            title: 'Add new user successfully!',
                            message:
                                `Successfully added ` + userInfo['username'] + ` to Quoc Gia.`,
                        },
                    });
                }, err => {
                    console.log(err);
                    this.spinner.hide();
                });
            }
        }
    }

    resetForm() {
        this.formDirective.resetForm();
        this.form.reset();
        Object.keys(this.form.controls).forEach(key => this.form.controls[key].setErrors(null));
    }

    ngOnDestroy() {
        this.unsubscribed$.next();
        this.unsubscribed$.complete();
    }

    emailChanged(value: string) {
        if (value !== null) {
            myGlobals.emailAddUserSub$.next(value)
        }
    }

    userNameChanged(value: string) {
        if (value !== null) {
            myGlobals.userNameAddUserSub$.next(value)
        }
    }
}
