import { ComponentType } from '@angular/cdk/portal';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Roles, Status, Utils } from 'src/app/Utility/utils';
import { MESSAGE } from 'src/app/constants/message';
import { CapVonMuaBanTtthService } from 'src/app/services/quan-ly-von-phi/capVonMuaBanTtth.service';
import { UserService } from 'src/app/services/user.service';
import { Cvmb, Perm, Search } from '../../cap-von-mua-ban-va-thanh-toan-tien-hang.constant';
import { Tab } from '../von-ban.constant';
import { DialogTaoMoiComponent } from '../dialog-tao-moi/dialog-tao-moi.component';
// import { DialogTaoMoiCapVonComponent } from '../dialog-tao-moi-cap-von/dialog-tao-moi-cap-von.component';

@Component({
    selector: 'app-danh-sach-von-ban-nop-dvct',
    templateUrl: './danh-sach-von-ban-nop-dvct.component.html',
    styleUrls: ['../von-ban.component.scss']
})
export class DanhSachVonBanNopDvctComponent implements OnInit {
    @Input() dataInfo: any;
    @Output() dataChange = new EventEmitter();
    Utils = Utils;
    Status = Status;
    Cvmb = Cvmb;
    //thong tin user
    userInfo: any;
    //thong tin tim kiem
    searchFilter: Search = new Search();
    // danh sach
    dataTable: any[] = [];
    dataTableAll: any[] = [];
    donVis: any[] = [];
    //cac quyn cua nguoi thao tac
    allChecked = false;
    statusNewReport = false;
    statusDelete = false;
    //phan trang
    totalElements = 0;
    totalPages = 0;

    constructor(
        private spinner: NgxSpinnerService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        public userService: UserService,
        private capVonMuaBanTtthService: CapVonMuaBanTtthService,
    ) { }

    async ngOnInit() {
        this.userInfo = this.userService.getUserLogin();
        this.spinner.show();
        //khoi tao gia tri mac dinh
        this.searchFilter.ngayTaoDen = new Date();
        const newDate = new Date();
        newDate.setMonth(newDate.getMonth() - 1);
        this.searchFilter.ngayTaoTu = newDate;
        this.searchFilter.maDvi = this.userInfo?.MA_DVI;
        this.searchFilter.maLoai = Cvmb.VON_BAN;
        this.statusNewReport = this.userService.isTongCuc() ? false : this.userService.isAccessPermisson(Roles.CVMB.ADD_VB);
        this.statusDelete = this.userService.isAccessPermisson(Roles.CVMB.DEL_VB);
        //neu co quyen phe duyet thi trang thai mac dinh la trinh duyet
        if (this.userService.isAccessPermisson(Roles.CVMB.PASS_VB)) {
            this.searchFilter.trangThai = Status.TT_02;
        } else if (this.userService.isAccessPermisson(Roles.CVMB.APPROVE_VB)) {
            this.searchFilter.trangThai = Status.TT_04;
        } else if (this.userService.isAccessPermisson(Roles.CVMB.ACCEPT_VB)) {
            this.searchFilter.trangThai = Status.TT_07;
        }
        this.search();
        this.spinner.hide();
    }

    async search() {
        this.spinner.show();
        await this.capVonMuaBanTtthService.timKiemVonMuaBan(this.searchFilter.request()).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.dataTable = [];
                    data.data.content.forEach(item => {
                        this.dataTable.push({
                            ...item,
                            checked: false,
                            isEdit: this.checkEditStatus(item.trangThai),
                            isDelete: this.checkDeleteStatus(item.trangThai),
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

    checkEditStatus(trangThai: string) {
        return Status.check('saveWHist', trangThai) && this.userService.isAccessPermisson(Roles.CVMB.EDIT_VB);
    }

    checkDeleteStatus(trangThai: string) {
        return Status.check('saveWHist', trangThai) && this.userService.isAccessPermisson(Roles.CVMB.DEL_VB);
    }

    addNewReport() {
        const modalTuChoi = this.modal.create({
            nzTitle: 'Thông tin tạo mới',
            nzContent: DialogTaoMoiComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {
                request: this.searchFilter
            },
        });
        modalTuChoi.afterClose.toPromise().then(async (res) => {
            if (res) {
                this.dataChange.emit(res);
            }
        });
    }

    //xem chi tiet bao cao
    async viewDetail(data: any) {
        const obj = {
            id: data.id,
            tabSelected: data.canCuVeGia == Cvmb.DON_GIA ? Tab.VB_DON_GIA : Tab.VB_HOP_DONG,
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
                this.capVonMuaBanTtthService.xoaVonMuaBan(request).toPromise().then(
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
