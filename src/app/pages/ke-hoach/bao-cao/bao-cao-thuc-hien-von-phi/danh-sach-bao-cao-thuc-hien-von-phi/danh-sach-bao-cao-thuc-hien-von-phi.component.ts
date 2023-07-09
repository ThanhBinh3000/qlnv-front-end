
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Roles, Status, Utils } from 'src/app/Utility/utils';
import { MESSAGE } from 'src/app/constants/message';
import { BaoCaoThucHienVonPhiService } from 'src/app/services/quan-ly-von-phi/baoCaoThucHienVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { Search, Vp } from '../bao-cao-thuc-hien-von-phi.constant';
import { DialogTaoMoiComponent } from '../dialog-tao-moi/dialog-tao-moi.component';

@Component({
    selector: 'app-danh-sach-bao-cao-thuc-hien-von-phi',
    templateUrl: './danh-sach-bao-cao-thuc-hien-von-phi.component.html',
    styleUrls: ['./danh-sach-bao-cao-thuc-hien-von-phi.component.scss'],
})
export class DanhSachBaoCaoThucHienVonPhiComponent implements OnInit {
    @Input() data;
    @Output() dataChange = new EventEmitter();
    Status = Status;
    Vp = Vp;
    Utils = Utils;
    searchFilter: Search = new Search();
    userInfo: any;
    trangThai!: string;
    totalElements = 0;
    totalPages = 0;
    statusNewReport = true;
    statusDelete = true;
    allChecked = false;
    dataTable: any[] = [];
    dataTableAll: any[] = [];

    constructor(
        private spinner: NgxSpinnerService,
        private baoCaoThucHienVonPhiService: BaoCaoThucHienVonPhiService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        public userService: UserService,
        public globals: Globals,
    ) { }

    async ngOnInit() {
        this.userInfo = this.userService.getUserLogin();
        this.spinner.show();
        //khoi tao gia tri mac dinh
        const date = new Date();
        this.searchFilter.ngayTaoDen = date.toDateString();
        this.searchFilter.namBcao = date.getFullYear();
        date.setMonth(date.getMonth() - 1);
        this.searchFilter.ngayTaoTu = date.toDateString();
        //check quyen va cac nut chuc nang
        this.statusNewReport = this.userService.isAccessPermisson(Roles.VP.ADD_REPORT);
        this.statusDelete = this.userService.isAccessPermisson(Roles.VP.DEL_REPORT) || this.userService.isAccessPermisson(Roles.VP.DEL_SYNTH_REPORT);
        if (this.userService.isAccessPermisson(Roles.VP.ADD_REPORT)) {
            this.trangThai = Status.TT_01;
        } else if (this.userService.isAccessPermisson(Roles.VP.PASS_REPORT) || this.userService.isAccessPermisson(Roles.VP.PASS_SYNTH_REPORT)) {
            this.trangThai = Status.TT_02;
        } else if (this.userService.isAccessPermisson(Roles.VP.APPROVE_REPORT) || this.userService.isAccessPermisson(Roles.VP.APPROVE_SYNTH_REPORT)) {
            this.trangThai = Status.TT_04;
        }
        this.search();
        this.spinner.hide();
    }

    async search() {
        this.spinner.show();
        this.searchFilter.trangThais = this.trangThai ? [this.trangThai] : [Status.TT_01, Status.TT_02, Status.TT_03, Status.TT_04, Status.TT_05, Status.TT_07, Status.TT_08, Status.TT_09];
        await this.baoCaoThucHienVonPhiService.timBaoCao(this.searchFilter.request()).toPromise().then(res => {
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
        this.trangThai = null
        this.search();
    }

    checkEditStatus(item: any) {
        const isSynthetic = item.tongHopTu != "[]";
        return Status.check('saveWOHist', item.trangThai) &&
            (isSynthetic ? this.userService.isAccessPermisson(Roles.VP.EDIT_SYNTH_REPORT) : this.userService.isAccessPermisson(Roles.VP.EDIT_REPORT));
    }

    checkDeleteStatus(item: any) {
        const isSynthetic = item.tongHopTu != "[]";
        return Status.check('saveWOHist', item.trangThai) &&
            (isSynthetic ? this.userService.isAccessPermisson(Roles.VP.DEL_SYNTH_REPORT) : this.userService.isAccessPermisson(Roles.VP.DEL_REPORT));
    }

    //them moi bao cao
    addNewReport() {
        const modalTuChoi = this.modal.create({
            nzTitle: 'Thông tin tạo mới báo cáo kết quả thực hiện vốn phí hàng DTQG',
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
                    tabSelected: Vp.BAO_CAO_01,
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
            tabSelected: Vp.BAO_CAO_01,
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
                this.baoCaoThucHienVonPhiService.xoaBaoCao(request).toPromise().then(
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
}
