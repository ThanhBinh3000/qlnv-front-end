import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Roles, Status, Utils } from 'src/app/Utility/utils';
import { MESSAGE } from 'src/app/constants/message';
import { CapVonMuaBanTtthService } from 'src/app/services/quan-ly-von-phi/capVonMuaBanTtth.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Cvnc, Search } from '../de-nghi-cap-von-cac-don-vi.constant';
import { CapVonNguonChiService } from 'src/app/services/quan-ly-von-phi/capVonNguonChi.service';
import { DialogTongHopCapVonComponent } from '../dialog-tong-hop-cap-von/dialog-tong-hop-cap-von.component';
// import { DialogTaoMoiCapVonComponent } from '../dialog-tao-moi-cap-von/dialog-tao-moi-cap-von.component';

@Component({
    selector: 'app-danh-sach-de-nghi-cap-von-tu-dvcd',
    templateUrl: './danh-sach-de-nghi-cap-von-tu-dvcd.component.html',
    styleUrls: ['../de-nghi-cap-von-cac-don-vi.component.scss']
})
export class DanhSachDeNghiCapVonTuDvcdComponent implements OnInit {
    @Input() dataInfo: any;
    @Output() dataChange = new EventEmitter();
    Utils = Utils;
    Status = Status;
    Cvnc = Cvnc;
    //thong tin user
    userInfo: any;
    //thong tin tim kiem
    searchFilter: Search = new Search();
    // danh sach
    dataTable: any[] = [];
    dataTableAll: any[] = [];
    donVis: any[] = [];
    maDvi: string;
    synthStatus: boolean = false;
    //phan trang
    totalElements = 0;
    totalPages = 0;

    constructor(
        private spinner: NgxSpinnerService,
        private notification: NzNotificationService,
        public userService: UserService,
        private modal: NzModalService,
        private capVonNguonChiService: CapVonNguonChiService,
        private quanLyVonPhiService: QuanLyVonPhiService,
    ) { }

    async ngOnInit() {
        this.userInfo = this.userService.getUserLogin();
        this.spinner.show();
        //khoi tao gia tri mac dinh
        this.searchFilter.ngayTaoDen = new Date();
        const newDate = new Date();
        newDate.setMonth(newDate.getMonth() - 1);
        this.searchFilter.ngayTaoTu = newDate;
        this.searchFilter.maDvi = this.userInfo?.MA_DVI;
        const request = {
            maDviCha: this.userInfo.MA_DVI,
            trangThai: '01',
        }
        await this.quanLyVonPhiService.dmDviCon(request).toPromise().then(
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
        this.synthStatus = this.userService.isAccessPermisson(Roles.CVNC.SYNTH_DN)
        this.searchFilter.loaiTimKiem = '1';
        this.searchFilter.trangThai = Status.TT_07;
        this.searchFilter.maLoai = Cvnc.DE_NGHI;
        this.search();
        this.spinner.hide();
    }

    async search() {
        this.spinner.show();
        await this.capVonNguonChiService.timKiemDeNghi(this.searchFilter.request()).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.dataTable = [];
                    data.data.content.forEach(item => {
                        this.dataTable.push({
                            ...item,
                        })
                    })
                    this.dataTableAll = cloneDeep(this.dataTable);
                    this.totalElements = data.data.totalElements;
                    this.totalPages = data.data.totalPages;
                } else {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        );
        this.spinner.hide();
    }

    //doi so trang
    onPageIndexChange(page) {
        this.searchFilter.paggingReq.page = page;
        this.search();
    }

    //doi so luong phan tu tren 1 trang
    onPageSizeChange(size) {
        this.searchFilter.paggingReq.limit = size;
        this.search();
    }

    //reset tim kiem
    clearFilter() {
        this.searchFilter.clear();
        this.maDvi = null;
        this.searchFilter.maDvi = this.userInfo.MA_DVI;
        this.searchFilter.loaiTimKiem = '1';
        this.search();
    }

    changeModel() {
        if (this.maDvi) {
            this.searchFilter.loaiTimKiem = '0';
            this.searchFilter.maDvi = this.maDvi;
        } else {
            this.searchFilter.loaiTimKiem = '1';
            this.searchFilter.maDvi = this.userInfo.MA_DVI;
        }
    }

    addNewReport() {
        const modalTuChoi = this.modal.create({
            nzTitle: 'Thông tin tổng hợp',
            nzContent: DialogTongHopCapVonComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {
                request: this.searchFilter
            },
        });
        modalTuChoi.afterClose.toPromise().then(async (res) => {
            if (res) {
                this.dataChange.emit(res);
            }
        });
    }

    getUnitName(maDvi: string) {
        return this.donVis.find(e => e.maDvi == maDvi)?.tenDvi;
    }

    //xem chi tiet bao cao
    async viewDetail(data: any) {
        const obj = {
            id: data.id,
            tabSelected: data.canCuVeGia == Cvnc.DON_GIA ? Cvnc.DN_DON_GIA : Cvnc.DN_HOP_DONG,
        }
        this.dataChange.emit(obj);
    }
}
