import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { Component, Inject, Input, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { DanhMucHangDtqgService } from '../../services';
import * as myGlobals from '../../../../globals';
import { PaginateOptions } from 'src/app/modules/types';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationDialog } from 'src/app/modules/shared/dialogs';

@Component({
    selector: 'them-sua-danh-muc-hang-dtqg',
    templateUrl: './them-sua-danh-muc-hang-dtqg.component.html',
    styleUrls: ['./them-sua-danh-muc-hang-dtqg.component.scss'],
})
export class ThemSuaDanhMucHangDtqg implements OnInit {
    @ViewChild('f', { static: true })
    formDirective: NgForm;

    constructor(
        private fb: FormBuilder,
        private matDialogRef: MatDialogRef<ThemSuaDanhMucHangDtqg>,
        private breakpointObserver: BreakpointObserver,
        private service: DanhMucHangDtqgService,
        private spinner: NgxSpinnerService,
        private dialog: MatDialog,
        private cdr: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            title: string;
            isView: boolean;
            ghiChu: string;
            id: 0;
            ma: string;
            maCha: string;
            ten: string;
            trangThai: string;
        },
    ) {}

    @Input()
    errorMessages: string[];
    form: FormGroup;

    listTrangThai = [
        {
            value: '00',
            text: 'Ẩn',
        },
        {
            value: '01',
            text: 'Hiện',
        },
    ];

    listHangDtqgCha = [];

    private unsubscribed$ = new Subject();

    smallScreen$ = this.breakpointObserver
        .observe(['(max-width: 1200px)'])
        .pipe(map(observer => (observer.matches ? 'yes' : 'no')));

    ngOnInit(): void {
        this.service.getAll().subscribe(x => {
            this.listHangDtqgCha = [];
            if (x && x.data && x.data.length > 0) {
                for (let i = 0; i < x.data.length; i++) {
                    let itemDvi = {
                        value: x.data[i].id,
                        text: x.data[i].ten,
                    };
                    this.listHangDtqgCha.push(itemDvi);
                }
            }
            console.log(this.listHangDtqgCha);
        });
        this.matDialogRef.backdropClick().subscribe(async () => await this.closeDialog());
        if (this.data.id == null || this.data.id > 0) {
            this.form = this.fb.group({
                ghiChu: new FormControl('', {}),
                ma: new FormControl('', {}),
                maCha: new FormControl('', {}),
                ten: new FormControl('', {}),
                trangThai: new FormControl('', {}),
            });
        } else {
            console.log(this.data);
            
            this.form = this.fb.group({
                ghiChu: new FormControl(this.data.ghiChu),
                ma: new FormControl(this.data.ma),
                maCha: new FormControl(this.data.maCha),
                ten: new FormControl(this.data.ten),
                trangThai: new FormControl(this.data.trangThai)
            });
        }
    }
    get ghiChu() {
        return this.form.controls.ghiChu as FormControl;
    }
    get ma() {
        return this.form.controls.ma as FormControl;
    }
    get maCha() {
        return this.form.controls.maCha as FormControl;
    }
    get ten() {
        return this.form.controls.ten as FormControl;
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
                this.service.update(data, options).subscribe(
                    () => {
                        this.spinner.hide();
                        this.closeDialog();
                        this.dialog.open(ConfirmationDialog, {
                            data: {
                                title: 'Cập nhật thành công!',
                                message: `Cập nhật thành công`,
                            },
                        });
                    },
                    err => {
                        console.log(err);
                        this.spinner.hide();
                    },
                );
            } else {
                data.id = 0;
                this.service.create(data, options).subscribe(
                    () => {
                        this.spinner.hide();
                        this.closeDialog();
                        this.dialog.open(ConfirmationDialog, {
                            data: {
                                title: 'Thêm mới thành công!',
                                message: `Thêm mới thành công`,
                            },
                        });
                    },
                    err => {
                        console.log(err);
                        this.spinner.hide();
                    },
                );
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
