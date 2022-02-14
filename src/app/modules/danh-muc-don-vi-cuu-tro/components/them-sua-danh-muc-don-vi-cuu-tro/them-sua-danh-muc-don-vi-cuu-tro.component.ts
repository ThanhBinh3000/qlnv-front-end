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
import * as myGlobals from '../../../../globals';
import { PaginateOptions } from 'src/app/modules/types';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationDialog } from 'src/app/modules/shared/dialogs';
import { leadingComment } from '@angular/compiler';
import { DanhMucDonViCuuTroService } from '../..';

@Component({
    selector: 'them-sua-danh-muc-don-vi-cuu-tro',
    templateUrl: './them-sua-danh-muc-don-vi-cuu-tro.component.html',
    styleUrls: ['./them-sua-danh-muc-don-vi-cuu-tro.component.scss'],
})
export class ThemSuaDanhMucDonViCuutro implements OnInit {
    @ViewChild('f', { static: true })
    formDirective: NgForm;

    constructor(
        private fb: FormBuilder,
        private matDialogRef: MatDialogRef<ThemSuaDanhMucDonViCuutro>,
        private breakpointObserver: BreakpointObserver,
        private service: DanhMucDonViCuuTroService,
        private spinner: NgxSpinnerService,
        private dialog: MatDialog,
        private cdr: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            maDviCuutro: string,
            tenDviCuutro: string,
            trangThai: string,
            id: number,
        },
    ) {
    }

    @Input()
    errorMessages: string[];
    form: FormGroup;

    listTrangThai = [
        {
            value: "00",
            text: "Ẩn"
        }, {
            value: "01",
            text: "Hiện"
        }, 
    ]

    private unsubscribed$ = new Subject();

    smallScreen$ = this.breakpointObserver
        .observe(['(max-width: 1200px)'])
        .pipe(map(observer => (observer.matches ? 'yes' : 'no')));

    ngOnInit(): void {
        this.matDialogRef.backdropClick().subscribe(async () => await this.closeDialog());
        if(this.data.id == null || this.data.id > 0) {
            this.form = this.fb.group({
                maDviCuutro: new FormControl('', {}),
                tenDviCuutro: new FormControl('', {}),
                trangThai: new FormControl('', {}),
            });
        }
        else {
            this.form = this.fb.group({
                maDviCuutro: new FormControl(this.data.maDviCuutro),
                tenDviCuutro: new FormControl(this.data.tenDviCuutro),
                trangThai: new FormControl(this.data.trangThai),
            });
        }
    }
    get maDviCuutro() {
        return this.form.controls.maDviCuutro as FormControl;
    }
    get tenDviCuutro() {
        return this.form.controls.tenDviCuutro as FormControl;
    }
    get trangThai() {
        return this.form.controls.trangThai as FormControl;
    }

    async closeDialog() {
        this.matDialogRef.close();
        this.resetForm();
    }

    submitForm() {
        if (this.form.valid) {
            let data = this.form.getRawValue();
            const options:PaginateOptions = {pageIndex: 0, pageSize: 10};
            this.spinner.show();
            if(this.data.id != null && this.data.id > 0){
                data.id = this.data.id;
                this.service.update(data, options).subscribe(() => {
                    this.spinner.hide();
                    this.closeDialog();
                    this.dialog.open(ConfirmationDialog, {
                        data: {
                            title: 'Cập nhật thành công!',
                            message:
                                `Cập nhật thành công`,
                        },
                    });
                }, err => {
                    this.spinner.hide();
                });
            }
            else {
                data.id = 0;
                this.service.create(data, options).subscribe(() => {
                    this.spinner.hide();
                    this.closeDialog();
                    this.dialog.open(ConfirmationDialog, {
                        data: {
                            title: 'Thêm mới thành công!',
                            message:
                                `Thêm mới thành công`,
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
}
