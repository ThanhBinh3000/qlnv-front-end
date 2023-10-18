import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Roles, Status, Utils } from 'src/app/Utility/utils';
import { MESSAGE } from 'src/app/constants/message';
import { CapVonMuaBanTtthService } from 'src/app/services/quan-ly-von-phi/capVonMuaBanTtth.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Cvmb, Search } from '../../cap-von-mua-ban-va-thanh-toan-tien-hang.constant';
import { Tab, Vb } from '../von-ban.constant';
import { DialogTaoMoiComponent } from '../dialog-tao-moi/dialog-tao-moi.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DialogTongHopComponent } from '../dialog-tong-hop/dialog-tong-hop.component';
// import { DialogTaoMoiCapVonComponent } from '../dialog-tao-moi-cap-von/dialog-tao-moi-cap-von.component';

@Component({
    selector: 'app-danh-sach-von-ban-tu-dvcd',
    templateUrl: './danh-sach-von-ban-tu-dvcd.component.html',
    styleUrls: ['../von-ban.component.scss']
})
export class DanhSachVonBanTuDvcdComponent implements OnInit {
    @Input() dataInfo: any;
    @Output() dataChange = new EventEmitter();
    Utils = Utils;
    Status = Status;
    Cvmb = Cvmb;
    Vb = Vb;
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
        private capVonMuaBanTtthService: CapVonMuaBanTtthService,
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
        this.synthStatus = this.userService.isAccessPermisson(Roles.CVMB.SYNTH_VB)
        this.searchFilter.loaiTimKiem = '1';
        this.searchFilter.trangThai = Status.TT_07;
        this.searchFilter.maLoai = Cvmb.VON_BAN;
        this.search();
        this.spinner.hide();
    }

    async search() {
        this.spinner.show();
        await this.capVonMuaBanTtthService.timKiemVonMuaBan(this.searchFilter.request()).toPromise().then(
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
            nzTitle: 'Thông tin tạo mới',
            nzContent: DialogTongHopComponent,
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
            tabSelected: data.canCuVeGia == Cvmb.DON_GIA ? Tab.VB_DON_GIA : Tab.VB_HOP_DONG,
        }
        this.dataChange.emit(obj);
    }
}
