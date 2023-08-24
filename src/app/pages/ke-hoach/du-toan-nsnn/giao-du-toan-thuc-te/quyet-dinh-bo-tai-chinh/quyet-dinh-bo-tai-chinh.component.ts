import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Roles, Status, Utils } from 'src/app/Utility/utils';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { GiaoDuToanChiService } from 'src/app/services/quan-ly-von-phi/giaoDuToanChi.service';
import { UserService } from 'src/app/services/user.service';
import { DialogTaoMoiComponent } from '../dialog-tao-moi/dialog-tao-moi.component';


@Component({
    selector: 'app-quyet-dinh-bo-tai-chinh',
    templateUrl: './quyet-dinh-bo-tai-chinh.component.html',
})
export class QuyetDinhBoTaiChinhComponent implements OnInit {
    @Output() dataChange = new EventEmitter();

    searchFilter = {
        dotBcao: null,
        namPa: null,
        ngayTaoTu: null,
        ngayTaoDen: null,
        maPa: "",
        trangThai: Status.TT_01,
    };

    filterTable: any = {
        maPa: '',
        ngayTaoTu: '',
        namPa: '',
    };

    pages = {
        size: 10,
        page: 1,
    };


    statusBtnValidateNam = true;
    statusDelete = true;
    statusNewReport = true;
    allChecked = false;

    userInfo: any;
    totalPages = 0;
    totalElements = 0;
    dataTable: any[] = [];
    dataTableAll: any[] = [];
    listIdDelete: string[] = [];



    constructor(
        private datePipe: DatePipe,
        private userService: UserService,
        private giaoDuToanChiService: GiaoDuToanChiService,
        private spinner: NgxSpinnerService,
        private notification: NzNotificationService,
        private modal: NzModalService,
    ) { }

    ngOnInit() {
        this.userInfo = this.userService.getUserLogin();
        this.search();
    };

    clearFilter() {
        this.searchFilter.namPa = null;
        this.searchFilter.ngayTaoTu = null;
        this.searchFilter.ngayTaoDen = null;
        this.searchFilter.maPa = null;
        this.search();
    };

    async search() {

        if (this.searchFilter.namPa || this.searchFilter.namPa === 0) {
            if (this.searchFilter.namPa >= 3000 || this.searchFilter.namPa < 1000) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
                return;
            }
        }
        let trangThais = ['1', '2', '3', '4', '5', '7', '8', '9'];
        if (this.searchFilter.trangThai) {
            trangThais = [this.searchFilter.trangThai];
        }
        const requestReport = {
            maPhanGiao: '1',
            maLoai: '2',
            maLoaiDan: [1, 2],
            maPa: this.searchFilter.maPa,
            namPa: this.searchFilter.namPa,
            ngayTaoDen: this.datePipe.transform(this.searchFilter.ngayTaoDen, Utils.FORMAT_DATE_STR),
            ngayTaoTu: this.datePipe.transform(this.searchFilter.ngayTaoTu, Utils.FORMAT_DATE_STR),
            paggingReq: {
                limit: this.pages.size,
                page: this.pages.page,
            },
            trangThais: trangThais,
            trangThaiGiaos: ["0", "1", "2"],
        };
        this.spinner.show();
        await this.giaoDuToanChiService.timPhuongAnGiao(requestReport).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.dataTable = [];
                    data.data.content.forEach(item => {
                        if (this.listIdDelete.findIndex(e => e == item.id) == -1) {
                            this.dataTable.push({
                                ...item,
                                checked: false,
                                isEdit: this.checkEditStatus(item.trangThai),
                                isDelete: this.checkDeleteStatus(item.trangThai),
                            })
                        } else {
                            this.dataTable.push({
                                ...item,
                                checked: true,
                            })
                        }
                    })
                    this.dataTable.forEach(e => {
                        e.ngayTao = this.datePipe.transform(e.ngayTao, Utils.FORMAT_DATE_STR);
                        e.ngayTrinh = this.datePipe.transform(e.ngayTrinh, Utils.FORMAT_DATE_STR);
                        e.ngayDuyet = this.datePipe.transform(e.ngayDuyet, Utils.FORMAT_DATE_STR);
                        e.ngayPheDuyet = this.datePipe.transform(e.ngayPheDuyet, Utils.FORMAT_DATE_STR);
                        e.ngayTraKq = this.datePipe.transform(e.ngayTraKq, Utils.FORMAT_DATE_STR);
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
    };

    deleteReport(id: string) {
        let request = [];
        if (!id) {
            request = this.listIdDelete;
        } else {
            request = [id];
        }
        this.spinner.show();
        this.giaoDuToanChiService.xoaBanGhiGiaoBTC2(request).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.listIdDelete = [];
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
    };

    addNewReport() {
        const modalTuChoi = this.modal.create({
            nzTitle: 'Tạo mới quyết định Bộ Tài Chính',
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
                    tabSelected: 'quyetDinhBTC',
                    isSynthetic: false,
                }
                this.dataChange.emit(obj);
            }
        });
    };

    //xem chi tiet bao cao
    viewDetail(data: any) {
        const obj = {
            id: data.id,
            tabSelected: 'quyetDinhBTC',
        }
        this.dataChange.emit(obj);
    };

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
    };


    updateSingleChecked(): void {
        if (this.dataTable.every((item) => !item.checked && item.isDelete)) {
            this.allChecked = false;
        } else if (this.dataTable.every((item) => item.checked && item.isDelete)) {
            this.allChecked = true;
        }
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

    changeListIdDelete(id: any) {
        if (this.listIdDelete.findIndex(e => e == id) == -1) {
            this.listIdDelete.push(id);
        } else {
            this.listIdDelete = this.listIdDelete.filter(e => e != id);
        }
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

    checkEditStatus(trangThai: string) {
        return [Status.TT_01].includes(trangThai) &&
            (this.userInfo.CAP_DVI == '1' && this.userService.isAccessPermisson(Roles.GDT.EDIT_REPORT_BTC));
    };

    checkDeleteStatus(trangThai: string) {
        return [Status.TT_01].includes(trangThai) &&
            (this.userInfo.CAP_DVI == '1' && this.userService.isAccessPermisson(Roles.GDT.DELETE_REPORT_BTC));
    };
}
