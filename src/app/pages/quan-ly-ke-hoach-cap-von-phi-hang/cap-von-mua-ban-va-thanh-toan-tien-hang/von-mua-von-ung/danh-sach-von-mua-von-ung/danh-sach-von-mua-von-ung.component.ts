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
import { Tab } from '../von-mua-von-ung.constant';
import { DialogTaoMoiCapUngVonComponent } from '../cap-ung-von/dialog-tao-moi-cap-ung-von/dialog-tao-moi-cap-ung-von.component';
import { DialogTaoMoiTienThuaComponent } from '../nop-tien-thua/dialog-tao-moi-tien-thua/dialog-tao-moi-tien-thua.component';
import { DialogTaoMoiThanhToanComponent } from '../thanh-toan-cho-khach-hang/dialog-tao-moi-thanh-toan/dialog-tao-moi-thanh-toan.component';

@Component({
    selector: 'app-danh-sach-von-mua-von-ung',
    templateUrl: './danh-sach-von-mua-von-ung.component.html',
    styleUrls: ['../von-mua-von-ung.component.scss']
})

export class DanhSachVonMuaVonUngComponent implements OnInit {
    @Input() dataInfo: any;
    @Output() dataChange = new EventEmitter();
    Utils = Utils;
    Status = Status;
    Cvmb = Cvmb;
    //thong tin user
    userInfo: any;
    //thong tin tim kiem
    searchFilter: Search = new Search();
    title: string;
    // danh sach
    dataTable: any[] = [];
    dataTableAll: any[] = [];
    trangThais: any[] = Status.TRANG_THAI_DVCD;
    donVis: any[] = [];
    //cac quyn cua nguoi thao tac
    perm: Perm = new Perm();
    isParent = false;
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
        this.searchFilter.maDvi = this.userInfo.MA_DVI;
        this.spinner.show();
        //khoi tao gia tri mac dinh
        this.searchFilter.ngayTaoDen = new Date();
        const newDate = new Date();
        newDate.setMonth(newDate.getMonth() - 1);
        this.searchFilter.ngayTaoTu = newDate;
        this.searchFilter.maDvi = this.userInfo?.MA_DVI;
        switch (this.dataInfo?.tabSelected) {
            case Tab.DS_GNV:
                this.title = 'DANH SÁCH GHI NHẬN CẤP ỨNG VỐN TỪ ĐƠN VỊ CẤP TRÊN';
                this.searchFilter.loaiTimKiem = '0';
                this.searchFilter.maLoai = Cvmb.GHI_NHAN_CU_VON;
                this.perm.create = this.userService.isTongCuc() ? Roles.CVMB.ADD_GNV_TC : 'NO';
                this.perm.delete = this.userService.isTongCuc() ? Roles.CVMB.DEL_GNV : 'NO';
                this.perm.edit = Roles.CVMB.EDIT_GNV;
                this.perm.pass = Roles.CVMB.PASS_GNV;
                this.perm.accept = Roles.CVMB.APPROVE_GNV;
                break;
            case Tab.DS_CV:
                this.title = 'DANH SÁCH CẤP ỨNG VỐN CHO ĐƠN VỊ CẤP DƯỚI';
                this.searchFilter.loaiTimKiem = '0';
                this.searchFilter.maLoai = Cvmb.CU_VON_DVCD;
                this.perm.create = Roles.CVMB.ADD_CV;
                this.perm.edit = Roles.CVMB.EDIT_CV;
                this.perm.delete = Roles.CVMB.DEL_CV;
                this.perm.pass = Roles.CVMB.PASS_CV;
                this.perm.approve = Roles.CVMB.APPROVE_CV;
                break;
            case Tab.DS_TT:
                this.title = 'DANH SÁCH TIỀN THỪA NỘP LÊN ĐƠN VỊ CẤP TRÊN';
                this.searchFilter.loaiTimKiem = '0';
                this.searchFilter.maLoai = Cvmb.TIEN_THUA;
                this.perm.create = Roles.CVMB.ADD_NTT;
                this.perm.edit = Roles.CVMB.EDIT_NTT;
                this.perm.delete = Roles.CVMB.DEL_NTT;
                this.perm.pass = Roles.CVMB.PASS_NTT;
                this.perm.approve = Roles.CVMB.APPROVE_NTT;
                break;
            case Tab.DS_GN_TT:
                this.title = 'DANH SÁCH GHI NHẬN TIỀN THỪA NỘP TỪ ĐƠN VỊ CẤP DƯỚI';
                this.trangThais = Status.TRANG_THAI_DVCT;
                this.searchFilter.loaiTimKiem = '1';
                this.searchFilter.maLoai = Cvmb.TIEN_THUA;
                this.perm.create = 'NO';
                this.perm.edit = 'NO';
                this.perm.delete = 'NO';
                this.perm.pass = Roles.CVMB.PASS_NTT_GN;
                this.perm.approve = Roles.CVMB.APPROVE_NTT_GN;
                this.isParent = true;
                break;
            case Tab.DS_TTKH:
                this.title = 'DANH SÁCH THANH TOÁN CHO KHÁCH HÀNG';
                this.searchFilter.loaiTimKiem = '0';
                this.searchFilter.maLoai = Cvmb.THANH_TOAN;
                this.perm.create = Roles.CVMB.ADD_TTKH;
                this.perm.edit = Roles.CVMB.EDIT_TTKH;
                this.perm.delete = Roles.CVMB.DEL_TTKH;
                this.perm.pass = Roles.CVMB.PASS_TTKH;
                this.perm.approve = Roles.CVMB.APPROVE_TTKH;
                break;
            default:
                break;
        }
        this.statusNewReport = this.userService.isAccessPermisson(this.perm.create);
        this.statusDelete = this.userService.isAccessPermisson(this.perm.delete);
        //neu co quyen phe duyet thi trang thai mac dinh la trinh duyet
        if (this.userService.isAccessPermisson(this.perm.pass)) {
            this.searchFilter.trangThai = Status.TT_02;
        } else if (this.userService.isAccessPermisson(this.perm.approve)) {
            this.searchFilter.trangThai = Status.TT_04;
        } else if (this.userService.isAccessPermisson(this.perm.accept)) {
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
        return Utils.statusSave.includes(trangThai) && this.userService.isAccessPermisson(this.perm.edit);
    }

    checkDeleteStatus(trangThai: string) {
        return Utils.statusDelete.includes(trangThai) && this.userService.isAccessPermisson(this.perm.delete);
    }

    addNewReport() {
        let nzContent: ComponentType<any>;
        if (this.searchFilter.maLoai == Cvmb.GHI_NHAN_CU_VON || this.searchFilter.maLoai == Cvmb.CU_VON_DVCD) {
            nzContent = DialogTaoMoiCapUngVonComponent;
        } else if (this.searchFilter.maLoai == Cvmb.TIEN_THUA) {
            nzContent = DialogTaoMoiTienThuaComponent;
        } else {
            nzContent = DialogTaoMoiThanhToanComponent;
        }
        const modalTuChoi = this.modal.create({
            nzTitle: 'Thông tin tạo mới',
            nzContent: nzContent,
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
            tabSelected: '',
        }
        switch (this.searchFilter.maLoai) {
            case Cvmb.GHI_NHAN_CU_VON:
                obj.tabSelected = Tab.CUV;
                break;
            case Cvmb.CU_VON_DVCD:
                obj.tabSelected = Tab.CUV;
                break;
            case Cvmb.TIEN_THUA:
                obj.tabSelected = Tab.TIEN_THUA;
                break;
            case Cvmb.THANH_TOAN:
                if (data.canCuVeGia == Cvmb.HOP_DONG) {
                    obj.tabSelected = Tab.THANH_TOAN_HOP_DONG;
                } else {
                    obj.tabSelected = Tab.THANH_TOAN_DON_GIA;
                }
                break;
            default:
                break;
        }
        // if (data.maLoai == 2 && data.ttNhan.trangThai == Utils.TT_BC_1) {
        //     await this.checkExistTienThua(data.namDnghi);
        //     if (!this.isExistTienThua) {
        //         await this.addVonBanGuiDvct(data.namDnghi);
        //     }
        // }
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
