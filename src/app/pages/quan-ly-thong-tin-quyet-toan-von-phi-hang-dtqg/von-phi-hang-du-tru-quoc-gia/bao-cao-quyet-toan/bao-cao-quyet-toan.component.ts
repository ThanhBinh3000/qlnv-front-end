import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogThemBaoCaoQuyetToanComponent } from './dialog-them-bao-cao-quyet-toan/dialog-them-bao-cao-quyet-toan.component';
// import { DialogTaoMoiBaoCaoQuyetToanComponent } from 'src/app/components/dialog/dialog-tao-moi-bao-cao-quyet-toan/dialog-tao-moi-bao-cao-quyet-toan.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { UserService } from 'src/app/services/user.service';
import { Utils } from 'src/app/Utility/utils';
import { QuanLyVonPhiService } from '../../../../services/quanLyVonPhi.service';
import { MAIN_ROUTE_QUYET_TOAN, QUAN_LY_QUYET_TOAN } from '../../quan-ly-thong-tin-quyet-toan-von-phi-hang-dtqg.constant';
import { QTVP } from './../../../../Utility/utils';
import { QuyetToanVonPhiService } from 'src/app/services/quan-ly-von-phi/quyetToanVonPhi.service';

// import { TRANGTHAIBAOCAO } from '../quan-ly-lap-tham-dinh-du-toan-nsnn.constant';
// trang thai ban ghi
export const TRANG_THAI_TIM_KIEM = [
    {
        id: "1",
        tenDm: 'Đang soạn'
    },
    {
        id: "2",
        tenDm: 'Trình duyệt'
    },
    {
        id: "3",
        tenDm: 'Trưởng BP từ chối'
    },
    {
        id: "4",
        tenDm: 'Trưởng BP duyệt'
    },
    {
        id: "5",
        tenDm: 'Lãnh đạo từ chối'
    },
    {
        id: "6",
        tenDm: 'Lãnh đạo phê duyệt'
    },
    {
        id: "7",
        tenDm: 'mới'
    },
    {
        id: "8",
        tenDm: 'Cấp trên từ chối'
    },
    {
        id: "9",
        tenDm: 'Tiếp nhận'
    },
]
@Component({
    selector: 'app-bao-cao-quyet-toan',
    templateUrl: './bao-cao-quyet-toan.component.html',
    styleUrls: ['./bao-cao-quyet-toan.component.scss']
})
export class BaoCaoQuyetToanComponent implements OnInit {
    @Input() data

    dataThemMoi: any;
    //thong tin dang nhap
    userInfo: any;
    //thong tin tim kiem
    searchFilter = {
        maBcao: null,
        maPhanBcao: '1',
        namQtoan: null,
        ngayTaoDen: null,
        ngayTaoTu: null,
        paggingReq: {
            limit: 10,
            page: 1
        },
        str: "",
        trangThai: "",
        trangThais: [
        ]
    };

    tableFilter = {
        maBcao: null,
        namQtoan: null,
        ngayTao: null,
        ngayTrinh: null,
        ngayDuyet: null,
        ngayPheDuyet: null,
        trangThai: null,
    }

    //danh muc
    danhSachBaoCao: any[] = [];
    danhSachBaoCaoAll: any[] = [];
    trangThais: any[] = TRANG_THAI_TIM_KIEM;
    //phan trang
    totalElements = 0;
    totalPages = 0;
    pages = {
        size: 10,
        page: 1,
    }
    donViTao!: any;
    trangThai!: string;
    newDate = new Date();
    userRole: string;
    status = false;
    statusBtnXoaDk: boolean;
    donVis: any[] = [];
    maDviTao: string;
    listIdDelete: string[] = [];
    statusBtnValidate = true;
    statusNewReport = true;
    statusDelete = false;
    allChecked = false;
    isAddNew = false;
    idSelected: string;
    isStatus: string;
    constructor(
        private quanLyVonPhiService: QuanLyVonPhiService,
        private quyetToanVonPhiService: QuyetToanVonPhiService,
        private router: Router,
        private datePipe: DatePipe,
        private notification: NzNotificationService,
        private spinner: NgxSpinnerService,
        private userService: UserService,
        private modal: NzModalService,
    ) {
    }

    async ngOnInit() {
        this.spinner.show()
        this.userInfo = this.userService.getUserLogin();
        this.searchFilter.namQtoan = new Date().getFullYear() - 1
        this.searchFilter.ngayTaoDen = new Date();
        this.newDate.setMonth(this.newDate.getMonth() - 1);
        this.searchFilter.ngayTaoTu = this.newDate;
        this.donViTao = this.userInfo?.MA_DVI;
        this.statusNewReport = this.userService.isAccessPermisson(QTVP.ADD_REPORT)
        this.statusDelete = this.userService.isAccessPermisson(QTVP.DELETE_REPORT);
        //  check va lay gia tri role trong list role
        this.statusBtnXoaDk = false;
        if (this.userService.isAccessPermisson(QTVP.EDIT_REPORT)) {
            this.status = false;
            this.trangThai = Utils.TT_BC_1;
            this.donVis = this.donVis.filter(e => e?.maDviCha == this.donViTao);
            this.searchFilter.trangThais.push(TRANG_THAI_TIM_KIEM.find(e => e.id == Utils.TT_BC_1));
        }
        else {
            if (this.userService.isAccessPermisson(QTVP.DUYET_QUYET_TOAN_REPORT)) {
                this.status = true;
                this.trangThai = Utils.TT_BC_2;
                this.searchFilter.trangThais.push(TRANG_THAI_TIM_KIEM.find(e => e.id == Utils.TT_BC_2));
            } else if (this.userService.isAccessPermisson(QTVP.PHE_DUYET_QUYET_TOAN_REPORT)) {
                this.status = true;
                this.trangThai = Utils.TT_BC_4;
                this.searchFilter.trangThais.push(TRANG_THAI_TIM_KIEM.find(e => e.id == Utils.TT_BC_4));
            } else {
                this.trangThai = null;
                this.searchFilter.trangThais = [Utils.TT_BC_1, Utils.TT_BC_2, Utils.TT_BC_3, Utils.TT_BC_4, Utils.TT_BC_5, Utils.TT_BC_6];
            }
        }
        await this.onSubmit();
        this.spinner.hide()
    }

    //search list bao cao theo tieu chi
    async onSubmit() {
        this.statusBtnValidate = true;
        if (
            (this.searchFilter.ngayTaoTu && this.searchFilter.ngayTaoDen)
        ) {
            if (this.searchFilter.ngayTaoTu > this.searchFilter.ngayTaoDen) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_DAY);
                return;
            }
        }
        this.spinner.show();
        const searchFilterTemp = Object.assign({}, this.searchFilter);
        searchFilterTemp.trangThais = [];
        searchFilterTemp.ngayTaoTu = this.datePipe.transform(searchFilterTemp.ngayTaoTu, Utils.FORMAT_DATE_STR) || searchFilterTemp.ngayTaoTu;
        searchFilterTemp.ngayTaoDen = this.datePipe.transform(searchFilterTemp.ngayTaoDen, Utils.FORMAT_DATE_STR) || searchFilterTemp.ngayTaoDen;
        if (this.trangThai) {
            searchFilterTemp.trangThais.push(this.trangThai)
        } else {
            searchFilterTemp.trangThais = [Utils.TT_BC_1, Utils.TT_BC_2, Utils.TT_BC_3, Utils.TT_BC_4, Utils.TT_BC_5, Utils.TT_BC_6, Utils.TT_BC_7, Utils.TT_BC_8, Utils.TT_BC_9]
        }
        if (!this.trangThai) {
            searchFilterTemp.trangThais = [Utils.TT_BC_1, Utils.TT_BC_2, Utils.TT_BC_3, Utils.TT_BC_4, Utils.TT_BC_5, Utils.TT_BC_6, Utils.TT_BC_7, Utils.TT_BC_8, Utils.TT_BC_9]
        } else {
            searchFilterTemp.trangThais = [this.trangThai];
        }
        await this.quyetToanVonPhiService.timBaoCaoQuyetToanVonPhi(searchFilterTemp).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    // this.danhSachBaoCao = data.data.content;
                    this.danhSachBaoCao = [];
                    data.data.content.forEach(item => {
                        if (this.listIdDelete.findIndex(e => e == item.id) == -1) {
                            this.danhSachBaoCao.push({
                                ...item,
                                checked: false,
                                isEdit: this.checkEditStatus(item.trangThai),
                                isDelete: this.checkDeleteStatus(item.trangThai),
                            })
                        }
                        else {
                            this.danhSachBaoCao.push({
                                ...item,
                                checked: true,
                            })
                        }
                    })
                    this.danhSachBaoCao.forEach(e => {
                        e.ngayDuyet = this.datePipe.transform(e.ngayDuyet, Utils.FORMAT_DATE_STR);
                        e.ngayTao = this.datePipe.transform(e.ngayTao, Utils.FORMAT_DATE_STR);
                        e.ngayTrinh = this.datePipe.transform(e.ngayTrinh, Utils.FORMAT_DATE_STR);
                        e.ngayPheDuyet = this.datePipe.transform(e.ngayPheDuyet, Utils.FORMAT_DATE_STR);
                        e.ngayTraKq = this.datePipe.transform(e.ngayTraKq, Utils.FORMAT_DATE_STR);
                    })
                    this.danhSachBaoCaoAll = cloneDeep(this.danhSachBaoCao);
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
        this.onSubmit();
    }

    //doi so luong phan tu tren 1 trang
    onPageSizeChange(size) {
        this.searchFilter.paggingReq.limit = size;
        this.onSubmit();
    }

    deleteCondition() {
        this.searchFilter.namQtoan = null
        this.searchFilter.ngayTaoDen = null
        this.searchFilter.ngayTaoTu = null
        this.searchFilter.maBcao = null
        this.trangThai = null
        this.onSubmit();
    };

    checkEditStatus(trangThai: string) {
        return Utils.statusSave.includes(trangThai) &&
            (this.userService.isAccessPermisson(QTVP.EDIT_REPORT));
    };

    checkDeleteStatus(trangThai: string) {
        return Utils.statusDelete.includes(trangThai) &&
            (this.userService.isAccessPermisson(QTVP.DELETE_REPORT));
    };

    //them bao cao moi
    addNewReport() {
        const modalTuChoi = this.modal.create({
            nzTitle: 'Thông tin tạo mới báo cáo quyết toán vốn, phi hàng DTQG',
            nzContent: DialogThemBaoCaoQuyetToanComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {
            },
        });
        modalTuChoi.afterClose.toPromise().then(async (res) => {
            if (res) {
                const request = {
                    maPhanBcao: res.maPhanBcao,
                    namQtoan: res.namQtoan,
                    quyQtoan: res.quyQtoan,
                }
                await this.quyetToanVonPhiService.checkNamTaoMoiQuyetToan(request).toPromise().then(
                    (data) => {
                        if (data.statusCode == 0) {
                            this.isAddNew = true;
                            this.dataThemMoi = request;
                            this.idSelected = null;
                        } else {
                            this.notification.warning(MESSAGE.WARNING, data?.msg)
                        }
                    },
                    (err) => {
                        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                    },
                );
            }
        });
    };

    viewDetail(data: any) {
        this.isAddNew = true;
        this.idSelected = data?.id;
        this.isStatus = data?.trangThai;
    };

    getStatusName(trangThai: string) {
        return this.trangThais.find(e => e.id == trangThai).tenDm;
    };

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
                    if (this.danhSachBaoCao && this.danhSachBaoCao.length > 0) {
                        this.danhSachBaoCao.forEach(item => {
                            if (item.checked) {
                                request.push(item.id);
                            }
                        })
                    }
                }
                this.quyetToanVonPhiService.xoaBaoCaoLapQuyetToan(request).toPromise().then(
                    data => {
                        if (data.statusCode == 0) {
                            this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
                            this.onSubmit();
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

        // let request = [];
        // if (!id) {
        //   request = this.listIdDelete;
        // } else {
        //   request = [id];
        // }
        // this.quanLyVonPhiService.xoaBaoCaoLapQuyetToan(request).toPromise().then(
        //   data => {
        //     if (data.statusCode == 0) {
        //       this.listIdDelete = [];
        //       this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
        //       this.onSubmit();
        //     } else {
        //       this.notification.error(MESSAGE.ERROR, data?.msg);
        //     }
        //   },
        //   err => {
        //     this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        //   }
        // )
    }

    updateSingleChecked(): void {
        if (this.danhSachBaoCao.every((item) => !item.checked && item.isDelete)) {
            this.allChecked = false;
        } else if (this.danhSachBaoCao.every((item) => item.checked && item.isDelete)) {
            this.allChecked = true;
        }
    };

    updateAllChecked(): void {
        if (this.danhSachBaoCao && this.danhSachBaoCao.length > 0) {
            if (this.allChecked) {
                this.danhSachBaoCao.forEach(item => {
                    if (item.isDelete) {
                        item.checked = true;
                    }
                })
            } else {
                this.danhSachBaoCao.forEach(item => {
                    if (item.isDelete) {
                        item.checked = false;
                    }
                })
            }
        }
    };

    changeListIdDelete(id: any) {
        if (this.listIdDelete.findIndex(e => e == id) == -1) {
            this.listIdDelete.push(id);
        } else {
            this.listIdDelete = this.listIdDelete.filter(e => e != id);
        }
    };

    checkAll() {
        let check = true;
        this.danhSachBaoCao.forEach(item => {
            if (item.checked) {
                check = false;
            }
        })
        return check;
    };
    checkViewReport() {
        return this.userService.isAccessPermisson(QTVP.VIEW_REPORT)
    };
    updateAllCheck() {
        this.danhSachBaoCao.forEach(item => {
            if (this.checkDeleteReport(item.trangThai)) {
                item.checked = true;
                this.listIdDelete.push(item.id);
            }
        })
    };

    checkDeleteReport(trangThai: string) {
        return Utils.statusDelete.includes(trangThai) && this.userService.isAccessPermisson(QTVP.DELETE_REPORT)
    };

    // Tìm kiếm trong bảng
    filterInTable(key: string, value: string, isDate: boolean) {
        if (value && value != '') {
            this.danhSachBaoCao = [];
            let temp = [];
            if (this.danhSachBaoCaoAll && this.danhSachBaoCaoAll.length > 0) {
                if (isDate) {
                    value = this.datePipe.transform(value, Utils.FORMAT_DATE_STR);
                }
                this.danhSachBaoCaoAll.forEach((item) => {
                    if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
                        temp.push(item)
                    }
                });
            }
            this.danhSachBaoCao = [...this.danhSachBaoCao, ...temp];
        } else {
            this.danhSachBaoCao = cloneDeep(this.danhSachBaoCaoAll);
        }
    };

    onClose() {
        this.isAddNew = false;
        this.onSubmit();
    }
}
