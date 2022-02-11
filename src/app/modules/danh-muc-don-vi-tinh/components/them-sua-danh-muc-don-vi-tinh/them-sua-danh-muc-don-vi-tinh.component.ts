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
import { DanhMucDonViTinhService } from '../../services';
import * as myGlobals from '../../../../globals';
import { PaginateOptions } from 'src/app/modules/types';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationDialog } from 'src/app/modules/shared/dialogs';
import { leadingComment } from '@angular/compiler';

@Component({
    selector: 'them-sua-danh-muc-don-vi-tinh',
    templateUrl: './them-sua-danh-muc-don-vi-tinh.component.html',
    styleUrls: ['./them-sua-danh-muc-don-vi-tinh.component.scss'],
})
export class ThemSuaDanhMucDonViTinh implements OnInit {
    @ViewChild('f', { static: true })
    formDirective: NgForm;

    constructor(
        private fb: FormBuilder,
        private matDialogRef: MatDialogRef<ThemSuaDanhMucDonViTinh>,
        private breakpointObserver: BreakpointObserver,
        private service: DanhMucDonViTinhService,
        private spinner: NgxSpinnerService,
        private dialog: MatDialog,
        private cdr: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            title: string,
            isView: boolean,
            maDviTinh: string,
            tenDviTinh: string,
            kyHieu: string,
            id: number,
            dviDo: string,
            trangThai: string
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

    listDonViDo = []

    private unsubscribed$ = new Subject();

    smallScreen$ = this.breakpointObserver
        .observe(['(max-width: 1200px)'])
        .pipe(map(observer => (observer.matches ? 'yes' : 'no')));

    ngOnInit(): void {
        this.matDialogRef.backdropClick().subscribe(async () => await this.closeDialog());
        if (this.data.id == null || this.data.id > 0) {
            this.form = this.fb.group({
                maDviTinh: new FormControl('', {}),
                tenDviTinh: new FormControl('', {}),
                kyHieu: new FormControl('', {}),
                dviDo: new FormControl('', {}),
                trangThai: new FormControl('', {}),
            });
        }
        else {
            this.form = this.fb.group({
                maDviTinh: new FormControl(this.data.maDviTinh),
                tenDviTinh: new FormControl(this.data.tenDviTinh),
                kyHieu: new FormControl(this.data.kyHieu),
                dviDo: new FormControl(this.data.dviDo),
                trangThai: new FormControl(this.data.trangThai),
            });
        }
    }
    get maDviTinh() {
        return this.form.controls.maDviTinh as FormControl;
    }
    get tenDviTinh() {
        return this.form.controls.tenDviTinh as FormControl;
    }
    get kyHieu() {
        return this.form.controls.kyHieu as FormControl;
    }
    get dviDo() {
        return this.form.controls.dviDo as FormControl;
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
            const options: PaginateOptions = { pageIndex: 0, pageSize: 10 };
            this.spinner.show();
            if (this.data.id != null && this.data.id > 0) {
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
                    console.log(err);
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
