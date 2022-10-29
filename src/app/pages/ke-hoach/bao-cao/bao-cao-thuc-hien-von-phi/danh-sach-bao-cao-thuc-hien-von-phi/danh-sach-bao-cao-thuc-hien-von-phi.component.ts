
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { BaoCaoThucHienVonPhiService } from 'src/app/services/quan-ly-von-phi/baoCaoThucHienVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { BCVP, LBC_KET_QUA_THUC_HIEN_HANG_DTQG, TRANG_THAI_TIM_KIEM, Utils } from 'src/app/Utility/utils';

@Component({
    selector: 'app-danh-sach-bao-cao-thuc-hien-von-phi',
    templateUrl: './danh-sach-bao-cao-thuc-hien-von-phi.component.html',
    styleUrls: ['./danh-sach-bao-cao-thuc-hien-von-phi.component.scss'],
})
export class DanhSachBaoCaoThucHienVonPhiComponent implements OnInit {
    @Output() dataChange = new EventEmitter();

    searchFilter = {
        maPhanBcao: '1',
        maDvi: '',
        ngayTaoTu: '',
        ngayTaoDen: '',
        trangThais: [],
        maBcao: '',
        maLoaiBcao: '1',
        namBcao: null,
        thangBcao: null,
        dotBcao: '',
        paggingReq: {
            limit: 10,
            page: 1
        },
        str: "",
        loaiTimKiem: '0',
    };

    userInfo: any;
    trangThais: any = TRANG_THAI_TIM_KIEM;
    trangThai!: string;
    baoCaos: any = LBC_KET_QUA_THUC_HIEN_HANG_DTQG;
    totalElements = 0;
    totalPages = 0;
    statusNewReport = true;
    statusDelete = true;
    allChecked = false;
    dataTable: any[] = [];
    dataTableAll: any[] = [];

    filterTable: any = {
        soQd: '',
        ngayKy: '',
        namKeHoach: '',
        trichYeu: '',
        tenTrangThai: '',
    };
    constructor(
        private spinner: NgxSpinnerService,
        private baoCaoThucHienVonPhiService: BaoCaoThucHienVonPhiService,
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
        const date = new Date();
        this.searchFilter.ngayTaoDen = date.toDateString();
        this.searchFilter.namBcao = date.getFullYear();
        date.setMonth(date.getMonth() - 1);
        this.searchFilter.ngayTaoTu = date.toDateString();
        //check quyen va cac nut chuc nang
        this.statusNewReport = this.userService.isAccessPermisson(BCVP.ADD_REPORT);
        this.statusDelete = this.userService.isAccessPermisson(BCVP.DELETE_REPORT) || this.userService.isAccessPermisson(BCVP.DELETE_SYNTHETIC_REPORT);
        if (this.userService.isAccessPermisson(BCVP.ADD_REPORT)) {
            this.trangThai = Utils.TT_BC_1;
        } else if (this.userService.isAccessPermisson(BCVP.DUYET_REPORT) || this.userService.isAccessPermisson(BCVP.DUYET_SYNTHETIC_REPORT)) {
            this.trangThai = Utils.TT_BC_2;
        } else if (this.userService.isAccessPermisson(BCVP.PHE_DUYET_REPORT) || this.userService.isAccessPermisson(BCVP.PHE_DUYET_SYNTHETIC_REPORT)) {
            this.trangThai = Utils.TT_BC_4;
        }
        this.search();
        this.spinner.hide();
    }

    async search() {
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
        await this.baoCaoThucHienVonPhiService.timBaoCao(searchFilterTemp).toPromise().then(res => {
            if (res.statusCode == 0) {
                this.dataTable = [];
                res.data.content.forEach(item => {
                    this.dataTable.push({
                        ...item,
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
        this.searchFilter.maBcao = null
        this.searchFilter.namBcao = null
        this.searchFilter.dotBcao = null
        this.searchFilter.ngayTaoTu = null
        this.searchFilter.ngayTaoDen = null
        this.searchFilter.maLoaiBcao = null
        this.trangThai = null
        this.search();
    }

    checkEditStatus(item: any) {
        const isSynthetic = item.tongHopTu != "[]";
        return Utils.statusSave.includes(item.trangThai) &&
            (isSynthetic ? this.userService.isAccessPermisson(BCVP.EDIT_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(BCVP.EDIT_REPORT));
    }

    checkDeleteStatus(item: any) {
        const isSynthetic = item.tongHopTu != "[]";
        return Utils.statusDelete.includes(item.trangThai) &&
            (isSynthetic ? this.userService.isAccessPermisson(BCVP.DELETE_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(BCVP.DELETE_REPORT));
    }

    getStatusName(trangThai: string) {
        return this.trangThais.find(e => e.id == trangThai)?.tenDm;
    }

    //them moi bao cao
    addNewReport() {
        // const modalTuChoi = this.modal.create({
        // 	nzTitle: 'Thông tin tạo mới báo cáo thực hiện dự toán chi NSNN',
        // 	nzContent: DialogTaoMoiComponent,
        // 	nzMaskClosable: false,
        // 	nzClosable: false,
        // 	nzWidth: '900px',
        // 	nzFooter: null,
        // 	nzComponentParams: {
        // 	},
        // });
        // modalTuChoi.afterClose.toPromise().then(async (res) => {
        // 	if (res) {
        // 		const obj = {
        // 			...res,
        // 			id: null,
        // 			tabSelected: 'baocao',
        // 			isSynthetic: false,
        // 		}
        // 		this.dataChange.emit(obj);
        // 	}
        // });
    }

    //xem chi tiet bao cao
    viewDetail(data: any) {
        const obj = {
            id: data.id,
            tabSelected: 'baocao',
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
