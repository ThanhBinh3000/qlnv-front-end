
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { BaoCaoThucHienVonPhiService } from 'src/app/services/quan-ly-von-phi/baoCaoThucHienVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { LBC_KET_QUA_THUC_HIEN_HANG_DTQG, TRANG_THAI_GUI_DVCT, Utils } from 'src/app/Utility/utils';
import { DialogTaoMoiComponent } from '../dialog-tao-moi/dialog-tao-moi.component';

@Component({
    selector: 'app-tong-hop-bao-cao',
    templateUrl: './tong-hop-bao-cao.component.html',
    styleUrls: ['./tong-hop-bao-cao.component.scss'],
})
export class TongHopBaoCaoComponent implements OnInit {
    @Output() dataChange = new EventEmitter();

    searchFilter = {
        dotBcao: null,
        maBcao: '',
        maDvi: '',
        maDviCha: '',
        maLoaiBcao: null,
        maPhanBcao: '1',
        namBcao: null,
        ngayTaoDen: '',
        ngayTaoTu: '',
        paggingReq: {
            limit: 10,
            page: 1
        },
        str: '',
        thangBCao: '',
        trangThais: ['9'],
        loaiTimKiem: '1',
    };

    userInfo: any;
    trangThais: any = TRANG_THAI_GUI_DVCT;
    trangThai!: string;
    baoCaos: any = LBC_KET_QUA_THUC_HIEN_HANG_DTQG;
    ;
    totalElements = 0;
    totalPages = 0;
    statusNewReport = true;
    dataTable: any[] = [];
    dataTableAll: any[] = [];
    donVis: any[] = [];

    filterTable: any = {
        soQd: '',
        ngayKy: '',
        namKeHoach: '',
        trichYeu: '',
        tenTrangThai: '',
    };
    constructor(
        private spinner: NgxSpinnerService,
        private baoCaoThucHienVonPhiService: BaoCaoThucHienVonPhiService,
        private notification: NzNotificationService,
        private danhMuc: DanhMucHDVService,
        private modal: NzModalService,
        public userService: UserService,
        private datePipe: DatePipe,
        public globals: Globals,
    ) { }

    async ngOnInit() {
        this.userInfo = this.userService.getUserLogin();
        this.spinner.show();
        //lay danh sach danh muc
        this.danhMuc.dMDviCon().toPromise().then(
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
                        ngayPheDuyet: this.datePipe.transform(e.ngayPheDuyet, Utils.FORMAT_DATE_STR),
                        ngayDuyet: this.datePipe.transform(e.ngayDuyet, Utils.FORMAT_DATE_STR),
                        ngayTrinh: this.datePipe.transform(e.ngayTrinh, Utils.FORMAT_DATE_STR),
                        ngayTraKq: this.datePipe.transform(e.ngayTraKq, Utils.FORMAT_DATE_STR),
                        ngayTao: this.datePipe.transform(e.ngayTao, Utils.FORMAT_DATE_STR),
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
        this.searchFilter.dotBcao = null
        this.searchFilter.maLoaiBcao = null
        this.search();
    }

    getStatusName(trangThai: string) {
        return this.trangThais.find(e => e.id == trangThai)?.ten;
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
            },
        });
        modalTuChoi.afterClose.toPromise().then(async (res) => {
            if (res) {
                const obj = {
                    ...res,
                    id: null,
                    tabSelected: 'baocao',
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
