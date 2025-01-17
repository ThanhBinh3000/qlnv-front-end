import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Roles, Status, Utils } from 'src/app/Utility/utils';
import { MESSAGE } from 'src/app/constants/message';
import { GiaoDuToanChiService } from 'src/app/services/quan-ly-von-phi/giaoDuToanChi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { DialogTaoMoiComponent } from '../dialog-tao-moi/dialog-tao-moi.component';


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
        tenDm: 'Từ chối duyệt'
    },
    {
        id: "4",
        tenDm: 'Duyệt'
    },
    {
        id: "5",
        tenDm: 'Từ chối phê duyệt'
    },
    {
        id: "6",
        tenDm: 'Phê duyệt',
    },
    {
        id: "7",
        tenDm: 'Phê duyệt'
    },
    {
        id: "8",
        tenDm: 'Từ chối tiếp nhận'
    },
    {
        id: "9",
        tenDm: 'Tiếp nhận'
    },
    // {
    //     id: "10",
    //     tenDm: 'Lãnh đạo yêu cầu điều chỉnh'
    // },
]

@Component({
    selector: 'app-danh-sach-bao-cao',
    templateUrl: './danh-sach-bao-cao.component.html',
})
export class DanhSachBaoCaoComponent implements OnInit {
    @Output() dataChange = new EventEmitter();

    searchFilter = {
        nam: null,
        tuNgay: null,
        denNgay: null,
        maBaoCao: "",
        donViTao: "",
        trangThai: Status.TT_01,
        maLoaiDan: [3],
    };

    userInfo: any;
    trangThais: any = TRANG_THAI_TIM_KIEM;
    dataTable: any[] = [];
    dataTableAll: any[] = [];
    loaiDuAns: any[] = [
        {
            id: '1',
            tenDm: 'Giao dự toán'
        },
        {
            id: '2',
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
        // this.searchFilter.denNgay = new Date();
        // const newDate = new Date();
        // newDate.setMonth(newDate.getMonth() - 1);
        // this.searchFilter.tuNgay = newDate;
        this.searchFilter.donViTao = this.userInfo?.MA_DVI;
        //check quyen va cac nut chuc nang
        this.statusNewReport = this.userService.isAccessPermisson(Roles.GSTC.LAP_BC);
        this.statusDelete = this.userService.isAccessPermisson(Roles.GSTC.XOA_BC) || this.userService.isAccessPermisson(Roles.GSTC.XOA_BC_TONGHOP);
        if (this.userService.isAccessPermisson(Roles.GSTC.DUYET_TUCHOI_BC) || this.userService.isAccessPermisson(Roles.GSTC.DUYET_TUCHOI_BC_TH)) {
            this.searchFilter.trangThai = Status.TT_02;
        } else {
            if (this.userService.isAccessPermisson(Roles.GSTC.PHEDUYET_TUCHOI_BC) || this.userService.isAccessPermisson(Roles.GSTC.PHEDUYET_TUCHOI_BC_TH)) {
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
        } else {
            trangThais = [Status.TT_01, Status.TT_02, Status.TT_03, Status.TT_04, Status.TT_05, Status.TT_06, Status.TT_07, Status.TT_08, Status.TT_09]
        }
        let requestReport
        if (this.userInfo.CAP_DVI == "3") {
            requestReport = {
                maPa: null,
                maBcao: this.searchFilter.maBaoCao,
                maDvi: this.searchFilter.donViTao,
                namBcao: this.searchFilter.nam,
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
                maPhanGiao: "3",
                maLoai: "2",
                maLoaiDan: [3],
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
        await this.giaoDuToanChiService.timBaoCaoGiao(requestReport).toPromise().then(res => {
            if (res.statusCode == 0) {
                this.dataTable = [];
                res.data.content.forEach(item => {
                    this.dataTable.push({
                        ...item,
                        namBcao: item.namBcao,
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
                console.log(this.dataTableAll);

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
        this.searchFilter.maLoaiDan = [3],
            this.search();
    }

    checkEditStatus(item: any) {
        const isSynthetic = item.tongHopTu != "[]" && item.tongHopTu != null;
        console.log(isSynthetic);

        return Status.check('saveWHist', item.trangThai) &&
            (isSynthetic ? this.userService.isAccessPermisson(Roles.GSTC.SUA_BC_TONGHOP) : this.userService.isAccessPermisson(Roles.GSTC.SUA_BC));
    }

    checkDeleteStatus(item: any) {
        const isSynthetic = item.tongHopTu != "[]" && item.tongHopTu != null;
        return Status.check('saveWHist', item.trangThai) &&
            (isSynthetic ? this.userService.isAccessPermisson(Roles.GSTC.XOA_BC_TONGHOP) : this.userService.isAccessPermisson(Roles.GSTC.XOA_BC));
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
                    tabSelected: 'addBaoCao',
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

