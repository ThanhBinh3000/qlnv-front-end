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
import { DanhMucDiaBanHanhChinhService } from '../../services';
import * as myGlobals from '../../../../globals';
import { PaginateOptions } from 'src/app/modules/types';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationDialog } from 'src/app/modules/shared/dialogs';
import { leadingComment } from '@angular/compiler';

@Component({
    selector: 'them-sua-danh-muc-quan-huyen',
    templateUrl: './them-sua-danh-muc-quan-huyen.component.html',
    styleUrls: ['./them-sua-danh-muc-quan-huyen.component.scss'],
})
export class ThemSuaDanhMucQuanHuyen implements OnInit {
    @ViewChild('f', { static: true })
    formDirective: NgForm;

    constructor(
        private fb: FormBuilder,
        private matDialogRef: MatDialogRef<ThemSuaDanhMucQuanHuyen>,
        private breakpointObserver: BreakpointObserver,
        private service: DanhMucDiaBanHanhChinhService,
        private spinner: NgxSpinnerService,
        private dialog: MatDialog,
        private cdr: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            title: string,
            isView: boolean,
            maCha: string,
            maDbhc: string,
            maHchinh: string,
            id: number,
            tenDbhc: string,
            cap: string,
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
            value: "1",
            text: "Hiện"
        }, 
    ]

    private unsubscribed$ = new Subject(); 

    smallScreen$ = this.breakpointObserver
        .observe(['(max-width: 1200px)'])
        .pipe(map(observer => (observer.matches ? 'yes' : 'no')));

    ngOnInit(): void {
        // this.service.getAll().subscribe(x => {
        //     this.listDonViCha = [];
        //     if(x && x.data && x.data.length > 0) {
        //         for(let i = 0; i < x.data.length; i++) {
        //             let itemDvi = {
        //                 value: x.data[i].id,
        //                 text: x.data[i].tenDvi
        //             }
        //             this.listDonViCha.push(itemDvi);
        //         }
        //     }
        //     console.log(this.listDonViCha)
        // });
        this.matDialogRef.backdropClick().subscribe(async () => await this.closeDialog());
        if(this.data.id == null || this.data.id > 0) {
            this.form = this.fb.group({
                cap: new FormControl('', {}),
                maCha: new FormControl('', {}),
                maDbhc: new FormControl('', {}),
                maHchinh: new FormControl('', {}),
                tenDbhc: new FormControl('', {}),
                trangThai: new FormControl('', {})

            });
        }
        else {
            this.form = this.fb.group({
                cap: new FormControl(this.data.cap),
                maCha: new FormControl(this.data.maCha),
                maDbhc: new FormControl(this.data.maDbhc),
                maHchinh: new FormControl(this.data.maHchinh),
                tenDbhc: new FormControl(this.data.tenDbhc),
                trangThai: new FormControl(this.data.trangThai)
            });
        }
    }
    get cap() {
        return this.form.controls.cap as FormControl;
    }
    get maCha() {
        return this.form.controls.maCha as FormControl;
    }
    get maDbhc() {
        return this.form.controls.maDbhc as FormControl;
    }
    get maHchinh() {
        return this.form.controls.maHchinh as FormControl;
    }
    get tenDbhc() {
        return this.form.controls.tenDbhc as FormControl;
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
                data.cap = 1;
                data.maCha = 0;
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
