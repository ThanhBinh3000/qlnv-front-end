
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { BCVP, LTD, TRANG_THAI_TIM_KIEM, Utils } from 'src/app/Utility/utils';
import { DialogThemMoiQdCvComponent } from '../dialog-them-moi-qd-cv/dialog-them-moi-qd-cv.component';

@Component({
    selector: 'app-danh-sach-phuong-an-giao-skt-tran-chi',
    templateUrl: './danh-sach-phuong-an-giao-skt-tran-chi.component.html',
})
export class DanhSachPhuongAnGiaoSktTranChiComponent implements OnInit {
    @Output() dataChange = new EventEmitter();

    searchFilter = {
        loaiTimKiem: "0",
        namPa: null,
        tuNgay: null,
        denNgay: null,
        maDvi: "",
        trangThai: "",
        maPa: "",
    };

    userInfo: any;
    dataTable: any[] = [];
    dataTableAll: any[] = [];
    trangThais: any[] = TRANG_THAI_TIM_KIEM;

    pages = {
        size: 10,
        page: 1,
    }
    totalElements = 0;
    totalPages = 0;

    statusNewReport = true;
    statusDelete = true;
    allChecked = false;

    filterTable: any = {
        soQd: '',
        ngayKy: '',
        namKeHoach: '',
        trichYeu: '',
        tenTrangThai: '',
    };
    constructor(
        private spinner: NgxSpinnerService,
        private lapThamDinhService: LapThamDinhService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        public userService: UserService,
        private datePipe: DatePipe,
        public globals: Globals,
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
        //check quyen va cac nut chuc nang
        this.statusNewReport = this.userService.isAccessPermisson(LTD.ADD_QDCV_GIAO_SKT);
        this.statusDelete = this.userService.isAccessPermisson(LTD.DELETE_PA_GIAO_SKT);
        this.search();
        this.spinner.hide();
    }

    async search() {
        this.spinner.show();
        let lstTrangThai = [];
        if (this.searchFilter.trangThai) {
            lstTrangThai = [this.searchFilter.trangThai];
        }
        const requestReport = {
            loaiTimKiem: this.searchFilter.loaiTimKiem,
            maDviTao: this.searchFilter.maDvi,
            maPa: this.searchFilter.maPa,
            namPa: this.searchFilter.namPa,
            ngayTaoDen: this.datePipe.transform(this.searchFilter.denNgay, Utils.FORMAT_DATE_STR),
            ngayTaoTu: this.datePipe.transform(this.searchFilter.tuNgay, Utils.FORMAT_DATE_STR),
            str: null,
            trangThais: lstTrangThai,
            paggingReq: {
                limit: this.pages.size,
                page: this.pages.page,
            }
        };
        await this.lapThamDinhService.timKiemPhuongAn(requestReport).toPromise().then(res => {
            if (res.statusCode == 0) {
                this.dataTable = [];
                res.data.content.forEach(item => {
                    this.dataTable.push({
                        ...item,
                        ngayTao: this.datePipe.transform(item.ngayTao, Utils.FORMAT_DATE_STR),
                        ngayTrinh: this.datePipe.transform(item.ngayTrinh, Utils.FORMAT_DATE_STR),
                        ngayDuyet: this.datePipe.transform(item.ngayDuyet, Utils.FORMAT_DATE_STR),
                        ngayPheDuyet: this.datePipe.transform(item.ngayPheDuyet, Utils.FORMAT_DATE_STR),
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
        }, err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
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
        this.searchFilter.namPa = null
        this.searchFilter.tuNgay = null
        this.searchFilter.denNgay = null
        this.searchFilter.trangThai = null
        this.searchFilter.maPa = null
        this.search();
    }

    getStatusName(trangThai: string) {
        if (trangThai == Utils.TT_BC_6) {
            return "Phê duyệt";
        }
        return this.trangThais.find(e => e.id == trangThai)?.tenDm;
    }

    checkEditStatus(item: any) {
        return Utils.statusSave.includes(item.trangThai) &&
            this.userService.isAccessPermisson(LTD.EDIT_PA_GIAO_SKT);
    }

    checkDeleteStatus(item: any) {
        return Utils.statusDelete.includes(item.trangThai) &&
            this.userService.isAccessPermisson(LTD.DELETE_PA_GIAO_SKT);
    }

    //them moi bao cao
    addNewReport() {
        const modalTuChoi = this.modal.create({
            nzTitle: 'NHẬP QĐ/CV GIAO SỐ KIỂM TRA CHI NSNN',
            nzContent: DialogThemMoiQdCvComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '60%',
            nzFooter: null,
            nzComponentParams: {
            },
        });
        modalTuChoi.afterClose.toPromise().then(async (res) => {
            if (res) {
                const obj = {
                    id: res,
                    tabSelected: 'pa',
                }
                this.dataChange.emit(obj);
            }
        });
    }

    //xem chi tiet bao cao
    viewDetail(data: any) {
        const obj = {
            id: data.id,
            tabSelected: 'pa',
        }
        this.dataChange.emit(obj);
    }


    updateAllChecked(): void {
        if (this.dataTable && this.dataTable.length > 0) {
            this.dataTable.forEach(item => {
                if (item.isDelete) {
                    item.checked = this.allChecked;
                }
            })
        }
    }

    updateSingleChecked(): void {
        if (this.dataTable.every((item) => item.checked || !item.isDelete)) {
            this.allChecked = true;
        } else {
            this.allChecked = false;
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
                this.lapThamDinhService.xoaPhuongAn(request).toPromise().then(
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
