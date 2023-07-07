import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { DataService } from 'src/app/services/data.service';
import { GiaoDuToanChiService } from 'src/app/services/quan-ly-von-phi/giaoDuToanChi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { GDT, TRANG_THAI_KIEM_TRA_BAO_CAO, Utils } from 'src/app/Utility/utils';
import { DialogTongHopComponent } from '../dialog-tong-hop/dialog-tong-hop.component';

export const TRANG_THAI_TIM_KIEM_GIAO = [
    {
        id: "7",
        tenDm: "Mới",
    },
    {
        id: "9",
        tenDm: "Tiếp nhận",
    },
    {
        id: "8",
        tenDm: "Từ chối",
    },
    {
        id: "-1",
        tenDm: "Chưa có"
    }

]

@Component({
    selector: 'app-tong-hop-bao-cao-cap-duoi',
    templateUrl: './tong-hop-bao-cao-cap-duoi.component.html',
    styleUrls: ['./tong-hop-bao-cao-cap-duoi.component.scss']
})
export class TongHopBaoCaoCapDuoiComponent implements OnInit {
    @Output() dataChange = new EventEmitter();

    //thong tin dang nhap
    userInfo: any;
    //thong tin tim kiem
    userRole: string;
    maDviTao: string;
    searchFilter = {
        loaiTimKiem: "1",
        maPhanGiao: '2',
        maLoai: '2',
        maLoaiDan: [1, 2],
        namPa: null,
        ngayTaoTu: null,
        ngayTaoDen: null,
        maPa: "",
        donViTao: "",
        // trangThai: "",
        paggingReq: {
            limit: 10,
            page: 1
        },
        trangThais: [],
        // trangThaiGiaos: [],
    };

    filterTable: any = {
        maPaCha: "",
        maPa: "",
        ngayTao: "",
        namPa: "",
        trangThai: "",
    };

    //danh muc
    danhSachBaoCao: any[] = [];
    dataTableAll: any[] = [];

    trangThais: any[] = [];
    donVis: any[] = [];
    //phan trang
    totalElements = 0;
    totalPages = 0;
    pages = {
        size: 10,
        page: 1,
    }
    //trang thai
    status: boolean;
    date: any = new Date()
    trangThai!: string;
    roleUser: string;
    newDate = new Date();
    isCanbotc: boolean;
    isDataAvailable = false;
    statusNewReport = true;
    constructor(
        private quanLyVonPhiService: QuanLyVonPhiService,
        private giaoDuToanChiService: GiaoDuToanChiService,
        private danhMuc: DanhMucHDVService,
        private router: Router,
        private datePipe: DatePipe,
        private notification: NzNotificationService,
        private fb: FormBuilder,
        private spinner: NgxSpinnerService,
        private userService: UserService,
        private dataSource: DataService,
        private modal: NzModalService,
    ) {
    }
    ngOnInit() {
        this.action('init');
    }

    async action(code: string) {
        this.spinner.show();
        this.isDataAvailable = false;
        switch (code) {
            case 'init':
                await this.initialization().then(() => {
                    this.isDataAvailable = true;
                });
                break;
            default:
                break;
        }
        this.spinner.hide();

    }


    async initialization() {
        this.spinner.show()

        this.userInfo = this.userService.getUserLogin();
        this.maDviTao = this.userInfo?.MA_DVI;
        if (this.userService.isAccessPermisson(GDT.TIEPNHAN_TUCHOI_PA_PBDT)) {
            this.isCanbotc = true;
        }

        //lay danh sach danh muc
        await this.danhMuc.dMDonVi().toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.donVis = data.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                }
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        );

        if (this.userService.isAccessPermisson(GDT.TIEP_NHAN_TC_REPORT_TH) || this.userService.isAccessPermisson(GDT.VIEW_REPORT_TH)) {
            this.trangThai = '9';
            this.status = false;
            this.searchFilter.loaiTimKiem = '1';
            this.trangThais.push(TRANG_THAI_TIM_KIEM_GIAO.find(e => e.id == Utils.TT_BC_7));
            this.trangThais.push(TRANG_THAI_TIM_KIEM_GIAO.find(e => e.id == Utils.TT_BC_8));
            this.trangThais.push(TRANG_THAI_TIM_KIEM_GIAO.find(e => e.id == Utils.TT_BC_9));
            this.trangThais.push(TRANG_THAI_TIM_KIEM_GIAO.find(e => e.id == Utils.TT_BC_KT));
        }
        this.onSubmit();
        this.spinner.hide();
    }


    redirectThongTinTimKiem() {
        this.router.navigate([
            '/kehoach/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc',
            0,
        ]);
    }

    redirectSuaThongTinTimKiem(id) {
        this.router.navigate([
            '/kehoach/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc',
            id,
        ]);
    }

    //search list bao cao theo tieu chi
    async onSubmit() {
        if (this.searchFilter.namPa || this.searchFilter.namPa === 0) {
            if (this.searchFilter.namPa >= 3000 || this.searchFilter.namPa < 1000) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
                return;
            }
        }
        const searchFilterTemp = Object.assign({}, this.searchFilter);
        searchFilterTemp.trangThais = [];
        searchFilterTemp.ngayTaoTu = this.datePipe.transform(searchFilterTemp.ngayTaoTu, Utils.FORMAT_DATE_STR) || searchFilterTemp.ngayTaoTu;
        searchFilterTemp.ngayTaoDen = this.datePipe.transform(searchFilterTemp.ngayTaoDen, Utils.FORMAT_DATE_STR) || searchFilterTemp.ngayTaoDen;
        this.spinner.show();
        if (this.trangThai) {
            searchFilterTemp.trangThais.push(this.trangThai)
        } else {
            searchFilterTemp.trangThais = [Utils.TT_BC_7, Utils.TT_BC_8, Utils.TT_BC_9, Utils.TT_BC_KT]
        }
        // searchFilterTemp.trangThaiGiaos = ['0', '1', '2']
        await this.giaoDuToanChiService.timBaoCaoGiao(searchFilterTemp).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.danhSachBaoCao = [];
                    data.data.content.forEach(s => {
                        this.danhSachBaoCao.push({
                            ...s
                        })
                    })
                    this.danhSachBaoCao.forEach(e => {
                        e.ngayTao = this.datePipe.transform(e.ngayTao, Utils.FORMAT_DATE_STR);
                        e.ngayTrinh = this.datePipe.transform(e.ngayTrinh, Utils.FORMAT_DATE_STR);
                        e.ngayDuyet = this.datePipe.transform(e.ngayDuyet, Utils.FORMAT_DATE_STR);
                        e.ngayPheDuyet = this.datePipe.transform(e.ngayPheDuyet, Utils.FORMAT_DATE_STR);
                        e.ngayTraKq = this.datePipe.transform(e.ngayTraKq, Utils.FORMAT_DATE_STR);
                    })
                    this.dataTableAll = cloneDeep(this.danhSachBaoCao);
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
    xoaDieuKien() {
        this.searchFilter.namPa = null
        this.searchFilter.ngayTaoTu = null
        this.searchFilter.ngayTaoDen = null
        this.searchFilter.maPa = null
        this.searchFilter.maLoaiDan = [1, 2]
        this.trangThai = null;
        this.onSubmit();
    }

    xemChiTiet(id: string, maLoaiDan: string) {
        if (maLoaiDan == "1") {
            const obj = {
                id: id,
                tabSelected: 'phuongAnGiaoDuToan',
            }
            this.dataChange.emit(obj);
        } else if (maLoaiDan == "2") {
            const obj = {
                id: id,
                tabSelected: 'phuongAnGiaoDieuChinh',
            }
            this.dataChange.emit(obj);
        } else {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
        }
    }

    getStatusName(trangThai: string) {
        const trangThais = TRANG_THAI_KIEM_TRA_BAO_CAO;
        return trangThais.find(e => e.id == trangThai).ten;
    }

    getUnitName(maDvi: string) {
        return this.donVis.find(e => e.maDvi == maDvi)?.tenDvi;
    }

    filterInTable(key: string, value: string, isDate: boolean) {
        if (value && value != '') {
            this.danhSachBaoCao = [];
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
            this.danhSachBaoCao = [...this.danhSachBaoCao, ...temp];
        } else {
            this.danhSachBaoCao = cloneDeep(this.dataTableAll);
        }
    };

    addNewReport() {
        let obj = {
            maDvi: this.maDviTao
        };
        const modalTuChoi = this.modal.create({
            nzTitle: 'Thông tin tạo mới báo cáo điều chỉnh dự toán chi ngân sách nhà nước',
            nzContent: DialogTongHopComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {
                obj: obj
            },
        });
        modalTuChoi.afterClose.toPromise().then(async (res) => {
            if (res) {
                const obj = {
                    ...res,
                    // id: null,
                    tabSelected: 'addBaoCao',
                    isSynthetic: true,
                }
                this.dataChange.emit(obj);
            }
        });
    }
}
