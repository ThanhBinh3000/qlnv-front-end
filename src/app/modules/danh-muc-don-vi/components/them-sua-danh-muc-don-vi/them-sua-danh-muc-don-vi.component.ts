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
import { DanhMucDonViService } from '../../services';
import * as myGlobals from '../../../../globals';
import { PaginateOptions } from 'src/app/modules/types';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationDialog } from 'src/app/modules/shared/dialogs';
import { leadingComment } from '@angular/compiler';

@Component({
    selector: 'them-sua-danh-muc-don-vi',
    templateUrl: './them-sua-danh-muc-don-vi.component.html',
    styleUrls: ['./them-sua-danh-muc-don-vi.component.scss'],
})
export class ThemSuaDanhMucDonVi implements OnInit {
    @ViewChild('f', { static: true })
    formDirective: NgForm;

    constructor(
        private fb: FormBuilder,
        private matDialogRef: MatDialogRef<ThemSuaDanhMucDonVi>,
        private breakpointObserver: BreakpointObserver,
        private service: DanhMucDonViService,
        private spinner: NgxSpinnerService,
        private dialog: MatDialog,
        private cdr: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            title: string,
            isView: boolean,
            capDvi: string,
            diaChi: string,
            ghiChu: string,
            id: number,
            kieuDvi: string,
            loaiDvi: string,
            maDvi: string,
            maDviCha: string,
            maHchinh: string,
            maPhuong: string,
            maQuan: string,
            maTinh: string,
            tenDvi: string,
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

    listCapDonVi = [
        {
            value: "1",
            text: "Tổng cục"
        },{
            value: "2",
            text: "Cục"
        },{
            value: "3",
            text: "Chi cục"
        },
    ]

    listLoaiDonVi = [
        {
            value: "TCDT",
            text: "Tổng cục Dự trữ"
        },{
            value: "BCA",
            text: "Bộ công an"
        },{
            value: "BQP",
            text: "Bộ quốc phòng"
        },{
            value: "BNN",
            text: "Bộ nông nghiệp"
        },{
            value: "BCT",
            text: "Bộ công thương"
        },{
            value: "DPT",
            text: "Đài phát thanh VN"
        },{
            value: "BGT",
            text: "Bộ giao thông"
        },{
            value: "BYT",
            text: "Bộ y tế"
        },{
            value: "DTH",
            text: "Đài truyền hình VN"
        },
    ]

    listDonViCha = [];

    private unsubscribed$ = new Subject();

    smallScreen$ = this.breakpointObserver
        .observe(['(max-width: 1200px)'])
        .pipe(map(observer => (observer.matches ? 'yes' : 'no')));

    ngOnInit(): void {
        this.service.getAll().subscribe(x => {
            this.listDonViCha = [];
            if(x && x.data && x.data.length > 0) {
                for(let i = 0; i < x.data.length; i++) {
                    let itemDvi = {
                        value: x.data[i].id,
                        text: x.data[i].tenDvi
                    }
                    this.listDonViCha.push(itemDvi);
                    console.log(this.listDonViCha)
                }
            }
        });
        this.matDialogRef.backdropClick().subscribe(async () => await this.closeDialog());
        if(this.data.id == null || this.data.id > 0) {
            this.form = this.fb.group({
                capDvi: new FormControl('', {}),
                diaChi: new FormControl('', {}),
                ghiChu: new FormControl('', {}),
                kieuDvi: new FormControl('', {}),
                loaiDvi: new FormControl('', {}),
                maDvi: new FormControl('', {}),
                maDviCha: new FormControl('', {}),
                maHchinh: new FormControl('', {}),
                maPhuong: new FormControl('', {}),
                maQuan: new FormControl('', {}),
                maTinh: new FormControl('', {}),
                tenDvi: new FormControl('', {}),
                trangThai: new FormControl('', {}),
            });
        }
        else {
            this.form = this.fb.group({
                capDvi: new FormControl(this.data.capDvi),
                diaChi: new FormControl(this.data.diaChi),
                ghiChu: new FormControl(this.data.ghiChu),
                kieuDvi: new FormControl(this.data.kieuDvi),
                loaiDvi: new FormControl(this.data.loaiDvi),
                maDvi: new FormControl(this.data.maDvi),
                maDviCha: new FormControl(this.data.maDviCha),
                maHchinh: new FormControl(this.data.maHchinh),
                maPhuong: new FormControl(this.data.maPhuong),
                maQuan: new FormControl(this.data.maQuan),
                maTinh: new FormControl(this.data.maTinh),
                tenDvi: new FormControl(this.data.tenDvi),
                trangThai: new FormControl(this.data.trangThai),
            });
        }
    }
    get capDvi() {
        return this.form.controls.capDvi as FormControl;
    }
    get diaChi() {
        return this.form.controls.diaChi as FormControl;
    }
    get ghiChu() {
        return this.form.controls.ghiChu as FormControl;
    }
    get kieuDvi() {
        return this.form.controls.kieuDvi as FormControl;
    }
    get loaiDvi() {
        return this.form.controls.loaiDvi as FormControl;
    }
    get maDvi() {
        return this.form.controls.maDvi as FormControl;
    }
    get maDviCha() {
        return this.form.controls.maDviCha as FormControl;
    }
    get maHchinh() {
        return this.form.controls.maHchinh as FormControl;
    }
    get maPhuong() {
        return this.form.controls.maPhuong as FormControl;
    }
    get maQuan() {
        return this.form.controls.maQuan as FormControl;
    }
    get maTinh() {
        return this.form.controls.maTinh as FormControl;
    }
    get tenDvi() {
        return this.form.controls.tenDvi as FormControl;
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
