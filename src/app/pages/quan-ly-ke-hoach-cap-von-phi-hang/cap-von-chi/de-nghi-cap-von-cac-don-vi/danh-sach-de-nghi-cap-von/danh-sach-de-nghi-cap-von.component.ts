import { ComponentType } from '@angular/cdk/portal';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Roles, Status, Utils } from 'src/app/Utility/utils';
import { MESSAGE } from 'src/app/constants/message';
import { UserService } from 'src/app/services/user.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { Cvnc, Perm, Search } from '../de-nghi-cap-von-cac-don-vi.constant';
import { CapVonNguonChiService } from 'src/app/services/quan-ly-von-phi/capVonNguonChi.service';

@Component({
    selector: 'app-danh-sach-de-nghi-cap-von',
    templateUrl: './danh-sach-de-nghi-cap-von.component.html',
    styleUrls: ['../de-nghi-cap-von-cac-don-vi.component.scss']
})

export class DanhSachDeNghiCapVonComponent implements OnInit {
    @Input() dataInfo: any;
    @Output() dataChange = new EventEmitter();
    Utils = Utils;
    Status = Status;
    Cvnc = Cvnc;
    //thong tin user
    userInfo: any;
    //thong tin tim kiem
    searchFilter: Search = new Search();
    perm = new Perm();
    title: string;
    // danh sach
    dataTable: any[] = [];
    dataTableAll: any[] = [];
    trangThais: any[] = Status.TRANG_THAI_DVCD;
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
        private CapVonNguonChiService: CapVonNguonChiService,
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
        this.searchFilter.loaiTimKiem = '0';
        switch (this.dataInfo?.tabSelected) {
            case Cvnc.DS_CAP_VON:
                this.title = 'DANH SÁCH CẤP VỐN';
                this.searchFilter.maLoai = Cvnc.CAP_VON;
                this.perm.create = Roles.CVNC.ADD_CV;
                this.perm.delete = Roles.CVNC.DEL_CV;
                this.perm.pass = Roles.CVNC.PASS_CV;
                this.perm.approve = Roles.CVNC.APPROVE_CV;
                break;
            case Cvnc.DS_DN_CAP_VON:
                this.title = 'DANH SÁCH ĐỀ NGHỊ CẤP VỐN';
                this.searchFilter.maLoai = Cvnc.DE_NGHI;
                this.perm.create = Roles.CVNC.ADD_DN;
                this.perm.delete = Roles.CVNC.DEL_DN;
                this.perm.pass = Roles.CVNC.PASS_DN;
                this.perm.approve = Roles.CVNC.APPROVE_DN;
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
        }
        this.search();
        this.spinner.hide();
    }

    async search() {
        this.spinner.show();
        await this.CapVonNguonChiService.timKiemDeNghi(this.searchFilter.request()).toPromise().then(
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
        return Utils.statusSave.includes(trangThai) && this.userService.isAccessPermisson('NO');
    }

    checkDeleteStatus(trangThai: string) {
        return Utils.statusDelete.includes(trangThai) && this.userService.isAccessPermisson('NO');
    }

    addNewReport() {
        // let nzContent: ComponentType<any>;
        // if (this.searchFilter.maLoai == Cvmb.GHI_NHAN_CU_VON || this.searchFilter.maLoai == Cvmb.CU_VON_DVCD) {
        //     nzContent = DialogTaoMoiCapUngVonComponent;
        // } else if (this.searchFilter.maLoai == Cvmb.TIEN_THUA) {
        //     nzContent = DialogTaoMoiTienThuaComponent;
        // } else {
        //     nzContent = DialogTaoMoiThanhToanComponent;
        // }
        // const modalTuChoi = this.modal.create({
        //     nzTitle: 'Thông tin tạo mới',
        //     nzContent: nzContent,
        //     nzMaskClosable: false,
        //     nzClosable: false,
        //     nzWidth: '900px',
        //     nzFooter: null,
        //     nzComponentParams: {
        //         request: this.searchFilter
        //     },
        // });
        // modalTuChoi.afterClose.toPromise().then(async (res) => {
        //     if (res) {
        //         this.dataChange.emit(res);
        //     }
        // });
    }

    //xem chi tiet bao cao
    async viewDetail(data: any) {
        // const obj = {
        //     id: data.id,
        //     tabSelected: '',
        // }
        // switch (this.searchFilter.maLoai) {
        //     case Cvmb.GHI_NHAN_CU_VON:
        //         obj.tabSelected = Tab.CUV;
        //         break;
        //     case Cvmb.CU_VON_DVCD:
        //         obj.tabSelected = Tab.CUV;
        //         break;
        //     case Cvmb.TIEN_THUA:
        //         obj.tabSelected = Tab.TIEN_THUA;
        //         break;
        //     case Cvmb.THANH_TOAN:
        //         if (data.canCuVeGia == Cvmb.HOP_DONG) {
        //             obj.tabSelected = Tab.THANH_TOAN_HOP_DONG;
        //         } else {
        //             obj.tabSelected = Tab.THANH_TOAN_DON_GIA;
        //         }
        //         break;
        //     default:
        //         break;
        // }
        // this.dataChange.emit(obj);
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
                this.CapVonNguonChiService.xoaDeNghi(request).toPromise().then(
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
