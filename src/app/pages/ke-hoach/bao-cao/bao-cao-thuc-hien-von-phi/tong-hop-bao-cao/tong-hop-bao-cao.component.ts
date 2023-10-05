
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Status, Utils } from 'src/app/Utility/utils';
import { MESSAGE } from 'src/app/constants/message';
import { BaoCaoThucHienVonPhiService } from 'src/app/services/quan-ly-von-phi/baoCaoThucHienVonPhi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { Search, Vp } from '../bao-cao-thuc-hien-von-phi.constant';
import { DialogTaoMoiComponent } from '../dialog-tao-moi/dialog-tao-moi.component';

@Component({
    selector: 'app-tong-hop-bao-cao',
    templateUrl: './tong-hop-bao-cao.component.html',
    // styleUrls: ['./tong-hop-bao-cao.component.scss'],
})
export class TongHopBaoCaoComponent implements OnInit {
    @Output() dataChange = new EventEmitter();
    Vp = Vp;
    Status = Status;
    Utils = Utils;

    searchFilter: Search = new Search();
    userInfo: any;
    trangThai: string = Status.TT_09;
    totalElements = 0;
    totalPages = 0;
    statusNewReport = true;
    dataTable: any[] = [];
    dataTableAll: any[] = [];
    donVis: any[] = [];

    constructor(
        private spinner: NgxSpinnerService,
        private baoCaoThucHienVonPhiService: BaoCaoThucHienVonPhiService,
        private notification: NzNotificationService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private modal: NzModalService,
        public userService: UserService,
        public globals: Globals,
    ) { }

    async ngOnInit() {
        this.searchFilter.loaiTimKiem = '1';
        this.searchFilter.trangThais = [Status.TT_09];
        this.userInfo = this.userService.getUserLogin();
        this.spinner.show();
        //lay danh sach danh muc
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
        this.search();
        this.spinner.hide();
    }

    async search() {
        this.spinner.show();
        await this.baoCaoThucHienVonPhiService.timBaoCao(this.searchFilter).toPromise().then(res => {
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
        this.searchFilter.clear();
        this.search();
    }

    // lay ten don vi tao
    getUnitName(dvitao: any) {
        return this.donVis.find(item => item.maDvi == dvitao)?.tenDvi;
    }

    //them moi bao cao
    addNewReport() {
        const modalTuChoi = this.modal.create({
            nzTitle: 'Thông tin tổng hợp báo cáo kết quả thực hiện vốn phí hàng DTQG',
            nzContent: DialogTaoMoiComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {
                isSynth: true,
            },
        });
        modalTuChoi.afterClose.toPromise().then(async (res) => {
            if (res) {
                const obj = {
                    id: null,
                    baoCao: res,
                    tabSelected: Vp.BAO_CAO_01,
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
            tabSelected: Vp.BAO_CAO_01,
        }
        this.dataChange.emit(obj);
    }
}
