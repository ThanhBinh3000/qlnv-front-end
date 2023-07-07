
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Roles, Status, Utils } from 'src/app/Utility/utils';
import { MESSAGE } from 'src/app/constants/message';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { DialogTaoMoiComponent } from '../dialog-tao-moi/dialog-tao-moi.component';
import { Ltd } from '../lap-ke-hoach-va-tham-dinh-du-toan.constant';

@Component({
    selector: 'app-danh-sach-bao-cao',
    templateUrl: './danh-sach-bao-cao.component.html',
})
export class DanhSachBaoCaoComponent implements OnInit {
    @Output() dataChange = new EventEmitter();
    Utils = Utils;
    Status = Status;

    searchFilter = {
        nam: null,
        lan: null,
        tuNgay: null,
        denNgay: null,
        maBaoCao: "",
        donViTao: "",
        trangThai: Status.TT_01,
    };

    userInfo: any;
    // trangThais: any = Status.TRANG_THAI_FULL;
    dataTable: any[] = [];
    dataTableAll: any[] = [];

    pages = {
        size: 10,
        page: 1,
    }
    totalElements = 0;
    totalPages = 0;

    statusNewReport = true;
    statusDelete = true;
    allChecked = false;

    constructor(
        private spinner: NgxSpinnerService,
        private lapThamDinhService: LapThamDinhService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        public userService: UserService,
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
        this.searchFilter.donViTao = this.userInfo?.MA_DVI;
        //check quyen va cac nut chuc nang
        this.statusNewReport = this.userService.isAccessPermisson(Roles.LTD.ADD_REPORT);
        this.statusDelete = this.userService.isAccessPermisson(Roles.LTD.DEL_REPORT) || this.userService.isAccessPermisson(Roles.LTD.DEL_SYNTH_REPORT);
        if (this.userService.isAccessPermisson(Roles.LTD.PASS_REPORT) || this.userService.isAccessPermisson(Roles.LTD.PASS_SYNTH_REPORT)) {
            this.searchFilter.trangThai = Status.TT_02;
        } else {
            if (this.userService.isAccessPermisson(Roles.LTD.APPROVE_REPORT) || this.userService.isAccessPermisson(Roles.LTD.APPROVE_SYNTH_REPORT)) {
                this.searchFilter.trangThai = Status.TT_04;
            }
        }
        this.search();
        this.spinner.hide();
    }

    async search() {
        this.spinner.show();
        let trangThais = [];
        if (this.searchFilter.trangThai) {
            trangThais = [this.searchFilter.trangThai];
        }
        const requestReport = {
            loaiTimKiem: "0",
            maBcaos: !this.searchFilter.maBaoCao ? [] : [this.searchFilter.maBaoCao],
            maDvi: this.searchFilter.donViTao,
            namBcao: this.searchFilter.nam,
            ngayTaoDen: Utils.fmtDate(this.searchFilter.denNgay),
            ngayTaoTu: Utils.fmtDate(this.searchFilter.tuNgay),
            paggingReq: {
                limit: this.pages.size,
                page: this.pages.page,
            },
            trangThais: trangThais,
        };
        await this.lapThamDinhService.timBaoCaoLapThamDinh(requestReport).toPromise().then(res => {
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
        this.searchFilter.nam = null
        this.searchFilter.tuNgay = null
        this.searchFilter.denNgay = null
        this.searchFilter.maBaoCao = null
        this.searchFilter.trangThai = null
        this.search();
    }

    checkEditStatus(item: any) {
        const isSynthetic = item.tongHopTu != "[]";
        return Status.check('saveWHist', item.trangThai) &&
            (isSynthetic ? this.userService.isAccessPermisson(Roles.LTD.EDIT_SYNTH_REPORT) : this.userService.isAccessPermisson(Roles.LTD.EDIT_REPORT));
    }

    checkDeleteStatus(item: any) {
        const isSynthetic = item.tongHopTu != "[]";
        return Status.check('saveWHist', item.trangThai) &&
            (isSynthetic ? this.userService.isAccessPermisson(Roles.LTD.DEL_SYNTH_REPORT) : this.userService.isAccessPermisson(Roles.LTD.DEL_REPORT));
    }

    // getStatusName(trangThai: string) {
    //     return this.trangThais.find(e => e.id == trangThai)?.tenDm;
    // }

    //them moi bao cao
    addNewReport() {
        const modalTuChoi = this.modal.create({
            nzTitle: 'Thông tin tạo mới báo cáo',
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
                    tabSelected: Ltd.BAO_CAO_01,
                    isSynthetic: false,
                }
                this.dataChange.emit(obj);
            }
        });
    }

    //xem chi tiet bao cao
    viewDetail(data: any) {
        const obj = {
            id: data.id,
            tabSelected: Ltd.BAO_CAO_01,
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
                this.lapThamDinhService.xoaBaoCaoLapThamDinh(request).toPromise().then(
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

}
