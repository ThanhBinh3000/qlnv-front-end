import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Roles, Status, Utils } from 'src/app/Utility/utils';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { GiaoDuToanChiService } from 'src/app/services/quan-ly-von-phi/giaoDuToanChi.service';
import { UserService } from 'src/app/services/user.service';
import { DialogTongHopComponent } from '../dialog-tong-hop/dialog-tong-hop.component';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';

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
        maPhanGiao: '3',
        maLoai: '2',
        maLoaiDan: [3],
        namPa: null,
        ngayTaoTu: null,
        ngayTaoDen: null,
        maBcao: "",
        donViTao: "",
        paggingReq: {
            limit: 10,
            page: 1
        },
        trangThais: [],
    };

    filterTable: any = {
        maBcao: "",
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
        private giaoDuToanChiService: GiaoDuToanChiService,
        private danhMuc: DanhMucHDVService,
        private router: Router,
        private datePipe: DatePipe,
        private notification: NzNotificationService,
        private spinner: NgxSpinnerService,
        private userService: UserService,
        private modal: NzModalService,
        private quanLyVonPhiService: QuanLyVonPhiService,
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

        this.userInfo = await this.userService.getUserLogin();
        this.maDviTao = this.userInfo?.MA_DVI;
        if (this.userService.isAccessPermisson(Roles.GSTC.TIEPNHAN_TUCHOI_BC)) {
            this.isCanbotc = true;
        }
        await this.getChildUnit()

        if (this.userService.isAccessPermisson(Roles.GSTC.TIEPNHAN_TUCHOI_BC) || this.userService.isAccessPermisson(Roles.GSTC.XEM_BC_TONGHOP)) {
            this.trangThai = '9';
            this.status = false;
            this.searchFilter.loaiTimKiem = '1';
            this.trangThais.push(TRANG_THAI_TIM_KIEM_GIAO.find(e => e.id == Status.TT_07));
            this.trangThais.push(TRANG_THAI_TIM_KIEM_GIAO.find(e => e.id == Status.TT_08));
            this.trangThais.push(TRANG_THAI_TIM_KIEM_GIAO.find(e => e.id == Status.TT_09));
            this.trangThais.push(TRANG_THAI_TIM_KIEM_GIAO.find(e => e.id == Status.TT_KT));
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

    async getChildUnit() {
        const request = {
            maDviCha: this.maDviTao,
            trangThai: '01',
        }
        await this.quanLyVonPhiService.dmDviCon(request).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.donVis = data?.data;
                    // this.capDvi = this.dataInfo?.capDvi;

                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        )
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
            searchFilterTemp.trangThais = [Status.TT_07, Status.TT_08, Status.TT_09, Status.TT_KT]
        }
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
        this.searchFilter.maBcao = null
        this.trangThai = null;
        this.searchFilter.maLoaiDan = [3];
        this.onSubmit();
    }

    xemChiTiet(id: string, maLoaiDan: string) {
        const obj = {
            id: id,
            tabSelected: 'addBaoCao',
        }
        this.dataChange.emit(obj);
    }

    getStatusName(trangThai: string) {
        const trangThais = TRANG_THAI_TIM_KIEM_GIAO;
        return trangThais.find(e => e.id == trangThai).tenDm;
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
                    tabSelected: 'addBaoCao',
                    isSynthetic: true,
                }
                this.dataChange.emit(obj);
            }
        });
    }
}
