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
    ngayLap!: string;
    maDvi!: string;
    ghiChu!: string;
    trangThai!: string;
    nam!: number;
}

@Component({
    selector: 'dialog-danh-sach-bao-cao-dieu-chinh-du-toan',
    templateUrl: './dialog-danh-sach-bao-cao-dieu-chinh-du-toan.component.html',
    styleUrls: ['./dialog-danh-sach-bao-cao-dieu-chinh-du-toan.component.scss'],
})
export class DialogDanhSachBaoCaoDieuChinhDuToanComponent implements OnInit {
    @Input() maDvi: any;

    searchFilter = {
        tuNgayQd: null,
        denNgayQd: null,
        tuNgayGn: null,
        denNgayGn: null,
        soQd:null,
        nam: null,
    };

    donVis: any = [];
    trangThais: any[] = TRANGTHAIBANGHI;

    totalPages: number = 0;
    totalElements: number = 0;

    pages = {
        size: 10,
        page: 1,
    };


    listId: string = "";

    lstCTietBCao: ItemData[] = [];
    constructor(
        private _modalRef: NzModalRef,
        private notification: NzNotificationService,
        private spinner: NgxSpinnerService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private datePipe: DatePipe,
        private danhMucService: DanhMucHDVService,
    ) { }

    async ngOnInit() {
        await this.danhMucService.dMDonVi().toPromise().then(
            (data) => {
                 if (data.statusCode == 0) {
                      this.donVis = data.data;
                 } else {
                      this.notification.error(MESSAGE.ERROR, data?.msg);
                 }
            },
            (err) => {
                 this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
       );
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
            soQd: "",
        }

        this.quanLyVonPhiService.danhSachDieuChinh(request).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.lstCTietBCao = data.data.content;
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


    //doi so trang
    onPageIndexChange(page) {
        this.pages.page = page;
        this.updateListId();
        this.getDetailReport();
    }

    //doi so luong phan tu tren 1 trang
    onPageSizeChange(size) {
        this.pages.size = size;
        this.updateListId();
        this.getDetailReport();
    }

    getUnitName(maDvi: string){
        return this.donVis.find(e => e.maDvi == maDvi)?.tenDvi;
    }

    getStatusName(trangThai: string){
        return this.trangThais.find(e => e.id == trangThai)?.tenDm;
    }
    
    updateListId(){
        this.lstCTietBCao.forEach(item => {
            if (item.checked && this.listId.indexOf(item.id.toString())==-1){
                this.listId += item.id.toString() + ',';
            }
            if (!item.checked && this.listId.indexOf(item.id.toString())!=-1){
                let str = item.id.toString()+',';
                this.listId.replace(str, '');
            }
        })
    }

    handleOk() {
        this.updateListId();
        this._modalRef.close(this.listId);
    }

    handleCancel() {
        this._modalRef.close();
    }
}
[]