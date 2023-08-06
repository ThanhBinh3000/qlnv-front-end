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

    // async getChildUnit() {
    //     this.spinner.show();
    //     const request = {
    //         maDviCha: this.searchFilter.maDvi,
    //         trangThai: '01',
    //     }
    //     await this.quanLyVonPhiService.dmDviCon(request).toPromise().then(
    //         data => {
    //             if (data.statusCode == 0) {
    //                 if (this.userService.isTongCuc()) {
    //                     this.donVis = data.data.filter(e => e.tenVietTat && (e.tenVietTat.startsWith('CDT') || e.tenVietTat.startsWith('VP')));
    //                 } else {
    //                     this.donVis = data.data.filter(e => e.tenVietTat && (e.tenVietTat.startsWith('CCDT') || e.tenVietTat.startsWith('VP')))
    //                 }
    //             } else {
    //                 this.notification.error(MESSAGE.ERROR, data?.msg);
    //             }
    //         },
    //         (err) => {
    //             this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
    //         }
    //     )
    //     this.spinner.hide();
    // }

    // async checkExistTienThua(nam: number) {
    //     this.isExistTienThua = false;
    //     const request = {
    //         loaiTimKiem: '0',
    //         maLoai: 6,
    //         maDvi: this.userInfo?.MA_DVI,
    //         namDnghi: nam,
    //         paggingReq: {
    //             limit: 10,
    //             page: 1,
    //         },
    //     }
    //     await this.capVonMuaBanTtthService.timKiemVonMuaBan(request).toPromise().then(
    //         (data) => {
    //             if (data.statusCode == 0) {
    //                 if (data.data.content?.length > 0) {
    //                     this.isExistTienThua = true;
    //                 }
    //             } else {
    //                 this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
    //             }
    //         },
    //         (err) => {
    //             this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    //         }
    //     );
    // }

    // //kiem tra ban ghi nop tien von ban hang len don vi cap tren da ton tai chua, neu chua thi thuc hien them moi
    // async addVonBanGuiDvct(nam: number) {
    //     const response: Report = new Report();
    //     response.namDnghi = nam;
    //     response.ttGui = new sendInfo();
    //     response.ttGui.lstCtietBcaos = [];
    //     response.ttNhan = new receivedInfo();
    //     response.ttNhan.lstCtietBcaos = [];
    //     response.maDvi = this.userInfo?.MA_DVI;
    //     response.ngayTao = new Date();
    //     response.dot = 1;
    //     response.maLoai = 6;
    //     response.ttGui.trangThai = Utils.TT_BC_1;
    //     response.ttNhan.trangThai = Utils.TT_BC_1;
    //     response.ttGui.lstFiles = [];
    //     response.ttNhan.lstFiles = [];
    //     response.ttGui.lstCtietBcaos.push({
    //         ...new TienThua(),
    //         id: null,
    //         maHang: Utils.MUA_THOC,
    //         hangDtqg: 'Thóc',
    //     })
    //     if (!this.userService.isChiCuc()) {
    //         response.ttGui.lstCtietBcaos.push({
    //             ...new TienThua(),
    //             id: null,
    //             maHang: Utils.MUA_GAO,
    //             hangDtqg: 'Gạo',
    //         })
    //         response.ttGui.lstCtietBcaos.push({
    //             ...new TienThua(),
    //             id: null,
    //             maHang: Utils.MUA_MUOI,
    //             hangDtqg: 'Muối',
    //         })
    //     }
    //     if (this.userService.isTongCuc()) {
    //         response.ttGui.lstCtietBcaos.push({
    //             ...new TienThua(),
    //             id: null,
    //             maHang: Utils.MUA_VTU,
    //             hangDtqg: 'Vật tư',
    //         })
    //     }
    //     await this.capVonMuaBanTtthService.maCapVonUng().toPromise().then(
    //         (res) => {
    //             if (res.statusCode == 0) {
    //                 response.maCapUng = res.data;
    //             } else {
    //                 this.notification.error(MESSAGE.ERROR, res?.msg);
    //             }
    //         },
    //         (err) => {
    //             this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    //         },
    //     );
    //     this.capVonMuaBanTtthService.themMoiVonMuaBan(response).toPromise().then(
    //         async (data) => {
    //             if (data.statusCode == 0) {
    //             } else {
    //                 this.notification.error(MESSAGE.ERROR, data?.msg);
    //             }
    //         },
    //         (err) => {
    //             this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    //         },
    //     );
    // }

}
