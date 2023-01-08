import { ComponentType } from '@angular/cdk/portal';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { CapVonMuaBanTtthService } from 'src/app/services/quan-ly-von-phi/capVonMuaBanTtth.service';
import { UserService } from 'src/app/services/user.service';
import { CVMB, LOAI_DE_NGHI, Utils } from 'src/app/Utility/utils';
import { TRANG_THAI } from '../../cap-von-mua-ban-va-thanh-toan-tien-hang.constant';
import { DialogTaoMoiCapVonComponent } from '../dialog-tao-moi-cap-von/dialog-tao-moi-cap-von.component';
import { DialogTaoMoiThanhToanComponent } from '../dialog-tao-moi-thanh-toan/dialog-tao-moi-thanh-toan.component';
import { DialogTaoMoiTienThuaComponent } from '../dialog-tao-moi-tien-thua/dialog-tao-moi-tien-thua.component';

@Component({
    selector: 'app-danh-sach-von-mua-von-ung',
    templateUrl: './danh-sach-von-mua-von-ung.component.html',
    styleUrls: ['../von-mua-von-ung.component.scss']
})
export class DanhSachVonMuaVonUngComponent implements OnInit {
    @Input() dataInfo: any;
    @Output() dataChange = new EventEmitter();

    //thong tin user
    userInfo: any;
    //thong tin tim kiem
    searchFilter = {
        loaiTimKiem: '0',
        maLoai: null,
        maCapUng: null,
        maDvi: null,
        loaiDnghi: null,
        namBcao: null,
        ngayTaoDen: null,
        ngayTaoTu: null,
        paggingReq: {
            limit: 10,
            page: 1,
        },
        trangThai: Utils.TT_BC_1,
    };
    title: string;
    // danh sach
    dataTable: any[] = [];
    dataTableAll: any[] = [];
    trangThais: any[] = TRANG_THAI;
    loaiDns: any[] = LOAI_DE_NGHI;
    //cac quyn cua nguoi thao tac
    createPermission: string;
    editPermission: string;
    deletePermission: string;
    passPermission: string;
    approvePermission: string;
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
        private danhMuc: DanhMucHDVService,
        private modal: NzModalService,
        public userService: UserService,
        private capVonMuaBanTtthService: CapVonMuaBanTtthService,
        private datePipe: DatePipe,
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
        switch (this.dataInfo?.tabSelected) {
            case 'gnv':
                this.title = 'DANH SÁCH GHI NHẬN CẤP ỨNG VỐN TỪ ĐƠN VỊ CẤP TRÊN';
                this.searchFilter.loaiTimKiem = '0';
                if (this.userService.isTongCuc()) {
                    this.searchFilter.maLoai = 1;
                    this.createPermission = CVMB.ADD_REPORT_TC_GNV;
                    this.deletePermission = CVMB.DELETE_REPORT_GNV;
                } else {
                    this.searchFilter.maLoai = 2;
                    this.createPermission = CVMB.ADD_REPORT_GNV;
                    this.deletePermission = 'NO';
                }
                this.editPermission = CVMB.EDIT_REPORT_GNV;
                this.passPermission = CVMB.DUYET_REPORT_GNV;
                this.approvePermission = CVMB.PHE_DUYET_REPORT_GNV;
                break;
            case 'cv':
                this.title = 'DANH SÁCH CẤP ỨNG VỐN CHO ĐƠN VỊ CẤP DƯỚI';
                this.searchFilter.loaiTimKiem = '0';
                this.searchFilter.maLoai = 3;
                this.createPermission = CVMB.ADD_REPORT_CV;
                this.editPermission = CVMB.EDIT_REPORT_CV;
                this.deletePermission = CVMB.DELETE_REPORT_CV;
                this.passPermission = CVMB.DUYET_REPORT_CV;
                this.approvePermission = CVMB.PHE_DUYET_REPORT_CV;
                break;
            case 'tt':
                this.title = 'DANH SÁCH TIỀN THỪA NỘP LÊN ĐƠN VỊ CẤP TRÊN';
                this.searchFilter.loaiTimKiem = '0';
                this.searchFilter.maLoai = 6;
                this.createPermission = CVMB.ADD_REPORT_NTVT;
                this.editPermission = CVMB.EDIT_REPORT_NTVT;
                this.deletePermission = CVMB.DELETE_REPORT_NTVT;
                this.passPermission = CVMB.DUYET_REPORT_NTVT;
                this.approvePermission = CVMB.PHE_DUYET_REPORT_NTVT;
                break;
            case 'gn-tt':
                this.title = 'DANH SÁCH GHI NHẬN TIỀN THỪA NỘP TỪ ĐƠN VỊ CẤP DƯỚI';
                this.isParent = true;
                this.searchFilter.loaiTimKiem = '1';
                this.searchFilter.maLoai = 6;
                this.createPermission = 'NO';
                this.editPermission = CVMB.EDIT_REPORT_GNV_TH;
                this.deletePermission = 'NO';
                this.passPermission = CVMB.DUYET_REPORT_GNV_TH;
                this.approvePermission = CVMB.PHE_DUYET_REPORT_GNV_TH;
                this.trangThais.find(e => e.id == Utils.TT_BC_1).tenDm = 'Mới';
                break;
            case 'thanhtoan':
                this.title = 'DANH SÁCH THANH TOÁN CHO KHÁCH HÀNG';
                this.searchFilter.loaiTimKiem = '0';
                this.searchFilter.maLoai = 5;
                this.createPermission = CVMB.ADD_REPORT_TTKH;
                this.editPermission = CVMB.EDIT_REPORT_TTKH;
                this.deletePermission = CVMB.DELETE_REPORT_TTKH;
                this.passPermission = CVMB.DUYET_REPORT_TTKH;
                this.approvePermission = CVMB.PHE_DUYET_REPORT_TTKH;
                break;
            default:
                break;
        }
        this.statusNewReport = this.userService.isAccessPermisson(this.createPermission);
        this.statusDelete = this.userService.isAccessPermisson(this.deletePermission);
        //neu co quyen phe duyet thi trang thai mac dinh la trinh duyet
        if (this.userService.isAccessPermisson(this.passPermission)) {
            this.searchFilter.trangThai = Utils.TT_BC_2;
        } else {
            if (this.userService.isAccessPermisson(this.approvePermission)) {
                this.searchFilter.trangThai = Utils.TT_BC_4;
            }
        }
        this.search();
        this.spinner.hide();
    }

    async search() {
        const request = JSON.parse(JSON.stringify(this.searchFilter));
        request.ngayTaoDen = this.datePipe.transform(this.searchFilter.ngayTaoDen, Utils.FORMAT_DATE_STR);
        request.ngayTaoTu = this.datePipe.transform(this.searchFilter.ngayTaoTu, Utils.FORMAT_DATE_STR);
        this.spinner.show();
        await this.capVonMuaBanTtthService.timKiemVonMuaBan(request).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.dataTable = [];
                    data.data.content.forEach(item => {
                        this.dataTable.push({
                            // ...item,
                            // ngayTao: this.datePipe.transform(item.ngayTao, Utils.FORMAT_DATE_STR),
                            // ngayTrinh: this.datePipe.transform(item.ngayTrinh, Utils.FORMAT_DATE_STR),
                            // ngayDuyet: this.datePipe.transform(item.ngayDuyet, Utils.FORMAT_DATE_STR),
                            // ngayPheDuyet: this.datePipe.transform(item.ngayPheDuyet, Utils.FORMAT_DATE_STR),
                            // checked: false,
                            // isEdit: this.checkEditStatus(item.trangThai),
                            // isDelete: this.checkDeleteStatus(item.trangThai),
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
        this.searchFilter.maCapUng = null
        this.searchFilter.trangThai = null
        this.searchFilter.ngayTaoTu = null
        this.searchFilter.ngayTaoDen = null
        this.searchFilter.namBcao = null
        this.searchFilter.loaiDnghi = null
        this.search();
    }

    checkEditStatus(trangThai: string) {
        return Utils.statusSave.includes(trangThai) && this.userService.isAccessPermisson(this.editPermission);
    }

    checkDeleteStatus(trangThai: string) {
        return Utils.statusDelete.includes(trangThai) && this.userService.isAccessPermisson(this.deletePermission);
    }

    getStatusName(trangThai: string) {
        return this.trangThais.find(e => e.id == trangThai)?.tenDm;
    }

    addNewReport() {
        let nzContent: ComponentType<any>;
        if (this.searchFilter.maLoai == 1 || this.searchFilter.maLoai == 2 || this.searchFilter.maLoai == 3) {
            nzContent = DialogTaoMoiCapVonComponent;
        } else if (this.searchFilter.maLoai == 6) {
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
                const obj = {
                    baoCao: res,
                    id: null,
                    tabSelected: null,
                }
                switch (this.searchFilter.maLoai) {
                    case 1:
                        obj.tabSelected = 'gnv-btc';
                        break;
                    case 2:
                        obj.tabSelected = 'gnv-cv';
                        break;
                    case 3:
                        obj.tabSelected = 'gnv-cv';
                        break;
                    case 5:
                        if (res.loaiDnghi == Utils.MUA_VTU) {
                            obj.tabSelected = 'tt-vattu';
                        } else {
                            if (res.canCuVeGia == Utils.HD_TRUNG_THAU) {
                                obj.tabSelected = 'tt-hopdong';
                            } else {
                                obj.tabSelected = 'tt-dongia';
                            }
                        }
                        break;
                    case 6:
                        obj.tabSelected = 'tienthua';
                        break;
                    default:
                        break;
                }
                this.dataChange.emit(obj);
            }
        });
    }

    //xem chi tiet bao cao
    viewDetail(data: any) {
        const obj = {
            id: data.id,
            tabSelected: '',
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
