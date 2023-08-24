import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Roles, Status, Utils } from 'src/app/Utility/utils';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { DieuChinhService } from 'src/app/services/quan-ly-von-phi/dieuChinhDuToan.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { DialogTaoMoiComponent } from '../dialog-tao-moi/dialog-tao-moi.component';
import { Dcdt } from '../dieu-chinh-du-toan.constant';

@Component({
    selector: 'app-tong-hop-bao-cao',
    templateUrl: './tong-hop-bao-cao.component.html',
})
export class TongHopBaoCaoComponent implements OnInit {
    @Output() dataChange = new EventEmitter();
    Status = Status;
    Utils = Utils;

    namHienTai: number;
    trangThai: string = Status.TT_09;
    maDviTao: string;

    userInfo: any;
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

    constructor(
        private spinner: NgxSpinnerService,
        public userService: UserService,
        private notification: NzNotificationService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private modal: NzModalService,
        private datePipe: DatePipe,
        private danhMuc: DanhMucHDVService,
        private dieuChinhService: DieuChinhService,
    ) { }

    async ngOnInit() {
        this.userInfo = this.userService.getUserLogin();
        this.spinner.show();
        this.maDviTao = this.userInfo.MA_DVI;
        this.statusNewReport = this.userService.isAccessPermisson(Roles.DCDT.SYNTHETIC_REPORT);
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
    };


    async search() {
        this.spinner.show();
        let trangThais: string[] = [];
        if (this.trangThai) {
            trangThais = [this.trangThai];
        } else[
            trangThais = [Status.TT_09, Status.TT_07]
        ]

        const requestReport = {
            loaiTimKiem: "1",
            maBcao: null,
            maDvi: this.maDviTao,
            maLoaiBcao: null,
            namBcao: this.namHienTai,
            ngayTaoDen: null,
            ngayTaoTu: null,
            paggingReq: {
                limit: this.pages.size,
                page: this.pages.page,
            },
            trangThais: trangThais,
        };

        await this.dieuChinhService.timKiemDieuChinh(requestReport).toPromise().then(
            (res) => {
                if (res.statusCode == 0) {
                    this.dataTable = [];
                    res.data.content.forEach(item => {
                        this.dataTable.push({
                            ...item,
                        })
                    })
                    this.dataTableAll = cloneDeep(this.dataTable);
                    this.totalElements = res.data.totalElements;
                    this.totalPages = res.data.totalPages;
                } else {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        );

        this.spinner.hide();
    };

    clearFilter() {
        this.namHienTai = null;
        this.trangThai = null;
        this.maDviTao = null;
        this.search();
    }

    addNewReport() {
        const modalTuChoi = this.modal.create({
            nzTitle: 'Thông tin tổng hợp báo cáo',
            nzContent: DialogTaoMoiComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {
                tab: Dcdt.DANH_SACH_TONG_HOP
            },
        });
        modalTuChoi.afterClose.toPromise().then(async (res) => {
            if (res) {
                const obj = {
                    baoCao: res,
                    id: null,
                    tabSelected: Dcdt.BAO_CAO_01,
                    isSynthetic: true,
                }
                this.dataChange.emit(obj);
            }
        });
    };
    viewDetail(data: any) {
        const obj = {
            id: data.id,
            tabSelected: Dcdt.BAO_CAO_01,
        }
        this.dataChange.emit(obj);
    };

    //doi so trang
    onPageIndexChange(page) {
        this.pages.page = page;
        this.search();
    };

    //doi so luong phan tu tren 1 trang
    onPageSizeChange(size) {
        this.pages.size = size;
        this.search();
    };

}
