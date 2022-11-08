
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as fileSaver from 'file-saver';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { LTD, TRANG_THAI_GUI_DVCT, Utils } from 'src/app/Utility/utils';

@Component({
    selector: 'app-tong-hop-bao-cao-tu-don-vi-cap-duoi',
    templateUrl: './tong-hop-bao-cao-tu-don-vi-cap-duoi.component.html',
})
export class TongHopBaoCaoTuDonViCapDuoiComponent implements OnInit {
    @Output() dataChange = new EventEmitter();

    namHienTai: number;
    trangThai: string = Utils.TT_BC_9;
    maDviTao: string;

    userInfo: any;
    trangThais: any[] = [
        {
            id: '9',
            ten: 'Tiếp nhận'
        },
        {
            id: '7',
            ten: 'Mới'
        },
        {
            id: '-1',
            ten: 'Chưa gửi đơn vị cấp trên'
        },
    ];
    donVis: any[] = [];
    dataTable: any[] = [];
    dataTableAll: any[] = [];
    statusNewReport = true;

    pages = {
        size: 10,
        page: 1,
    }
    totalElements = 0;
    totalPages = 0;

    filterTable: any = {
        soQd: '',
        ngayKy: '',
        namKeHoach: '',
        trichYeu: '',
        tenTrangThai: '',
    };
    constructor(
        private spinner: NgxSpinnerService,
        private lapThamDinhService: LapThamDinhService,
        private notification: NzNotificationService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private modal: NzModalService,
        private danhMuc: DanhMucHDVService,
        public userService: UserService,
        private datePipe: DatePipe,
        public globals: Globals,
    ) { }

    async ngOnInit() {
        this.userInfo = this.userService.getUserLogin();
        this.spinner.show();
        //khoi tao gia tri mac dinh
        this.maDviTao = this.userInfo?.MA_DVI;
        this.statusNewReport = this.userService.isAccessPermisson(LTD.SYNTHETIC_REPORT);
        //lay danh sach ca don vi truc thuoc
        await this.danhMuc.dMDviCon().toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.donVis = data.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        );

        this.search();
        this.spinner.hide();
    }

    async search() {
        this.spinner.show();
        let trangThais: string[] = [];
        if (this.trangThai) {
            trangThais = [this.trangThai];
        } else[
            trangThais = [Utils.TT_BC_9, Utils.TT_BC_7]
        ]
        const requestReport = {
            loaiTimKiem: "1",
            maDvi: this.maDviTao,
            namBcao: this.namHienTai,
            ngayTaoDen: "",
            ngayTaoTu: "",
            paggingReq: {
                limit: this.pages.size,
                page: this.pages.page,
            },
            trangThais: trangThais,
        };
        await this.lapThamDinhService.timBaoCaoLapThamDinh(requestReport).toPromise().then(res => {
            if (res.statusCode == 0) {
                this.dataTable = [];
                res.data.content.forEach(item => {
                    this.dataTable.push({
                        ...item,
                        ngayPheDuyet: this.datePipe.transform(item.ngayPheDuyet, Utils.FORMAT_DATE_STR),
                        ngayTraKq: this.datePipe.transform(item.ngayTraKq, Utils.FORMAT_DATE_STR),
                    })
                })
                this.dataTableAll = cloneDeep(this.dataTable);
                this.totalElements = res.data.totalElements;
                this.totalPages = res.data.totalPages;
            } else {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        }, err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
        this.spinner.hide();
    }

    //doi so trang
    onPageIndexChange(page) {
        this.pages.page = page;
        this.search();
    }

    //doi so luong phan tu tren 1 trang
    onPageSizeChange(size) {
        this.pages.size = size;
        this.search();
    }

    //reset tim kiem
    clearFilter() {
        this.namHienTai = null
        this.trangThai = null
        this.search();
    }

    getUnitName(maDvi: string) {
        return this.donVis.find(e => e.maDvi == maDvi)?.tenDvi;
    }

    getStatusName(trangThai: string) {
        return this.trangThais.find(e => e.id == trangThai)?.ten;
    }

    //them moi bao cao
    addNewReport() {

    }

    //xem chi tiet bao cao
    viewDetail(data: any) {
        const obj = {
            id: data.id,
            tabSelected: 'baocao',
        }
        this.dataChange.emit(obj);
    }

    // Tìm kiếm trong bảng
    filterInTable(key: string, value: string, isDate: boolean) {
        if (value && value != '') {
            this.dataTable = [];
            let temp = [];
            if (this.dataTableAll && this.dataTableAll.length > 0) {
                if (isDate) {
                    value = this.datePipe.transform(value, Utils.FORMAT_DATE_STR);
                }
                this.dataTableAll.forEach((item) => {
                    if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
                        temp.push(item)
                    }
                });
            }
            this.dataTable = [...this.dataTable, ...temp];
        } else {
            this.dataTable = cloneDeep(this.dataTableAll);
        }
    }
}
