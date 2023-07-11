import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { CapVonNguonChiService } from 'src/app/services/quan-ly-von-phi/capVonNguonChi.service';
import { UserService } from 'src/app/services/user.service';
import { CVNC, LOAI_DE_NGHI, Utils } from 'src/app/Utility/utils';
import { TRANG_THAI } from '../../de-nghi-cap-von.constant';
import { DialogTaoMoiHopDongComponent } from '../dialog-tao-moi-hop-dong/dialog-tao-moi-hop-dong.component';

@Component({
    selector: 'app-danh-sach-hop-dong',
    templateUrl: './danh-sach-hop-dong.component.html',
    styleUrls: ['../../de-nghi-cap-von.component.scss']
})
export class DanhSachHopDongComponent implements OnInit {
    @Output() dataChange = new EventEmitter();
    //thong tin user
    userInfo: any;
    //thong tin tim kiem
    searchFilter = {
        maDvi: null,
        namHdong: null,
        ngayTaoDen: null,
        ngayTaoTu: null,
        soQdChiTieu: null,
        loaiDnghi: null,
        maHdong: null,
        paggingReq: {
            limit: 10,
            page: 1,
        },
        trangThai: Utils.TT_BC_1,
    }

    // danh sach
    dataTable: any[] = [];
    dataTableAll: any[] = [];
    trangThais: any[] = TRANG_THAI;
    loaiDns: any[] = LOAI_DE_NGHI;
    //phan trang
    totalElements = 0;
    totalPages = 0;

    allChecked = false;
    //trang thai
    statusNewReport = true;
    statusDelete = false;
    disable: boolean;

    constructor(
        private spinner: NgxSpinnerService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        public userService: UserService,
        private capVonNguonChiService: CapVonNguonChiService,
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
        // trang thai cua nut tao moi
        this.statusNewReport = this.userService.isAccessPermisson(CVNC.ADD_DN_MLT) || this.userService.isAccessPermisson(CVNC.ADD_DN_MVT);
        this.statusDelete = this.userService.isAccessPermisson(CVNC.DELETE_DN_MLT) || this.userService.isAccessPermisson(CVNC.DELETE_DN_MVT);

        //neu cos quyen phe duyet thi trang thai mac dinh la trinh duyet
        if (this.userService.isAccessPermisson(CVNC.PHE_DUYET_DN_MLT) || this.userService.isAccessPermisson(CVNC.PHE_DUYET_DN_MVT)) {
            this.searchFilter.trangThai = Utils.TT_BC_2;
        }
        this.loaiDns = this.loaiDns.filter(e => e.id != Utils.MUA_VTU);

        this.search();
        this.spinner.hide();
    }

    async search() {
        const request = JSON.parse(JSON.stringify(this.searchFilter));
        request.maLoai = '1';
        request.loaiTimKiem = '0';
        request.ngayTaoDen = this.datePipe.transform(this.searchFilter.ngayTaoDen, Utils.FORMAT_DATE_STR);
        request.ngayTaoTu = this.datePipe.transform(this.searchFilter.ngayTaoTu, Utils.FORMAT_DATE_STR);
        this.spinner.show();
        await this.capVonNguonChiService.timKiemHopDong(request).toPromise().then(
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
        this.searchFilter.ngayTaoDen = null
        this.searchFilter.ngayTaoTu = null
        this.searchFilter.soQdChiTieu = null
        this.searchFilter.loaiDnghi = null
        this.searchFilter.maHdong = null
        this.searchFilter.namHdong = null
        this.searchFilter.trangThai = null
        this.search();
    }

    checkEditStatus(trangThai: string) {
        return Utils.statusSave.includes(trangThai) &&
            (this.userService.isAccessPermisson(CVNC.EDIT_DN_MLT) || this.userService.isAccessPermisson(CVNC.EDIT_DN_MVT));
    }

    checkDeleteStatus(trangThai: string) {
        return Utils.statusDelete.includes(trangThai) &&
            (this.userService.isAccessPermisson(CVNC.DELETE_DN_MLT) || this.userService.isAccessPermisson(CVNC.DELETE_DN_MVT));
    }

    getStatusName(trangThai: string) {
        return this.trangThais.find(e => e.id == trangThai)?.tenDm;
    }

    //them bao cao moi
    addNewReport() {
        const modalTuChoi = this.modal.create({
            nzTitle: 'Thông tin tạo mới',
            nzContent: DialogTaoMoiHopDongComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {
            },
        });
        modalTuChoi.afterClose.toPromise().then(async (res) => {
            if (res) {
                const obj = {
                    baoCao: res,
                    id: null,
                    tabSelected: res.loaiDnghi == Utils.MUA_VTU ? 'hd-vattu' : 'hd-luongthuc',
                }
                this.dataChange.emit(obj);
            }
        });
    }

    //xem chi tiet bao cao
    viewDetail(data: any) {
        const obj = {
            id: data.id,
            tabSelected: data.loaiDnghi == Utils.MUA_VTU ? 'hd-vattu' : 'hd-luongthuc',
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
                this.capVonNguonChiService.xoaHopDong(request).toPromise().then(
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
        // if (value && value != '') {
        //     this.dataTable = [];
        //     let temp = [];
        //     if (this.dataTableAll && this.dataTableAll.length > 0) {
        //         if (isDate) {
        //             value = this.datePipe.transform(value, Utils.FORMAT_DATE_STR);
        //         }
        //         this.dataTableAll.forEach((item) => {
        //             if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
        //                 temp.push(item)
        //             }
        //         });
        //     }
        //     this.dataTable = [...this.dataTable, ...temp];
        // } else {
        //     this.dataTable = cloneDeep(this.dataTableAll);
        // }
    }

}
