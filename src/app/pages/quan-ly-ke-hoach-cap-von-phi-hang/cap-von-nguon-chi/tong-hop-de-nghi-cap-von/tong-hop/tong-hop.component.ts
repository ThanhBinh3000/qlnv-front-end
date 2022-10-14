import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { CapVonNguonChiService } from 'src/app/services/quan-ly-von-phi/capVonNguonChi.service';
import { UserService } from 'src/app/services/user.service';
import { CVNC, NGUON_BAO_CAO, Utils } from 'src/app/Utility/utils';

@Component({
    selector: 'app-tong-hop',
    templateUrl: './tong-hop.component.html',
    styleUrls: ['./tong-hop.component.scss']
})
export class TongHopComponent implements OnInit {
    @Output() dataChange = new EventEmitter();
    //thong tin dang nhap
    userInfo: any;
    //thong tin tim kiem
    searchFilter = {
        loaiTimKiem: '0',
        maDeNghi: "",
        trangThai: Utils.TT_BC_1,
        tuNgay: null,
        denNgay: null,
        qdChiTieu: "",
        loaiDn: "",
        maDviTao: "",
    };
    //danh muc
    dataTable: any[] = [];
    dataTableAll: any[] = [];
    trangThais: any[] = [
        {
            id: Utils.TT_BC_1,
            tenDm: "Đang soạn",
        },
        {
            id: Utils.TT_BC_2,
            tenDm: "Trình duyệt",
        },
        {
            id: Utils.TT_BC_3,
            tenDm: "Từ chối duyệt",
        },
        {
            id: Utils.TT_BC_4,
            tenDm: "Duyệt",
        },
        {
            id: Utils.TT_BC_5,
            tenDm: "Từ chối phê duyệt",
        },
        {
            id: Utils.TT_BC_7,
            tenDm: "Phê duyệt",
        },
    ];
    nguonBcaos: any[] = NGUON_BAO_CAO;
    //phan trang
    totalElements = 0;
    totalPages = 0;
    pages = {
        size: 10,
        page: 1,
    }
    //trang thai
    allChecked = false;
    statusNewReport = true;

    constructor(
        private capVonNguonChiService: CapVonNguonChiService,
        private modal: NzModalService,
        private datePipe: DatePipe,
        private userService: UserService,
        private notification: NzNotificationService,
        private spinner: NgxSpinnerService,
    ) { }

    async ngOnInit() {
        this.spinner.show();
        this.userInfo = this.userService.getUserLogin();

        this.searchFilter.denNgay = new Date();
        const newDate = new Date();
        newDate.setMonth(newDate.getMonth() - 1);
        this.searchFilter.tuNgay = newDate;

        this.searchFilter.maDviTao = this.userInfo?.MA_DVI;

        if (!this.userService.isAccessPermisson(CVNC.ADD_SYNTHETIC_CKV) &&
            !this.userService.isAccessPermisson(CVNC.DUYET_SYNTHETIC_CKV) &&
            !this.userService.isAccessPermisson(CVNC.PHE_DUYET_SYNTHETIC_CKV)) {
            this.nguonBcaos = this.nguonBcaos.filter(e => e.id != Utils.THOP_TU_CUC_KV);
        }

        if (!this.userService.isAccessPermisson(CVNC.ADD_SYNTHETIC_TC) &&
            !this.userService.isAccessPermisson(CVNC.DUYET_SYNTHETIC_TC) &&
            !this.userService.isAccessPermisson(CVNC.PHE_DUYET_SYNTHETIC_TC)) {
            this.nguonBcaos = this.nguonBcaos.filter(e => e.id != Utils.THOP_TAI_TC);
        }

        if (this.userService.isAccessPermisson(CVNC.ADD_SYNTHETIC_CKV) || this.userService.isAccessPermisson(CVNC.ADD_SYNTHETIC_TC)) {
            this.statusNewReport = false;
        }

        if (this.userService.isAccessPermisson(CVNC.DUYET_SYNTHETIC_CKV) || this.userService.isAccessPermisson(CVNC.DUYET_SYNTHETIC_TC)) {
            this.searchFilter.trangThai = Utils.TT_BC_2;
        } else {
            if (this.userService.isAccessPermisson(CVNC.PHE_DUYET_SYNTHETIC_CKV) || this.userService.isAccessPermisson(CVNC.PHE_DUYET_SYNTHETIC_TC)) {
                this.searchFilter.trangThai = Utils.TT_BC_4;
            }
        }
        this.spinner.hide();
        this.search();
    }

    //search list bao cao theo tieu chi
    async search() {
        const requestReport = {
            loaiTimKiem: this.searchFilter.loaiTimKiem,
            maDnghi: this.searchFilter.maDeNghi,
            maDvi: this.searchFilter.maDviTao,
            ngayTaoDen: this.datePipe.transform(this.searchFilter.denNgay, Utils.FORMAT_DATE_STR),
            ngayTaoTu: this.datePipe.transform(this.searchFilter.tuNgay, Utils.FORMAT_DATE_STR),
            soQdChiTieu: this.searchFilter.qdChiTieu,
            loaiDnghi: this.searchFilter.loaiDn,
            paggingReq: {
                limit: this.pages.size,
                page: this.pages.page,
            },
            trangThai: this.searchFilter.trangThai,
        };
        this.spinner.show();
        await this.capVonNguonChiService.timKiemDeNghiThop(requestReport).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.dataTable = [];
                    data.data.content.forEach(item => {
                        this.dataTable.push({
                            ...item,
                            ngayTao: this.datePipe.transform(item.ngayTao, Utils.FORMAT_DATE_STR),
                            ngayTrinh: this.datePipe.transform(item.ngayTrinh, Utils.FORMAT_DATE_STR),
                            ngayPheDuyet: this.datePipe.transform(item.ngayPheDuyet, Utils.FORMAT_DATE_STR),
                            checked: false,
                            isEdit: this.checkEditStatus(item.trangThai, item.loaiDnghi),
                            isDelete: this.checkDeleteStatus(item.trangThai, item.loaiDnghi),
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

    clearFilter() {
        this.searchFilter.maDeNghi = null
        this.searchFilter.trangThai = null
        this.searchFilter.tuNgay = null
        this.searchFilter.denNgay = null
        this.searchFilter.qdChiTieu = null
        this.searchFilter.loaiDn = null
        this.search();
    }

    getStatusName(trangThai: string) {
        return this.trangThais.find(e => e.id == trangThai)?.tenDm;
    }

    //tao bao cao tong hop moi
    addNewReport() {
    }

    //xem chi tiet
    viewDetail(data: any) {
        const obj = {
            id: data.id,
            tabSelected: data.loaiDnghi == Utils.THOP_TAI_TC ? 'tc' : 'ckv',
        }
        this.dataChange.emit(obj);
    }

    updateAllChecked(): void {
        if (this.dataTable && this.dataTable.length > 0) {
            if (this.allChecked) {
                this.dataTable.forEach(item => {
                    if (item.isDelete) {
                        item.checked = true;
                    }
                })
            } else {
                this.dataTable.forEach(item => {
                    if (item.isDelete) {
                        item.checked = false;
                    }
                })
            }
        }
    }

    updateSingleChecked(): void {
        if (this.dataTable.every((item) => !item.checked && item.isDelete)) {
            this.allChecked = false;
        } else if (this.dataTable.every((item) => item.checked && item.isDelete)) {
            this.allChecked = true;
        }
    }

    //Xoa bao cao
    deleteReport(id: string) {
        this.modal.confirm({
            nzClosable: false,
            nzTitle: 'Xác nhận',
            nzContent: 'Bạn có chắc chắn muốn xóa?',
            nzOkText: 'Đồng ý',
            nzCancelText: 'Không',
            nzOkDanger: true,
            nzWidth: 310,
            nzOnOk: () => {
                this.spinner.show();
                let request = [];
                if (id) {
                    request = [id];
                } else {
                    if (this.dataTable && this.dataTable.length > 0) {
                        this.dataTable.forEach(item => {
                            if (item.checked) {
                                request.push(item.id);
                            }
                        })
                    }
                }
                this.capVonNguonChiService.xoaDeNghiThop(request).toPromise().then(
                    data => {
                        if (data.statusCode == 0) {
                            this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
                            this.search();
                        } else {
                            this.notification.error(MESSAGE.ERROR, data?.msg);
                        }
                    },
                    err => {
                        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                    }
                )
                this.spinner.hide();
            },
        });
    }

    checkEditStatus(trangThai: string, loaiDn: string) {
        return Utils.statusSave.includes(trangThai) &&
            (loaiDn == Utils.THOP_TU_CUC_KV ? this.userService.isAccessPermisson(CVNC.EDIT_SYNTHETIC_CKV) : this.userService.isAccessPermisson(CVNC.EDIT_SYNTHETIC_TC));
    }

    checkDeleteStatus(trangThai: string, loaiDn: string) {
        return Utils.statusDelete.includes(trangThai) &&
            (loaiDn == Utils.THOP_TU_CUC_KV ? this.userService.isAccessPermisson(CVNC.DELETE_SYNTHETIC_CKV) : this.userService.isAccessPermisson(CVNC.DELETE_SYNTHETIC_TC));
    }
}

