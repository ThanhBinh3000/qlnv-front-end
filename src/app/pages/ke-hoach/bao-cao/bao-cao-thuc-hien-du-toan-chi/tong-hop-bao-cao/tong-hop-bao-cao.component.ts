
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Status, Utils } from 'src/app/Utility/utils';
import { MESSAGE } from 'src/app/constants/message';
import { BaoCaoThucHienDuToanChiService } from 'src/app/services/quan-ly-von-phi/baoCaoThucHienDuToanChi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { Dtc } from '../bao-cao-thuc-hien-du-toan-chi.constant';
import { DialogTaoMoiComponent } from '../dialog-tao-moi/dialog-tao-moi.component';

@Component({
    selector: 'app-tong-hop-bao-cao',
    templateUrl: './tong-hop-bao-cao.component.html',
    styleUrls: ['./tong-hop-bao-cao.component.scss'],
})
export class TongHopBaoCaoComponent implements OnInit {
    @Output() dataChange = new EventEmitter();
    Status = Status;
    Utils = Utils;
    Dtc = Dtc;
    searchFilter = {
        ngayTaoTu: '',
        ngayTaoDen: '',
        trangThais: [Status.TT_09],
        maBcao: '',
        maLoaiBcao: '',
        namBcao: null,
        thangBcao: null,
        dotBcao: '',
        paggingReq: {
            limit: 10,
            page: 1
        },
        str: '',
        donVi: '',
        maPhanBcao: '0',
        loaiTimKiem: '1',
    };

    userInfo: any;
    trangThai!: string;
    totalElements = 0;
    totalPages = 0;
    statusNewReport = true;
    dataTable: any[] = [];
    dataTableAll: any[] = [];
    donVis: any[] = [];

    constructor(
        private spinner: NgxSpinnerService,
        private baoCaoThucHienDuToanChiService: BaoCaoThucHienDuToanChiService,
        private notification: NzNotificationService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private modal: NzModalService,
        public userService: UserService,
        private datePipe: DatePipe,
        public globals: Globals,
    ) { }

    async ngOnInit() {
        this.userInfo = this.userService.getUserLogin();
        this.spinner.show();
        //khoi tao gia tri mac dinh
        const date = new Date();
        this.searchFilter.namBcao = date.getFullYear();
        this.searchFilter.thangBcao = date.getMonth();
        this.searchFilter.maLoaiBcao = Dtc.BC_DINH_KY;
        //lay danh sach danh muc
        const request = {
            maDviCha: this.userInfo.maDvi,
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
        this.search();
        this.spinner.hide();
    }

    async search() {
        this.spinner.show();
        await this.baoCaoThucHienDuToanChiService.timBaoCao(this.searchFilter).toPromise().then(res => {
            if (res.statusCode == 0) {
                this.dataTable = [];
                res.data.content.forEach(e => {
                    this.dataTable.push({
                        ...e,
                    })
                })
                this.dataTableAll = cloneDeep(this.dataTable);
                this.totalElements = res.data.totalElements;
                this.totalPages = res.data.totalPages;
            } else {
                this.notification.error(MESSAGE.ERROR, res?.msg);
            }
        }, err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
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
        this.searchFilter.namBcao = null
        this.searchFilter.thangBcao = null
        this.searchFilter.maLoaiBcao = null
        this.search();
    }

    // lay ten don vi tao
    getUnitName(dvitao: any) {
        return this.donVis.find(item => item.maDvi == dvitao)?.tenDvi;
    }

    //them moi bao cao
    addNewReport() {
        const modalTuChoi = this.modal.create({
            nzTitle: 'Thông tin tổng hợp báo cáo thực hiện dự toán chi NSNN',
            nzContent: DialogTaoMoiComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {
            },
        });
        modalTuChoi.afterClose.toPromise().then(async (res) => {
            if (res) {
                const obj = {
                    ...res,
                    id: null,
                    tabSelected: Dtc.BAO_CAO_01,
                    isSynthetic: true,
                }
                this.dataChange.emit(obj);
            }
        });
    }

    //xem chi tiet bao cao
    viewDetail(data: any) {
        const obj = {
            id: data.id,
            tabSelected: Dtc.BAO_CAO_01,
        }
        this.dataChange.emit(obj);
    }
}
