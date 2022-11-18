import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { CapVonNguonChiService } from 'src/app/services/quan-ly-von-phi/capVonNguonChi.service';
import { UserService } from 'src/app/services/user.service';
import { CAN_CU_GIA, CVNC, LOAI_DE_NGHI, Utils } from 'src/app/Utility/utils';
import { DialogTaoMoiDeNghiComponent } from '../dialog-tao-moi-de-nghi/dialog-tao-moi-de-nghi.component';

@Component({
    selector: 'app-danh-sach-de-nghi-cap-von',
    templateUrl: './danh-sach-de-nghi-cap-von.component.html',
    styleUrls: ['./danh-sach-de-nghi-cap-von.component.scss']
})
export class DanhSachDeNghiCapVonComponent implements OnInit {
    @Output() dataChange = new EventEmitter();

    //thong tin user
    userInfo: any;
    //thong tin tim kiem
    searchFilter = {
        maDn: null,
        trangThai: Utils.TT_BC_1,
        tuNgay: null,
        denNgay: null,
        qdChiTieu: "",
        canCuGia: "",
        loaiDn: "",
        maDviTao: "",
        loaiTimKiem: "0",
    }

    tableFilter = {
        maDn: null,
        qdChiTieu: null,
        canCuGia: null,
        loaiDn: null,
        ngayTao: null,
        ngayTrinh: null,
        ngayPheDuyet: null,
        trangThai: null,
    }

    listIdDelete: string[] = [];
    // danh sach
    dataTable: any[] = [];
    dataTableAll: any[] = [];
    trangThais: any[] = [
        {
            id: Utils.TT_BC_1,
            tenDm: "Đang soạn",
        },
        {
            id: Utils.TT_BC_2,
            tenDm: "Trình duyệt",
        },
        {
            id: Utils.TT_BC_5,
            tenDm: "Lãnh đạo từ chối",
        },
        {
            id: Utils.TT_BC_7,
            tenDm: "Lãnh đạo phê duyệt",
        },
    ];
    loaiDns: any[] = LOAI_DE_NGHI;
    canCuGias: any[] = CAN_CU_GIA;
    //phan trang
    totalElements = 0;
    totalPages = 0;
    pages = {
        size: 10,
        page: 1,
    }
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
        this.searchFilter.denNgay = new Date();
        const newDate = new Date();
        newDate.setMonth(newDate.getMonth() - 1);
        this.searchFilter.tuNgay = newDate;

        this.searchFilter.maDviTao = this.userInfo?.MA_DVI;
        // trang thai cua nut tao moi
        this.statusNewReport = this.userService.isAccessPermisson(CVNC.ADD_DN_MLT) || this.userService.isAccessPermisson(CVNC.ADD_DN_MVT);
        this.statusDelete = this.userService.isAccessPermisson(CVNC.DELETE_DN_MLT) || this.userService.isAccessPermisson(CVNC.DELETE_DN_MVT);

        //neu cos quyen phe duyet thi trang thai mac dinh la trinh duyet
        if (this.userService.isAccessPermisson(CVNC.PHE_DUYET_DN_MLT) || this.userService.isAccessPermisson(CVNC.PHE_DUYET_DN_MVT)) {
            this.searchFilter.trangThai = Utils.TT_BC_2;
        }
        if (this.userService.isTongCuc()) {
            this.canCuGias = this.canCuGias.filter(e => e.id == Utils.HD_TRUNG_THAU);
            this.loaiDns = this.loaiDns.filter(e => e.id == Utils.MUA_VTU);
            this.searchFilter.canCuGia = Utils.HD_TRUNG_THAU;
            this.searchFilter.loaiDn = Utils.MUA_VTU;
            this.disable = true;
        } else {
            this.loaiDns = this.loaiDns.filter(e => e.id != Utils.MUA_VTU);
            this.disable = false;
        }

        this.search();
        this.spinner.hide();
    }

    async search() {
        let trangThais = [];
        if (this.searchFilter.trangThai) {
            trangThais = [this.searchFilter.trangThai];
        }
        const requestReport = {
            loaiTimKiem: this.searchFilter.loaiTimKiem,
            // maDvi: this.searchFilter.maDviTao,
            ngayTaoDen: this.datePipe.transform(this.searchFilter.denNgay, Utils.FORMAT_DATE_STR),
            ngayTaoTu: this.datePipe.transform(this.searchFilter.tuNgay, Utils.FORMAT_DATE_STR),
            soQdChiTieu: this.searchFilter.qdChiTieu,
            canCuVeGia: this.searchFilter.canCuGia,
            loaiDnghi: this.searchFilter.loaiDn,
            maDnghi: this.searchFilter.maDn,
            paggingReq: {
                limit: this.pages.size,
                page: this.pages.page,
            },
            trangThais: trangThais,
        };
        this.spinner.show();
        await this.capVonNguonChiService.timKiemDeNghi(requestReport).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.dataTable = [];
                    data.data.content.forEach(item => {
                        this.dataTable.push({
                            ...item,
                            ngayTao: this.datePipe.transform(item.ngayTao, Utils.FORMAT_DATE_STR),
                            ngayTrinh: this.datePipe.transform(item.ngayTrinh, Utils.FORMAT_DATE_STR),
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
        this.searchFilter.maDn = null
        this.searchFilter.trangThai = null
        this.searchFilter.tuNgay = null
        this.searchFilter.denNgay = null
        this.searchFilter.qdChiTieu = null
        if (!this.disable) {
            this.searchFilter.canCuGia = null
            this.searchFilter.loaiDn = null
        }
        this.search();
    }

    checkEditStatus(trangThai: string) {
        return Utils.statusSave.includes(trangThai) &&
            ((this.userInfo?.CAP_DVI == '2' && this.userService.isAccessPermisson(CVNC.EDIT_DN_MLT)) || (this.userInfo.CAP_DVI == '1' && this.userService.isAccessPermisson(CVNC.EDIT_DN_MVT)));
    }

    checkDeleteStatus(trangThai: string) {
        return Utils.statusDelete.includes(trangThai) &&
            ((this.userInfo?.CAP_DVI == '2' && this.userService.isAccessPermisson(CVNC.DELETE_DN_MLT)) || (this.userInfo.CAP_DVI == '1' && this.userService.isAccessPermisson(CVNC.DELETE_DN_MVT)));
    }

    getStatusName(trangThai: string) {
        return this.trangThais.find(e => e.id == trangThai)?.tenDm;
    }

    //them bao cao moi
    addNewReport() {
        const modalTuChoi = this.modal.create({
            nzTitle: 'Thông tin tạo mới đề nghị',
            nzContent: DialogTaoMoiDeNghiComponent,
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
                    id: null,
                    namDn: res.namDn,
                    qdChiTieu: res.qdChiTieu,
                    loaiDn: res.loaiDn,
                    tabSelected: res.canCuGia == Utils.HD_TRUNG_THAU ? 'hopdong' : 'dongia',
                    hopDong: res.hopDong,
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
                this.capVonNguonChiService.xoaDeNghi(request).toPromise().then(
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
