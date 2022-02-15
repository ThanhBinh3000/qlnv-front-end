import { DonViTinhModel } from '../../../danh-muc-don-vi-tinh/types';
import { DanhMucDonViTinhService } from '../../../danh-muc-don-vi-tinh/services/danh-muc-don-vi-tinh.service';
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
import { DanhMucKeLotService } from '../../services';
import * as myGlobals from '../../../../globals';
import { PaginateOptions } from 'src/app/modules/types';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationDialog } from 'src/app/modules/shared/dialogs';
import { leadingComment } from '@angular/compiler';

@Component({
    selector: 'them-sua-danh-muc-ke-lot',
    templateUrl: './them-sua-danh-muc-ke-lot.component.html',
    styleUrls: ['./them-sua-danh-muc-ke-lot.component.scss'],
})
export class ThemSuaDanhMucKeLot implements OnInit {
    @ViewChild('f', { static: true })
    formDirective: NgForm;

    constructor(
        private fb: FormBuilder,
        private matDialogRef: MatDialogRef<ThemSuaDanhMucKeLot>,
        private breakpointObserver: BreakpointObserver,
        private service: DanhMucKeLotService,
        private spinner: NgxSpinnerService,
        private dialog: MatDialog,
        private cdr: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            id: number,
            maKieuKelot: string,
            tenKieuKelot: string,
            ghiChu: string,
            trangThai: string
        },
    ) {
    }
    donViTinhList: Array<DonViTinhModel>;
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
                maKieuKelot: new FormControl('', {}),
                tenKieuKelot: new FormControl('', {}),
                ghiChu: new FormControl('', {}),
                trangThai: new FormControl('', {}),
            });
        }
        else {
            this.form = this.fb.group({
                maKieuKelot: new FormControl(this.data.maKieuKelot),
                tenKieuKelot: new FormControl(this.data.tenKieuKelot),
                ghiChu: new FormControl(this.data.ghiChu),
                trangThai: new FormControl(this.data.trangThai)
            });
        }
    }
    get maKieuKelot() {
        return this.form.controls.maKieuKelot as FormControl;
    }
    get tenKieuKelot() {
        return this.form.controls.tenKieuKelot as FormControl;
    }
    get ghiChu() {
        return this.form.controls.ghiChu as FormControl;
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
