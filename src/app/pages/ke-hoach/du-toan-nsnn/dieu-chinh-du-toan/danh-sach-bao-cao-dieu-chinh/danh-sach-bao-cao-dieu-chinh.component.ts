import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DieuChinhService } from 'src/app/services/quan-ly-von-phi/dieuChinhDuToan.service';
import { UserService } from 'src/app/services/user.service';
import { DCDT, Utils } from 'src/app/Utility/utils';
import { DialogTaoMoiComponent } from '../dialog-tao-moi/dialog-tao-moi.component';
@Component({
    selector: 'app-danh-sach-bao-cao-dieu-chinh',
    templateUrl: './danh-sach-bao-cao-dieu-chinh.component.html',
    styleUrls: ['./danh-sach-bao-cao-dieu-chinh.component.scss']
})
export class DanhSachBaoCaoDieuChinhComponent implements OnInit {
    @Output() dataChange = new EventEmitter();

    statusNewReport = true;
    statusDelete = true;
    dviGuiKq: boolean;
    allChecked = false;
    totalElements = 0;

    dataTable: any[] = [];
    dataTableAll: any[] = [];
    searchFilter = {
        dotBcao: null,
        nam: null,
        tuNgay: null,
        denNgay: null,
        maBcao: "",
        donViTao: "",
        trangThai: Utils.TT_BC_1,
    };

    filterTable: any = {
        maBcao: '',
        ngayTao: '',
        namHienHanh: '',
        dotBcao: '',
        ngayTrinh: '',
        ngayDuyet: '',
        ngayPheDuyet: '',
        ngayTraKq: ''
    };

    pages = {
        size: 10,
        page: 1,
    }

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
            tenDm: "Trưởng BP từ chối",
        },
        {
            id: Utils.TT_BC_4,
            tenDm: "Trưởng BP duyệt",
        },
        {
            id: Utils.TT_BC_5,
            tenDm: "Lãnh đạo từ chối",
        },
        {
            id: Utils.TT_BC_7,
            tenDm: "Lãnh đạo phê duyệt",
        },
        {
            id: Utils.TT_BC_8,
            tenDm: "Đơn vị cấp trên từ chối",
        },
        {
            id: Utils.TT_BC_9,
            tenDm: "Đơn vị cấp trên tiếp nhận",
        },
    ];

    statusBtnValidateDot = true;
    statusBtnValidateNam = true;
    statusTaoMoi = true;
    listIdDelete: string[] = [];
    totalPages = 0;
    userInfo: any;

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
        this.searchFilter.denNgay = new Date();
        const newDate = new Date();
        newDate.setMonth(newDate.getMonth() - 1);
        this.searchFilter.tuNgay = newDate;
        this.userInfo = this.userService.getUserLogin();
        this.search();
        if (this.userInfo.CAP_DVI == '1') {
            return this.dviGuiKq = true;
        }
        this.searchFilter.donViTao = this.userInfo?.MA_DVI;
    };

    deleteReport(id: string) {
        let request = [];
        if (!id) {
            request = this.listIdDelete;
        } else {
            request = [id];
        }
        this.spinner.show();
        this.dieuChinhService.xoaDuToanDieuChinh(request).toPromise().then(
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
            nzTitle: 'Thông tin tạo mới báo cáo điều chỉnh dự toán chi ngân sách nhà nước',
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
                // const request = {
                //   maPhanBcao: res.maPhanBcao,
                //   namQtoan: res.namQtoan
                // }
                const obj = {
                    ...res,
                    id: null,
                    tabSelected: 'addbaocao',
                    isSynthetic: false,
                }
                this.dataChange.emit(obj);
            }
        });
    };

    clearFilter() {
        this.searchFilter.nam = null;
        this.searchFilter.tuNgay = null;
        this.searchFilter.denNgay = null;
        this.searchFilter.maBcao = null;
        this.searchFilter.trangThai = null;
        this.searchFilter.donViTao = null;
        this.search();
    };

    async search() {

        if (this.searchFilter.nam || this.searchFilter.nam === 0) {
            if (this.searchFilter.nam >= 3000 || this.searchFilter.nam < 1000) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
                return;
            }
        }
        let trangThais = ['1', '2', '3', '4', '5', '7', '8', '9'];
        if (this.searchFilter.trangThai) {
            trangThais = [this.searchFilter.trangThai];
        }
        const requestReport = {
            loaiTimKiem: "0",
            maBcao: this.searchFilter.maBcao,
            maDvi: this.searchFilter.donViTao,
            dotBcao: this.searchFilter.dotBcao,
            namBcao: this.searchFilter.nam,
            ngayTaoDen: this.datePipe.transform(this.searchFilter.denNgay, Utils.FORMAT_DATE_STR),
            ngayTaoTu: this.datePipe.transform(this.searchFilter.tuNgay, Utils.FORMAT_DATE_STR),
            paggingReq: {
                limit: this.pages.size,
                page: this.pages.page,
            },
            trangThais: trangThais,
        };
        this.spinner.show();
        //let latest_date =this.datepipe.transform(this.tuNgay, 'yyyy-MM-dd');
        await this.dieuChinhService.timKiemDieuChinh(requestReport).toPromise().then(
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

    getStatusName(trangThai: string) {
        return this.trangThais.find(e => e.id == trangThai)?.tenDm;
    };

    //xem chi tiet bao cao
    viewDetail(data: any) {
        const obj = {
            id: data.id,
            tabSelected: 'addbaocao',
        }
        this.dataChange.emit(obj);
    };


    onPageIndexChange(page) {
        this.pages.page = page;
        this.search();
    };

    //doi so luong phan tu tren 1 trang
    onPageSizeChange(size) {
        this.pages.size = size;
        this.search();
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

    checkEditStatus(trangThai: string) {
        return Utils.statusSave.includes(trangThai) &&
            (this.userService.isAccessPermisson(DCDT.EDIT_REPORT));
    };

    checkDeleteStatus(trangThai: string) {
        return Utils.statusDelete.includes(trangThai) &&
            (this.userService.isAccessPermisson(DCDT.DELETE_REPORT));
    };
}
