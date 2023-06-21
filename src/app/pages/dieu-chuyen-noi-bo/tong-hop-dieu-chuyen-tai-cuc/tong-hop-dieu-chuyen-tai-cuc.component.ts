import { Component, Input, OnInit } from '@angular/core';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import {
    DeXuatPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/DeXuatPhuongAnCuuTro.service";
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { DonviService } from 'src/app/services/donvi.service';
import { isEmpty, cloneDeep } from 'lodash';
import { CHUC_NANG, STATUS } from 'src/app/constants/status';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { TongHopDieuChuyenService } from './tong-hop-dieu-chuyen-tai-cuc.service';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-tong-hop-dieu-chuyen-tai-cuc',
    templateUrl: './tong-hop-dieu-chuyen-tai-cuc.component.html',
    styleUrls: ['./tong-hop-dieu-chuyen-tai-cuc.component.scss']
})
export class TongHopDieuChuyenTaiCuc extends Base2Component implements OnInit {

    @Input()
    loaiVthh: string;
    @Input()
    loaiVthhCache: string;
    @Input()
    viewOnly: boolean;
    formData: FormGroup;
    CHUC_NANG = CHUC_NANG;
    listLoaiHangHoa: any[] = [];
    listHangHoaAll: any[] = [];
    listChungLoaiHangHoa: any[] = [];
    listTrangThai: any[] = [
        { ma: STATUS.DU_THAO, giaTri: 'Dự thảo' },
        { ma: STATUS.CHO_DUYET_TP, giaTri: 'Chờ duyệt - TP' },
        { ma: STATUS.TU_CHOI_TP, giaTri: 'Từ chối - TP' },
        { ma: STATUS.CHO_DUYET_LDC, giaTri: 'Chờ duyệt - LĐ Cục' },
        { ma: STATUS.TU_CHOI_LDC, giaTri: 'Từ chối - LĐ Cục' },
        { ma: STATUS.DA_DUYET_LDC, giaTri: 'Đã duyệt - LĐ Cục' },
        { ma: STATUS.YC_CHICUC_PHANBO_DC, giaTri: "Y/c chi cục xác định điểm nhập" }
    ];
    listLoaiDieuChuyen: any[] = [
        // { value: "ALL", giaTri: "Tất cả" },
        { value: "CHI_CUC", giaTri: "Giữa 2 chi cục trong cùng 1 cục" },
        { value: "CUC", giaTri: "Giữa 2 cục DTNN KV" },
    ];
    LIST_DIEU_CHUYEN = {
        // "ALL": "Tất cả",
        "CHI_CUC": "Giữa 2 chi cục trong cùng 1 cục",
        "CUC": "Giữa 2 cục DTNN KV"
    }
    LIST_TRANG_THAI = {
        [STATUS.DU_THAO]: "Dự thảo",
        [STATUS.CHO_DUYET_TP]: "Chờ duyệt - TP",
        [STATUS.TU_CHOI_TP]: "Từ chối -TP",
        [STATUS.CHO_DUYET_LDC]: "Chờ duyệt - LĐ Cục",
        [STATUS.TU_CHOI_LDC]: "Từ chối - LĐ Cục",
        [STATUS.DA_DUYET_LDC]: "Đã duyệt - LĐ Cục",
        [STATUS.YC_CHICUC_PHANBO_DC]: "Y/c chi cục xác định điểm nhập"
    }
    isViewDetail: boolean = false;
    isAddNew: boolean = false;
    isEdit: boolean = false;

    dataTable: any[];

    listCuc: any[] = [];

    dsDonvi: any[] = [];
    userInfo: UserLogin;
    userdetail: any = {};
    selectedId: number = 0;
    isVatTu: boolean = false;
    isView = false;
    constructor(
        httpClient: HttpClient,
        storageService: StorageService,
        notification: NzNotificationService,
        spinner: NgxSpinnerService,
        modal: NzModalService,
        private tongHopDieuChuyenService: TongHopDieuChuyenService,
        private donviService: DonviService,
        private danhMucService: DanhMucService,
        private deXuatPhuongAnCuuTroService: DeXuatPhuongAnCuuTroService,
    ) {
        super(httpClient, storageService, notification, spinner, modal, tongHopDieuChuyenService);
        this.formData = this.fb.group({
            namKeHoach: [''],
            maDvi: [''],
            id: [''],
            loaiDieuChuyen: [''],
            // ngayTongHop: [''],
            tuNgay: [''],
            denNgay: [''],
            trichYeu: [''],
            trangThai: [''],
        })
        this.filterTable = {
            namKeHoach: '',
            tenDvi: '',
            id: '',
            soDeXuat: '',
            loaiDieuChuyen: '',
            ngayTongHop: '',
            thTuNgay: '',
            thDenNgay: '',
            trichYeu: '',
            trangThai: '',
        };
    }



    disabledTuNgay = (startValue: Date): boolean => {
        if (startValue && this.formData.value.denNgay) {
            return startValue.getTime() > this.formData.value.denNgay.getTime();
        }
        return false;
    };

    disabledDenNgay = (endValue: Date): boolean => {
        if (!endValue || !this.formData.value.tuNgay) {
            return false;
        }
        return endValue.getTime() <= this.formData.value.tuNgay.getTime();
    };

    disabledStartNgayDuyetLdc = (startValue: Date): boolean => {
        if (startValue && this.formData.value.ngayDuyetLdcDen) {
            return startValue.getTime() > this.formData.value.ngayDuyetLdcDen.getTime();
        }
        return false;
    };

    disabledEndNgayDuyetLdc = (endValue: Date): boolean => {
        if (!endValue || !this.formData.value.ngayDuyetLdcTu) {
            return false;
        }
        return endValue.getTime() <= this.formData.value.ngayDuyetLdcDen.getTime();
    };

    async ngOnInit() {
        try {
            if (this.userService.isTongCuc()) {
                this.loadDsCuc()
            }
            await this.initData()
            this.timKiem();
        } catch (e) {
            console.log('error: ', e)
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
        finally {
            this.spinner.hide()
        }
    }

    async initData() {
        this.userInfo = this.userService.getUserLogin();
        this.userdetail.maDvi = this.userInfo.MA_DVI;
        this.userdetail.tenDvi = this.userInfo.TEN_DVI;
    }
    async clearForm() {
        this.formData.reset();
        await this.search()
    }
    async timKiem() {
        // if (this.formData.value.ngayTongHop) {
        //     this.formData.value.tuNgay = dayjs(this.formData.value.ngayTongHop[0]).format('YYYY-MM-DD')
        //     this.formData.value.denNgay = dayjs(this.formData.value.ngayTongHop[1]).format('YYYY-MM-DD')
        // }
        await this.search();
    }
    async loadDsCuc() {
        let body = {
            trangThai: "01",
            maDviCha: this.userInfo.MA_DVI.substring(0, 4),
            type: "DV"
        };
        let res = await this.donviService.getDonViTheoMaCha(body);
        if (res.msg == MESSAGE.SUCCESS) {
            this.listCuc = Array.isArray(res.data) ? res.data : [];
        } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
        }
    }

    redirectDetail(id, b: boolean) {
        this.selectedId = id;
        this.isDetail = true;
        this.isAddNew = b;
        // this.isViewDetail = isView ?? false;
    }
    async showList() {
        this.isDetail = false;
        this.isAddNew = false;
        this.isEdit = false;
        this.isView = false;
        this.isViewDetail = false;
        await this.search();
    };
    checkRoleView(trangThai: string, loaiDieuChuyen: string) {
        return !(this.checkRoleEdit(trangThai, loaiDieuChuyen) || this.checkRoleApproveDc(trangThai) || this.checkRoleDelete(trangThai)) && this.userService.isCuc()
    }
    checkRoleEdit(trangThai: string, loaiDieuChuyen: string) {
        return this.userService.isCuc() && !this.viewOnly && this.userService.isAccessPermisson('DCNB_TONGHOPDC_SUA') && (trangThai == STATUS.DU_THAO || trangThai == STATUS.YC_CHICUC_PHANBO_DC || ((trangThai == STATUS.TU_CHOI_TP || trangThai == STATUS.TU_CHOI_LDC) && loaiDieuChuyen == "CHI_CUC"))
    };
    checkRoleApproveDc(trangThai: string) {
        return this.userService.isCuc() && !this.viewOnly && ((trangThai == STATUS.CHO_DUYET_TP && this.userService.isAccessPermisson('DCNB_TONGHOPDC_DUYET_TP')) || (trangThai == STATUS.CHO_DUYET_LDC && this.userService.isAccessPermisson('DCNB_TONGHOPDC_DUYET_LDCUC')))
    };
    checkRoleDelete(trangThai: string) {
        return this.userService.isCuc() && !this.viewOnly && (!trangThai || trangThai == STATUS.DU_THAO) && this.userService.isAccessPermisson('DCNB_TONGHOPDC_XOA')
    }
    async search(roles?) {
        if (!this.checkPermission(roles)) {
            return
        }
        await this.spinner.show();
        try {
            let body = this.formData.value
            body.paggingReq = {
                limit: this.pageSize,
                page: this.page - 1
            }
            let res = await this.tongHopDieuChuyenService.search(body);
            if (res.msg == MESSAGE.SUCCESS) {
                let data = res.data;
                this.dataTable = data.content;
                this.totalRecord = data.totalElements;
                if (this.dataTable && this.dataTable.length > 0) {
                    this.dataTable.forEach((item) => {
                        item.checked = false;
                    });
                }
                this.dataTableAll = cloneDeep(this.dataTable);
            } else {
                this.dataTable = [];
                this.totalRecord = 0;
                this.notification.error(MESSAGE.ERROR, res.msg);
            }
        } catch (e) {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        } finally {
            await this.spinner.hide();
        }
    }
    viewDetail(id: number, isViewDetail: boolean) {
        this.selectedId = id;
        this.isDetail = true;
        this.isViewDetail = isViewDetail;
        this.isEdit = !isViewDetail;
        this.isAddNew = false;
    };
    xoaItem(item: any) {
        this.delete(item)
    }
    deleteSelect() {
        let dataDelete = [];
        if (this.dataTable && this.dataTable.length > 0) {
            this.dataTable.forEach((item) => {
                if (item.checked) {
                    dataDelete.push(item.id);
                }
            });
        }
        if (dataDelete && dataDelete.length > 0) {
            this.modal.confirm({
                nzClosable: false,
                nzTitle: 'Xác nhận',
                nzContent: 'Bạn có chắc chắn muốn xóa các bản ghi đã chọn?',
                nzOkText: 'Đồng ý',
                nzCancelText: 'Không',
                nzOkDanger: true,
                nzWidth: 310,
                nzOnOk: async () => {
                    this.spinner.show();
                    try {
                        let res = await this.tongHopDieuChuyenService.deleteMuti({ ids: dataDelete });
                        if (res.msg == MESSAGE.SUCCESS) {
                            this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
                            await this.search();
                            this.allChecked = false;
                        } else {
                            this.notification.error(MESSAGE.ERROR, res.msg);
                        }
                        this.spinner.hide();
                    } catch (e) {
                        console.log('error: ', e);
                        this.spinner.hide();
                        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                    }
                },
            });
        }
        else {
            this.notification.error(MESSAGE.ERROR, "Không có dữ liệu phù hợp để xóa.");
        }
    }

}
