import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Roles, Status, Utils } from 'src/app/Utility/utils';
import { MESSAGE } from 'src/app/constants/message';
import { DieuChinhService } from 'src/app/services/quan-ly-von-phi/dieuChinhDuToan.service';
import { UserService } from 'src/app/services/user.service';
import { DialogTaoMoiComponent } from '../dialog-tao-moi/dialog-tao-moi.component';
import { Dcdt } from '../dieu-chinh-du-toan.constant';
@Component({
    selector: 'app-danh-sach-bao-cao-dieu-chinh',
    templateUrl: './danh-sach-bao-cao-dieu-chinh.component.html',
    styleUrls: ['./danh-sach-bao-cao-dieu-chinh.component.scss']
})
export class DanhSachBaoCaoDieuChinhComponent implements OnInit {
    @Output() dataChange = new EventEmitter();
    Utils = Utils;
    Status = Status;

    // statusNewReport = true;
    // statusDelete = true;
    // dviGuiKq: boolean;
    // allChecked = false;

    searchFilter = {
        dotBcao: null,
        nam: null,
        tuNgay: null,
        denNgay: null,
        maBcao: "",
        donViTao: "",
        trangThai: Status.TT_01,
    };

    pages = {
        size: 10,
        page: 1,
    }

    userInfo: any;
    // trangThais: any = Status.TRANG_THAI_FULL;
    dataTable: any[] = [];
    dataTableAll: any[] = [];
    totalElements = 0;
    totalPages = 0;
    statusNewReport = true;
    statusDelete = true;
    allChecked = false;
    constructor(
        private dieuChinhService: DieuChinhService,
        private notification: NzNotificationService,
        private datePipe: DatePipe,
        private spinner: NgxSpinnerService,
        private userService: UserService,
        private modal: NzModalService,
    ) {

    }

    ngOnInit() {
        this.userInfo = this.userService.getUserLogin();
        this.spinner.show();

        this.searchFilter.denNgay = new Date();
        const newDate = new Date();
        newDate.setMonth(newDate.getMonth() - 1);
        this.searchFilter.tuNgay = newDate;
        this.searchFilter.donViTao = this.userInfo?.MA_DVI;

        //check quyen va cac nut chuc nang
        this.statusNewReport = this.userService.isAccessPermisson(Roles.DCDT.ADD_REPORT);
        this.statusDelete = this.userService.isAccessPermisson(Roles.DCDT.DELETE_REPORT) || this.userService.isAccessPermisson(Roles.DCDT.DELETE_SYNTHETIC_REPORT);
        if (this.userService.isAccessPermisson(Roles.DCDT.DUYET_REPORT) || this.userService.isAccessPermisson(Roles.DCDT.DUYET_SYNTHETIC_REPORT)) {
            this.searchFilter.trangThai = Status.TT_02;
        } else {
            if (this.userService.isAccessPermisson(Roles.DCDT.APPROVE_REPORT) || this.userService.isAccessPermisson(Roles.DCDT.APPROVE_SYNTHETIC_REPORT)) {
                this.searchFilter.trangThai = Status.TT_04;
            }
        }
        this.search();
        this.spinner.hide();
    };

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
                this.dieuChinhService.xoaDuToanDieuChinh(request).toPromise().then(
                    data => {
                        if (data.statusCode == 0) {
                            this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
                            this.search();
                            this.allChecked = false;
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

    addNewReport() {
        const modalTuChoi = this.modal.create({
            nzTitle: 'Thông tin tạo mới báo cáo điều chỉnh dự toán chi ngân sách nhà nước',
            nzContent: DialogTaoMoiComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {
                tab: 'danhsach'
            },
        });
        modalTuChoi.afterClose.toPromise().then(async (res) => {
            if (res) {
                const obj = {
                    baoCao: res,
                    tabSelected: Dcdt.BAO_CAO_01,
                    isSynthetic: false,
                }
                this.dataChange.emit(obj);
            }
        });
    };

    clearFilter() {
        this.searchFilter.nam = null
        this.searchFilter.tuNgay = null
        this.searchFilter.denNgay = null
        this.searchFilter.maBcao = null
        this.searchFilter.trangThai = null
        this.search();
    };

    async search() {
        this.spinner.show();
        let trangThais = [];
        if (this.searchFilter.trangThai) {
            trangThais = [this.searchFilter.trangThai];
        }
        const requestReport = {
            loaiTimKiem: "0",
            maBcao: !this.searchFilter.maBcao ? null : this.searchFilter.maBcao,
            maDvi: this.searchFilter.donViTao,
            dotBcao: this.searchFilter.dotBcao,
            namBcao: this.searchFilter.nam,
            ngayTaoDen: Utils.fmtDate(this.searchFilter.denNgay),
            ngayTaoTu: Utils.fmtDate(this.searchFilter.tuNgay),
            paggingReq: {
                limit: this.pages.size,
                page: this.pages.page,
            },
            trangThais: trangThais,
        };
        this.spinner.show();
        //let latest_date =this.datepipe.transform(this.tuNgay, 'yyyy-MM-dd');
        await this.dieuChinhService.timKiemDieuChinh(requestReport).toPromise().then(

            (res) => {
                if (res.statusCode == 0) {
                    this.dataTable = [];
                    res.data.content.forEach(item => {
                        this.dataTable.push({
                            ...item,
                            isEdit: this.checkEditStatus(item),
                            isDelete: this.checkDeleteStatus(item),
                            checked: false,
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
    };

    updateSingleChecked(): void {
        if (this.dataTable.every((item) => !item.checked && item.isDelete)) {
            this.allChecked = false;
        } else if (this.dataTable.every((item) => item.checked && item.isDelete)) {
            this.allChecked = true;
        }
    };

    // getStatusName(trangThai: string) {
    //     return this.trangThais.find(e => e.id == trangThai)?.tenDm;
    // };

    //xem chi tiet bao cao
    viewDetail(data: any) {
        const obj = {
            id: data.id,
            tabSelected: Dcdt.BAO_CAO_01,
        }
        this.dataChange.emit(obj);
    }


    onPageIndexChange(page) {
        this.pages.page = page;
        this.search();
    };

    //doi so luong phan tu tren 1 trang
    onPageSizeChange(size) {
        this.pages.size = size;
        this.search();
    };


    checkEditStatus(item: any) {
        const isSynthetic = item.tongHopTu && item.tongHopTu != "[]";
        return Status.check('saveWHist', item.trangThai) &&
            (isSynthetic ? this.userService.isAccessPermisson(Roles.DCDT.EDIT_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(Roles.DCDT.EDIT_REPORT));
    }

    checkDeleteStatus(item: any) {
        const isSynthetic = item.tongHopTu && item.tongHopTu != "[]";
        return Status.check('saveWHist', item.trangThai) &&
            (isSynthetic ? this.userService.isAccessPermisson(Roles.DCDT.DELETE_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(Roles.DCDT.DELETE_REPORT));
    }
}
