import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { GDT, TRANG_THAI_TIM_KIEM, Utils } from 'src/app/Utility/utils';
import { MESSAGE } from 'src/app/constants/message';
import { GiaoDuToanChiService } from 'src/app/services/quan-ly-von-phi/giaoDuToanChi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { DialogTaoMoiComponent } from '../dialog-tao-moi/dialog-tao-moi.component';

@Component({
    selector: 'app-danh-sach-bao-cao',
    templateUrl: './danh-sach-bao-cao.component.html',
    styleUrls: ['./danh-sach-bao-cao.component.scss']
})
export class DanhSachBaoCaoComponent implements OnInit {
    @Output() dataChange = new EventEmitter();

    searchFilter = {
        nam: null,
        tuNgay: null,
        denNgay: null,
        maBaoCao: "",
        donViTao: "",
        trangThai: Utils.TT_BC_1,
        loaiDuAn: [1, 2],
        maPhanGiao: "3"
    };

    userInfo: any;
    trangThais: any = TRANG_THAI_TIM_KIEM;
    dataTable: any[] = [];
    dataTableAll: any[] = [];
    loaiDuAns: any[] = [
        {
            id: [1],
            tenDm: 'Giao dự toán'
        },
        {
            id: [2],
            tenDm: 'Giao, diều chỉnh dự toán'
        }
    ];
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
        private giaoDuToanChiService: GiaoDuToanChiService,
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
        this.searchFilter.donViTao = this.userInfo?.MA_DVI;
        //check quyen va cac nut chuc nang
        this.statusNewReport = this.userService.isAccessPermisson(GDT.ADD_REPORT_PA_PBDT);
        this.statusDelete = this.userService.isAccessPermisson(GDT.DELETE_REPORT_PA_PBDT) || this.userService.isAccessPermisson(GDT.DELETE_REPORT_PA_PBDT);
        if (this.userService.isAccessPermisson(GDT.DUYET_REPORT_TH) || this.userService.isAccessPermisson(GDT.DUYET_TUCHOI_PA_TH_PBDT)) {
            this.searchFilter.trangThai = Utils.TT_BC_2;
        } else {
            if (this.userService.isAccessPermisson(GDT.PHE_DUYET_REPORT_PA_PBDT) || this.userService.isAccessPermisson(GDT.PHE_DUYET_REPORT_PA_PBDT)) {
                this.searchFilter.trangThai = Utils.TT_BC_4;
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
        } else {
            trangThais = [Utils.TT_BC_1, Utils.TT_BC_2, Utils.TT_BC_3, Utils.TT_BC_4, Utils.TT_BC_5, Utils.TT_BC_6, Utils.TT_BC_7, Utils.TT_BC_8, Utils.TT_BC_9]
        }
        let requestReport
        if (this.userInfo.CAP_DVI == "3") {
            requestReport = {
                loaiTimKiem: "3",
                maPhanGiao: "3",
                maLoai: "2",
                loaiDuAn: this.searchFilter.loaiDuAn,
                maBcao: this.searchFilter.maBaoCao,
                donViTao: this.searchFilter.donViTao,
                namPa: this.searchFilter.nam,
                ngayTaoDen: this.datePipe.transform(this.searchFilter.denNgay, Utils.FORMAT_DATE_STR),
                ngayTaoTu: this.datePipe.transform(this.searchFilter.tuNgay, Utils.FORMAT_DATE_STR),
                paggingReq: {
                    limit: this.pages.size,
                    page: this.pages.page,
                },
                trangThais: trangThais,
            };
        }

        if (this.userInfo.CAP_DVI !== "3") {
            requestReport = {
                loaiTimKiem: "3",
                // ma phan giao 4 de tim bao cao tong hop
                maPhanGiao: "3",
                maLoai: "2",
                maLoaiDan: this.searchFilter.loaiDuAn,
                maBcao: this.searchFilter.maBaoCao,
                donViTao: this.searchFilter.donViTao,
                namPa: this.searchFilter.nam,
                ngayTaoDen: this.datePipe.transform(this.searchFilter.denNgay, Utils.FORMAT_DATE_STR),
                ngayTaoTu: this.datePipe.transform(this.searchFilter.tuNgay, Utils.FORMAT_DATE_STR),
                paggingReq: {
                    limit: this.pages.size,
                    page: this.pages.page,
                },
                trangThais: trangThais,
            };
        }
        await this.giaoDuToanChiService.timPhuongAnGiao(requestReport).toPromise().then(res => {
            if (res.statusCode == 0) {
                this.dataTable = [];
                res.data.content.forEach(item => {
                    this.dataTable.push({
                        ...item,
                        namBcao: item.namPa,
                        ngayDuyet: this.datePipe.transform(item.ngayDuyet, Utils.FORMAT_DATE_STR),
                        ngayTao: this.datePipe.transform(item.ngayTao, Utils.FORMAT_DATE_STR),
                        ngayTrinh: this.datePipe.transform(item.ngayTrinh, Utils.FORMAT_DATE_STR),
                        ngayPheDuyet: this.datePipe.transform(item.ngayPheDuyet, Utils.FORMAT_DATE_STR),
                        ngayTraKq: this.datePipe.transform(item.ngayTraKq, Utils.FORMAT_DATE_STR),
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
        this.searchFilter.maPhanGiao = "3"
        this.search();
    }

    checkEditStatus(item: any) {
        const isSynthetic = item.tongHopTu != "[]";
        return Utils.statusSave.includes(item.trangThai) &&
            (isSynthetic ? this.userService.isAccessPermisson(GDT.EDIT_REPORT_TH) : this.userService.isAccessPermisson(GDT.EDIT_REPORT_TH));
    }

    checkDeleteStatus(item: any) {
        const isSynthetic = item.tongHopTu != "[]";
        return Utils.statusDelete.includes(item.trangThai) &&
            (isSynthetic ? this.userService.isAccessPermisson(GDT.XOA_REPORT_TH) : this.userService.isAccessPermisson(GDT.XOA_REPORT_TH));
    }

    getStatusName(trangThai: string) {
        return this.trangThais.find(e => e.id == trangThai)?.tenDm;
    }

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
                    ...res,
                    id: null,
                    tabSelected: 'baocao',
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
            tabSelected: 'addBaoCao',
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
                this.giaoDuToanChiService.xoaBanGhiGiaoBTC(request).toPromise().then(
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

