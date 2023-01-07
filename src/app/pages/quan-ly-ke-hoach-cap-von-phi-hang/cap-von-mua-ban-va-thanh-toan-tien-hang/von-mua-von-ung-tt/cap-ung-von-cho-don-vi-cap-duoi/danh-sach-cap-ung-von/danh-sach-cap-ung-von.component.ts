import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { CapVonMuaBanTtthService } from 'src/app/services/quan-ly-von-phi/capVonMuaBanTtth.service';
import { UserService } from 'src/app/services/user.service';
import { CVMB, LOAI_DE_NGHI, Utils } from 'src/app/Utility/utils';
import { TRANG_THAI } from '../../../cap-von-mua-ban-va-thanh-toan-tien-hang.constant';

@Component({
    selector: 'app-danh-sach-cap-ung-von',
    templateUrl: './danh-sach-cap-ung-von.component.html',
    styleUrls: ['../../von-mua-von-ung.component.scss']
})
export class DanhSachCapUngVonComponent implements OnInit {
    @Output() dataChange = new EventEmitter();

    //thong tin user
    userInfo: any;
    //thong tin tim kiem
    searchFilter = {
        maDnghi: null,
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

    // danh sach
    dataTable: any[] = [];
    dataTableAll: any[] = [];
    trangThais: any[] = TRANG_THAI;
    loaiDns: any[] = LOAI_DE_NGHI;
    //phan trang
    totalElements = 0;
    totalPages = 0;
    allChecked = false;
    statusNewReport = false;
    statusDelete = false;

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
        this.statusNewReport = this.userService.isAccessPermisson(CVMB.ADD_REPORT_CV);
        this.statusDelete = this.userService.isAccessPermisson(CVMB.DELETE_REPORT_CV);
        //neu co quyen phe duyet thi trang thai mac dinh la trinh duyet
        if (this.userService.isAccessPermisson(CVMB.DUYET_REPORT_GNV)) {
            this.searchFilter.trangThai = Utils.TT_BC_2;
        } else {
            if (this.userService.isAccessPermisson(CVMB.PHE_DUYET_REPORT_GNV)) {
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
                            ngayTao: this.datePipe.transform(item.ngayTao, Utils.FORMAT_DATE_STR),
                            ngayTrinh: this.datePipe.transform(item.ngayTrinh, Utils.FORMAT_DATE_STR),
                            ngayDuyet: this.datePipe.transform(item.ngayDuyet, Utils.FORMAT_DATE_STR),
                            ngayPheDuyet: this.datePipe.transform(item.ngayPheDuyet, Utils.FORMAT_DATE_STR),
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
        this.searchFilter.maDnghi = null
        this.searchFilter.trangThai = null
        this.searchFilter.ngayTaoTu = null
        this.searchFilter.ngayTaoDen = null
        this.searchFilter.namBcao = null
        this.searchFilter.loaiDnghi = null
        this.search();
    }

    checkEditStatus(trangThai: string) {
        return Utils.statusSave.includes(trangThai) && this.userService.isAccessPermisson(CVMB.EDIT_REPORT_GNV);
    }

    checkDeleteStatus(trangThai: string) {
        return Utils.statusDelete.includes(trangThai) && this.userService.isAccessPermisson(CVMB.DELETE_REPORT_GNV);
    }

    getStatusName(trangThai: string) {
        return this.trangThais.find(e => e.id == trangThai)?.tenDm;
    }

    addNewReport() {
        // const newData = {
        //     tab: 'gnv',
        // }
        // const modalTuChoi = this.modal.create({
        //     nzTitle: 'Thông tin tạo mới',
        //     nzContent: DialogTaoMoiComponent,
        //     nzMaskClosable: false,
        //     nzClosable: false,
        //     nzWidth: '900px',
        //     nzFooter: null,
        //     nzComponentParams: {
        //         obj: newData
        //     },
        // });
        // modalTuChoi.afterClose.toPromise().then(async (res) => {
        //     if (res) {
        //         const obj = {
        //             ...res,
        //             id: null,
        //             tabSelected: 'bc-gnv',
        //         }
        //         this.dataChange.emit(obj);
        //     }
        // });
    }

    //xem chi tiet bao cao
    viewDetail(data: any) {
        const obj = {
            id: data.id,
            tabSelected: 'bc-gnv',
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
