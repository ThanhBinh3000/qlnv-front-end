import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { CapVonMuaBanTtthService } from 'src/app/services/quan-ly-von-phi/capVonMuaBanTtth.service';
import { UserService } from 'src/app/services/user.service';
import { CVMB, LOAI_VON, TRANG_THAI_TIM_KIEM, Utils } from 'src/app/Utility/utils';

@Component({
    selector: 'app-danh-sach-ghi-nhan-cap-ung-von-tai-ckv-cc',
    templateUrl: './danh-sach-ghi-nhan-cap-ung-von-tai-ckv-cc.component.html',
    //styleUrls: ['./danh-sach-ghi-nhan-cap-ung-von-tai-ckv-cc.component.scss']
})
export class DanhSachGhiNhanCapUngVonTaiCkvCcComponent implements OnInit {
    @Output() dataChange = new EventEmitter();

    //thong tin user
    userInfo: any;
    //thong tin tim kiem
    searchFilter = {
        maCvUv: "",
        trangThai: Utils.TT_BC_1,
        tuNgay: null,
        denNgay: null,
        ngayLap: "",
        maDvi: "",
    };

    tableFilter = {
        maDn: null,
        qdChiTieu: null,
        canCuGia: null,
        loaiDn: null,
        ngayTao: null,
        ngayTrinh: null,
        ngayPheDuyet: null,
        trangThai: null,
    }

    // danh sach
    dataTable: any[] = [];
    dataTableAll: any[] = [];
    trangThais: any[] = TRANG_THAI_TIM_KIEM;
    loaiVons: any[] = LOAI_VON;
    danhSachCapVon: any[] = [];
    //phan trang
    totalElements = 0;
    totalPages = 0;
    pages = {
        size: 10,
        page: 1,
    }

    constructor(
        private spinner: NgxSpinnerService,
        private notification: NzNotificationService,
        private danhMuc: DanhMucHDVService,
        private modal: NzModalService,
        public userService: UserService,
        private capVonMuaBanTtthService: CapVonMuaBanTtthService,
        private datePipe: DatePipe,
    ) { }

    async ngOnInit() {
        this.userInfo = this.userService.getUserLogin();
        this.spinner.show();
        //khoi tao gia tri mac dinh
        this.searchFilter.denNgay = new Date();
        const newDate = new Date();
        newDate.setMonth(newDate.getMonth() - 1);
        this.searchFilter.tuNgay = newDate;
        this.searchFilter.maDvi = this.userInfo?.MA_DVI;
        //neu co quyen phe duyet thi trang thai mac dinh la trinh duyet
        if (this.userService.isAccessPermisson(CVMB.DUYET_REPORT_GNV)) {
            this.searchFilter.trangThai = Utils.TT_BC_2;
        } else {
            if (this.userService.isAccessPermisson(CVMB.PHE_DUYET_REPORT_GNV)) {
                this.searchFilter.trangThai = Utils.TT_BC_4;
            }
        }
        await this.getDanhSachCapVon();
        this.search();
        this.spinner.hide();
    }

    async getDanhSachCapVon() {
        const request = {
            maCapUngVonChoCapDuoi: "",
            ngayTaoTu: "",
            ngayTaoDen: "",
            maDvi: this.userInfo.DON_VI?.maDviCha,
            trangThai: Utils.TT_BC_7,
            paggingReq: {
                limit: 1000,
                page: 1
            }
        }
        await this.capVonMuaBanTtthService.timKiemCapVon(request).toPromise().then(
            (data) => {
                if (data?.statusCode == 0) {
                    this.danhSachCapVon = data.data.content;
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        );
    }

    async search() {
        const requestReport = {
            maCapUngVonTuCapTren: this.searchFilter.maCvUv,
            maDvi: this.userInfo?.MA_DVI,
            maLoai: "1",
            ngayLap: this.datePipe.transform(this.searchFilter.ngayLap, Utils.FORMAT_DATE_STR),
            ngayTaoDen: this.datePipe.transform(this.searchFilter.denNgay, Utils.FORMAT_DATE_STR),
            ngayTaoTu: this.datePipe.transform(this.searchFilter.tuNgay, Utils.FORMAT_DATE_STR),
            paggingReq: {
                limit: this.pages.size,
                page: this.pages.page,
            },
            trangThai: this.searchFilter.trangThai,
        };
        this.spinner.show();
        await this.capVonMuaBanTtthService.timKiemVonMuaBan(requestReport).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.dataTable = [];
                    data.data.content.forEach(item => {
                        this.dataTable.push({
                            ...item,
                            ngayLap: this.datePipe.transform(item.ngayLap, Utils.FORMAT_DATE_STR),
                            ngayNhan: this.datePipe.transform(item.ngayNhan, Utils.FORMAT_DATE_STR),
                            ngayTao: this.datePipe.transform(item.ngayTao, Utils.FORMAT_DATE_STR),
                            ngayTrinh: this.datePipe.transform(item.ngayTrinh, Utils.FORMAT_DATE_STR),
                            ngayDuyet: this.datePipe.transform(item.ngayDuyet, Utils.FORMAT_DATE_STR),
                            ngayPheDuyet: this.datePipe.transform(item.ngayPheDuyet, Utils.FORMAT_DATE_STR),
                            isEdit: this.checkEditStatus(item.trangThai),
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
        this.searchFilter.maCvUv = null
        this.searchFilter.trangThai = null
        this.searchFilter.tuNgay = null
        this.searchFilter.denNgay = null
        this.searchFilter.ngayLap = null
        this.search();
    }

    getStatusName(trangThai: string) {
        return this.trangThais.find(e => e.id == trangThai)?.tenDm;
    }

    //xem chi tiet bao cao
    viewDetail(data: any) {
        const obj = {
            id: data.id,
            tabSelected: 'bc-gnv',
        }
        this.dataChange.emit(obj);
    }

    checkEditStatus(trangThai: string) {
        return Utils.statusSave.includes(trangThai) && this.userService.isAccessPermisson(CVMB.EDIT_REPORT_GNV);
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
