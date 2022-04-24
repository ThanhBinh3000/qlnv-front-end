import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { TRANGTHAIBANGHI, Utils } from 'src/app/Utility/utils';

export class ItemData {
    id!: any;
    checked!: boolean;
    soQd!: string;
    ngayQd!: string;
    veViec!: string;
    ngayGn!: string;
    trangThai!: string;
    lstCtiet!: any[];
    nam!: number;
}

@Component({
    selector: 'dialog-danh-sach-ke-hoach-phan-bo-giao-du-toan-cua-don-vi',
    templateUrl: './dialog-danh-sach-ke-hoach-phan-bo-giao-du-toan-cua-don-vi.component.html',
    styleUrls: ['./dialog-danh-sach-ke-hoach-phan-bo-giao-du-toan-cua-don-vi.component.scss'],
})
export class DialogDanhSachKeHoachPhanBoGiaoDuToanComponent implements OnInit {
    @Input() maDvi: any;

    searchFilter = {
        tuNgayQd: null,
        denNgayQd: null,
        tuNgayGn: null,
        denNgayGn: null,
        soQd:null,
        nam: null,
    };

    trangThais: any[] = TRANGTHAIBANGHI;

    totalPages: number = 0;
    totalElements: number = 0;

    pages = {
        size: 10,
        page: 1,
    };



    lstCTietBCao: ItemData[] = [];
    constructor(
        private _modalRef: NzModalRef,
        private notification: NzNotificationService,
        private spinner: NgxSpinnerService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private datePipe: DatePipe,
    ) { }

    async ngOnInit() {

    }

    getDetailReport() {
        this.spinner.show();

        let request = {
            //maDvi: this.searchFilter.maDviTao,
            tuNgayQd: this.datePipe.transform(this.searchFilter.tuNgayQd, Utils.FORMAT_DATE_STR),
            denNgayQd: this.datePipe.transform(this.searchFilter.denNgayQd, Utils.FORMAT_DATE_STR),
            tuNgayGn: this.datePipe.transform(this.searchFilter.tuNgayGn, Utils.FORMAT_DATE_STR),
            denNgayGn: this.datePipe.transform(this.searchFilter.denNgayGn, Utils.FORMAT_DATE_STR),
            nam: this.searchFilter.nam,
            maDvi: this.maDvi,
            paggingReq: {
                limit: this.pages.size,
                page: this.pages.page,
            },
        }

        this.quanLyVonPhiService.timKiemGiaoPhanBo(request).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.lstCTietBCao = data.data.content;
                    this.lstCTietBCao.forEach(item => {
                        item.ngayQd = this.datePipe.transform(item.ngayQd, Utils.FORMAT_DATE_STR);
                    })
                    this.totalElements = data.data.totalElements;
                    this.totalPages = data.data.totalPages;

                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        );
        this.spinner.hide();
    }

    updateChecked(id: any) {
        this.lstCTietBCao.forEach(item => {
            if (item.id != id) {
                item.checked = false;
            }
        })
    }

    //doi so trang
    onPageIndexChange(page) {
        this.pages.page = page;
        this.getDetailReport();
    }

    //doi so luong phan tu tren 1 trang
    onPageSizeChange(size) {
        this.pages.size = size;
        this.getDetailReport();
    }
    getStatusName(trangThai: string){
        return this.trangThais.find(e => e.id == trangThai)?.tenDm;
    }

    handleOk() {
        this.lstCTietBCao = this.lstCTietBCao.filter(e => e.checked == true);
        this._modalRef.close(this.lstCTietBCao[0]?.id);
    }

    handleCancel() {
        this._modalRef.close();
    }
}
[]