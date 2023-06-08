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
import { CAN_CU_GIA, CVMB, LOAI_DE_NGHI, Utils } from 'src/app/Utility/utils';
import { TRANG_THAI } from '../../cap-von-mua-ban-va-thanh-toan-tien-hang.constant';
import { DialogTaoMoiVonBanComponent } from '../dialog-tao-moi-von-ban/dialog-tao-moi-von-ban.component';

@Component({
    selector: 'app-danh-sach-von-ban',
    templateUrl: './danh-sach-von-ban.component.html',
    styleUrls: ['../von-ban.component.scss']
})
export class DanhSachVonBanComponent implements OnInit {
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
        canCuVeGia: null,
        namDnghi: null,
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
    canCuGias: any[] = CAN_CU_GIA;
    //cac quyn cua nguoi thao tac
    createPermission: string;
    editPermission: string;
    deletePermission: string;
    passPermission: string;
    approvePermission: string;
    isSend: boolean;
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
            case 'nop':
                this.title = 'DANH SÁCH NỘP VỐN BÁN HÀNG LÊN ĐƠN VỊ CẤP TRÊN';
                this.searchFilter.loaiTimKiem = '0';
                this.searchFilter.maLoai = 4;
                this.createPermission = CVMB.ADD_REPORT_NTV_BH;
                this.deletePermission = CVMB.DELETE_REPORT_NTV_BH;
                this.editPermission = CVMB.EDIT_REPORT_NTV_BH;
                this.passPermission = CVMB.DUYET_REPORT_NTV_BH;
                this.approvePermission = CVMB.PHE_DUYET_REPORT_NTV_BH;
                this.isSend = true;
                break;
            case 'gn':
                this.title = 'DANH SÁCH GHI NHẬN VỐN BÁN HÀNG TỪ ĐƠN VỊ CẤP DƯỚI';
                this.searchFilter.loaiTimKiem = '0';
                this.searchFilter.maLoai = 1;
                this.createPermission = 'NO';
                this.editPermission = 'NO';
                this.deletePermission = 'NO';
                this.passPermission = 'NO';
                this.approvePermission = 'NO';
                this.isSend = false;
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
                            ...item,
                            ngayTrinh: this.isSend ? item.ttGui.ngayTrinh : item.ttNhan.ngayTrinh,
                            ngayDuyet: this.isSend ? item.ttGui.ngayDuyet : item.ttNhan.ngayDuyet,
                            ngayPheDuyet: this.isSend ? item.ttGui.ngayPheDuyet : item.ttNhan.ngayPheDuyet,
                            trangThai: this.isSend ? item.ttGui.trangThai : item.ttNhan.trangThai,
                            lyDoTuChoi: this.isSend ? item.ttGui.lyDoTuChoi : item.ttNhan.lyDoTuChoi,
                            checked: false,
                            isEdit: this.checkEditStatus(this.isSend ? item.ttGui.trangThai : item.ttNhan.trangThai),
                            isDelete: this.checkDeleteStatus(this.isSend ? item.ttGui.trangThai : item.ttNhan.trangThai),
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
        this.searchFilter.namDnghi = null
        this.searchFilter.loaiDnghi = null
        this.searchFilter.canCuVeGia = null
        this.search();
    }

    getDate(date: Date) {
        return this.datePipe.transform(date, Utils.FORMAT_DATE_STR);
    }

    checkEditStatus(trangThai: string) {
        return Utils.statusSave.includes(trangThai) && this.userService.isAccessPermisson(this.editPermission);
    }

    checkDeleteStatus(trangThai: string) {
        return Utils.statusDelete.includes(trangThai) && this.userService.isAccessPermisson(this.deletePermission);
    }

    getStatusName(trangThai: string) {
        if (this.searchFilter.loaiTimKiem == '1' && trangThai == Utils.TT_BC_1) {
            return 'Mới';
        }
        return this.trangThais.find(e => e.id == trangThai)?.tenDm;
    }

    addNewReport() {
        const modalTuChoi = this.modal.create({
            nzTitle: 'Thông tin tạo mới',
            nzContent: DialogTaoMoiVonBanComponent,
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
                    tabSelected: res.canCuVeGia == Utils.HD_TRUNG_THAU ? 'hopdong' : 'dongia',
                }
                this.dataChange.emit(obj);
            }
        });
    }

    //xem chi tiet bao cao
    viewDetail(data: any) {
        const obj = {
            id: data.id,
            tabSelected: data.canCuVeGia == Utils.HD_TRUNG_THAU ? 'hopdong' : 'dongia',
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
