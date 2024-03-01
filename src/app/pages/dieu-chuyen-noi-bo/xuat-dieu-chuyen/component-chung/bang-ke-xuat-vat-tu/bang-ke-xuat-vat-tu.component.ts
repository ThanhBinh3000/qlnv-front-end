import { Component, Input, OnInit } from '@angular/core';
import { Base2Component } from "src/app/components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "src/app/services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { DonviService } from "src/app/services/donvi.service";
import {
    DeXuatPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/DeXuatPhuongAnCuuTro.service";
import dayjs from "dayjs";
import { UserLogin } from "src/app/models/userlogin";
import { MESSAGE } from "src/app/constants/message";
import { chain, isEmpty } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import {
    BangKeCanCtvtService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/BangKeCanCtvt.service";
// import { XuatCuuTroVienTroComponent } from 'src/app/pages/xuat/xuat-cuu-tro-vien-tro/xuat-cuu-tro-vien-tro.component';
import { CHUC_NANG, STATUS } from 'src/app/constants/status';
import { BangKeCanHangDieuChuyenService } from '../services/dcnb-bang-ke-can-hang.service';
import { BangKeXuatVatTuDieuChuyenService } from '../services/dcnb-bang-ke-xuat-vat-tu.service';
export interface PassDataXuatBangKeXuatVatTu {
    soQdinhDcc: string, qdinhDccId: number, ngayKyQdDcc: string, thoiHanDieuChuyen: string, maDiemKho: string, tenDiemKho: string, maNhaKho: string, tenNhaKho: string, maNganKho: string, tenNganKho: string,
    maLoKho: string, tenLoKho: string, soPhieuXuatKho: string, phieuXuatKhoId: number, loaiVthh: string, tenLoaiVthh: string, cloaiVthh: string, tenCloaiVthh: string, diaDaDiemKho: string, tenNguoiGiaoHang: string, cccd: string,
    donViNguoiGiaoHang: string, diaChiDonViNguoiGiaoHang: string, donViTinh: string, thoiGianGiaoNhan: string, keHoachDcDtlId: number
}
export interface MA_QUYEN_BKXVT {
    XEM: string,
    THEM: string,
    XOA: string,
    DUYET_LDCCUC: string,
    EXP: string,
    IN: string
};
@Component({
    selector: 'app-xuat-dcnb-bang-ke-xuat-vat-tu',
    templateUrl: './bang-ke-xuat-vat-tu.component.html',
    styleUrls: ['./bang-ke-xuat-vat-tu.component.scss']
})
export class BangKeXuatVatTuDieuChuyenComponent extends Base2Component implements OnInit {
    @Input() loaiDc: string;
    @Input() isVatTu: boolean;
    @Input() thayDoiThuKho: boolean;
    @Input() type: string;
    @Input() typeQd: string;
    @Input() loaiMaQuyen: string;
    // public vldTrangThai: XuatCuuTroVienTroComponent;
    public CHUC_NANG = CHUC_NANG;
    dsDonvi: any[] = [];
    userInfo: UserLogin;
    userdetail: any = {};
    selectedId: number = 0;
    isView = false;
    expandSetString = new Set<string>();
    dataView: any = [];
    idPhieuXk: number = 0;
    openPhieuXk = false;
    LIST_TRANG_THAI = {
        [this.STATUS.DU_THAO]: "Dự thảo",
        [this.STATUS.CHO_DUYET_LDCC]: "Chờ duyệt LĐ Chi Cục",
        [this.STATUS.TU_CHOI_LDCC]: "Từ chối LĐ Chi Cục",
        [this.STATUS.DA_DUYET_LDCC]: "Đã duyệt LĐ Chi Cục"
    }
    passData: PassDataXuatBangKeXuatVatTu = {
        soQdinhDcc: '', qdinhDccId: null, ngayKyQdDcc: '', thoiHanDieuChuyen: '', maDiemKho: '', tenDiemKho: '', maNhaKho: '', tenNhaKho: '', maNganKho: '', tenNganKho: '',
        maLoKho: '', tenLoKho: '', soPhieuXuatKho: '', phieuXuatKhoId: null, loaiVthh: '', tenLoaiVthh: '', cloaiVthh: '', tenCloaiVthh: '', diaDaDiemKho: '', tenNguoiGiaoHang: '', cccd: '',
        donViNguoiGiaoHang: '', diaChiDonViNguoiGiaoHang: '', donViTinh: '', thoiGianGiaoNhan: '', keHoachDcDtlId: null
    }
    MA_QUYEN: MA_QUYEN_BKXVT = {
        XEM: "",
        THEM: "",
        XOA: "",
        DUYET_LDCCUC: "",
        EXP: "",
        IN: ""
    };
    constructor(
        httpClient: HttpClient,
        storageService: StorageService,
        notification: NzNotificationService,
        spinner: NgxSpinnerService,
        modal: NzModalService,
        private donviService: DonviService,
        private deXuatPhuongAnCuuTroService: DeXuatPhuongAnCuuTroService,
        private bangKeXuatVatTuDieuChuyenService: BangKeXuatVatTuDieuChuyenService
        // private xuatCuuTroVienTroComponent: XuatCuuTroVienTroComponent
    ) {
        super(httpClient, storageService, notification, spinner, modal, bangKeXuatVatTuDieuChuyenService);
        // this.vldTrangThai = xuatCuuTroVienTroComponent;
        this.formData = this.fb.group({
            id: [],
            nam: [],
            soQdinhDcc: [],
            soBangKe: [],
            tuNgay: [],
            denNgay: [],
            maDiemKho: [],
            maNhaKho: [],
            maNganKho: [],
            maLoKho: [],
            tenDiemKho: [],
            tenNhaKho: [],
            tenNganKho: [],
            tenLoKho: [],
            ngayKetThuc: [],
            type: [],
            loaiDc: [],
            isVatTu: [],
            thayDoiThuKho: [],
            typeQd: []
        })
    }


    async ngOnInit() {
        try {
            this.spinner.show();
            this.setMaQuyen();
            await this.initData()
            await this.timKiem();
        } catch (e) {
            console.log('error: ', e)
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
        finally {
            this.spinner.hide()
        }
    }

    setMaQuyen() {
        switch (this.loaiMaQuyen) {
            case 'DCNB_VT_KHACTK':
                this.MA_QUYEN.XEM = 'DCNB_XUAT_NBCC_KHACTK_XK_VT_BKXVT_XEM';
                this.MA_QUYEN.THEM = 'DCNB_XUAT_NBCC_KHACTK_XK_VT_BKXVT_THEM';
                this.MA_QUYEN.XOA = 'DCNB_XUAT_NBCC_KHACTK_XK_VT_BKXVT_XOA';
                this.MA_QUYEN.DUYET_LDCCUC = 'DCNB_XUAT_NBCC_KHACTK_XK_VT_BKXVT_DUYET_LDCCUC';
                this.MA_QUYEN.EXP = 'DCNB_XUAT_NBCC_KHACTK_XK_VT_BKXVT_EXP';
                this.MA_QUYEN.IN = 'DCNB_XUAT_NBCC_KHACTK_XK_VT_BKXVT_IN';
                break;
            case 'DCNB_VT_CUNGTK':
                this.MA_QUYEN.XEM = 'DCNB_XUAT_NBCC_CUNGTK_XK_VT_BKXVT_XEM';
                this.MA_QUYEN.THEM = 'DCNB_XUAT_NBCC_CUNGTK_XK_VT_BKXVT_THEM';
                this.MA_QUYEN.XOA = 'DCNB_XUAT_NBCC_CUNGTK_XK_VT_BKXVT_XOA';
                this.MA_QUYEN.DUYET_LDCCUC = 'DCNB_XUAT_NBCC_CUNGTK_XK_VT_BKXVT_DUYET_LDCCUC';
                this.MA_QUYEN.EXP = 'DCNB_XUAT_NBCC_CUNGTK_XK_VT_BKXVT_EXP';
                this.MA_QUYEN.IN = 'DCNB_XUAT_NBCC_CUNGTK_XK_VT_BKXVT_IN';
                break;
            case 'CHICUC_VT':
                this.MA_QUYEN.XEM = 'DCNB_XUAT_CUNG1CUC_XK_VT_BKXVT_XEM';
                this.MA_QUYEN.THEM = 'DCNB_XUAT_CUNG1CUC_XK_VT_BKXVT_THEM';
                this.MA_QUYEN.XOA = 'DCNB_XUAT_CUNG1CUC_XK_VT_BKXVT_XOA';
                this.MA_QUYEN.DUYET_LDCCUC = 'DCNB_XUAT_CUNG1CUC_XK_VT_BKXVT_DUYET_LDCCUC';
                this.MA_QUYEN.EXP = 'DCNB_XUAT_CUNG1CUC_XK_VT_BKXVT_EXP';
                this.MA_QUYEN.IN = 'DCNB_XUAT_CUNG1CUC_XK_VT_BKXVT_IN';
                break;
            case 'CUC_VT':
                this.MA_QUYEN.XEM = 'DCNB_XUAT_2CUC_XK_VT_BKXVT_XEM';
                this.MA_QUYEN.THEM = 'DCNB_XUAT_2CUC_XK_VT_BKXVT_THEM';
                this.MA_QUYEN.XOA = 'DCNB_XUAT_2CUC_XK_VT_BKXVT_XOA';
                this.MA_QUYEN.DUYET_LDCCUC = 'DCNB_XUAT_2CUC_XK_VT_BKXVT_DUYET_LDCCUC';
                this.MA_QUYEN.EXP = 'DCNB_XUAT_2CUC_XK_VT_BKXVT_EXP';
                this.MA_QUYEN.IN = 'DCNB_XUAT_2CUC_XK_VT_BKXVT_IN';
                break;
            default:
                break;
        }
    }
    async initData() {
        this.userInfo = this.userService.getUserLogin();
        this.userdetail.maDvi = this.userInfo.MA_DVI;
        this.userdetail.tenDvi = this.userInfo.TEN_DVI;
        await this.loadDsTong();
    }

    async loadDsTong() {
        /*const body = {
          maDviCha: this.userdetail.maDvi,
          trangThai: '01',
        };*/
        const dsTong = await this.donviService.layDonViCon();
        if (!isEmpty(dsTong)) {
            this.dsDonvi = dsTong.data;
        }

    }

    isOwner(maDvi: any) {
        return this.userInfo.MA_PHONG_BAN == maDvi;
    }

    isBelong(maDvi: any) {
        return this.userInfo.MA_DVI == maDvi;
    }

    async search(roles?): Promise<void> {
        this.formData.patchValue({
            isVatTu: this.isVatTu,
            loaiDc: this.loaiDc,
            type: this.type,
            thayDoiThuKho: this.thayDoiThuKho,
            typeQd: this.typeQd
        });
        await super.search(roles);
        this.buildTableView();
    }
    resetForm() {
        this.formData.reset();
        this.formData.patchValue({ loaiDc: this.loaiDc, isVatTu: this.isVatTu, thayDoiThuKho: this.thayDoiThuKho, type: this.type, typeQd: this.typeQd })
    }
    clearFilter(): void {
        this.resetForm();
        this.timKiem()
    }
    async timKiem() {
        try {
            const data = this.formData.value;
            const dataTrim = this.trimStringData(data);
            this.formData.patchValue({ ...dataTrim })
            await this.search();
        } catch (error) {
            console.log("error", error)
        }
    };
    trimStringData(obj: any) {
        for (const key in obj) {
            const value = obj[key];
            if (typeof value === 'string' || value instanceof String) {
                obj[key] = value.trim();
            }
        };
        return obj
    }

    buildTableView() {
        const newData = this.dataTable.map(f => ({ ...f, maNganLoKho: f.maLoKho ? `${f.maLoKho}${f.maNganKho}` : f.maNganKho }))
        let dataView = chain(newData)
            .groupBy("soQdinh")
            .map((value, key) => {
                let rs = chain(value)
                    .groupBy("maDiemKho")
                    .map((v, k) => {
                        let rowLv2 = v.find(s => s.maDiemKho === k);
                        let rsx = chain(v).groupBy("maNganLoKho").map((x, ix) => {
                            const rowLv3 = x.find(f => f.maNganLoKho == ix);
                            return {
                                ...rowLv3,
                                idVirtual: uuidv4(),
                                childData: x.filter(f => !!f.phieuXuatKhoId)
                            }
                        }).value();
                        return {
                            ...rowLv2,
                            idVirtual: uuidv4(),
                            childData: rsx
                        }
                    }
                    ).value();
                let rowLv1 = value.find(s => s.soQdinh === key);
                return {
                    ...rowLv1,
                    idVirtual: uuidv4(),
                    childData: rs
                };
            }).value();
        this.dataView = dataView;
        this.expandAll()
    }

    expandAll() {
        this.dataView.forEach(s => {
            this.expandSetString.add(s.idVirtual);
            Array.isArray(s.childData) && s.childData.forEach(element => {
                this.expandSetString.add(element.idVirtual);
            });
        })
    }

    onExpandStringChange(id: string, checked: boolean): void {
        if (checked) {
            this.expandSetString.add(id);
        } else {
            this.expandSetString.delete(id);
        }
    }
    editRow(lv2: any, isView: boolean) {
        this.selectedId = lv2.id;
        this.isDetail = true;
        this.isView = isView;
        this.passData = {
            soQdinhDcc: '', qdinhDccId: null, ngayKyQdDcc: '', thoiHanDieuChuyen: '', maDiemKho: '', tenDiemKho: '', maNhaKho: '', tenNhaKho: '', maNganKho: '', tenNganKho: '',
            maLoKho: '', tenLoKho: '', soPhieuXuatKho: '', phieuXuatKhoId: null, loaiVthh: '', tenLoaiVthh: '', cloaiVthh: '', tenCloaiVthh: '', diaDaDiemKho: '', tenNguoiGiaoHang: '', cccd: '',
            donViNguoiGiaoHang: '', diaChiDonViNguoiGiaoHang: '', donViTinh: '', thoiGianGiaoNhan: '', keHoachDcDtlId: null
        }
    }

    async deleteRow(lv2: any) {
        await this.delete(lv2);
    }

    redirectDetail(data, b: boolean, id) {
        this.selectedId = id;
        this.isDetail = true;
        this.isView = b;
        // this.isViewDetail = isView ?? false;
        this.passData = {
            soQdinhDcc: data.soQdinh, qdinhDccId: data.qdinhDccId, ngayKyQdDcc: data.ngayKyQd, thoiHanDieuChuyen: data.thoiHanDieuChuyen, maDiemKho: data.maDiemKho, tenDiemKho: data.tenDiemKho, maNhaKho: data.maNhaKho, tenNhaKho: data.tenNhaKho, maNganKho: data.maNganKho, tenNganKho: data.tenNganKho,
            maLoKho: data.maLoKho, tenLoKho: data.tenLoKho, soPhieuXuatKho: data.soPhieuXuatKho, phieuXuatKhoId: data.phieuXuatKhoId, loaiVthh: data.maHangHoa, tenLoaiVthh: data.tenHangHoa, cloaiVthh: data.maChLoaiHangHoa, tenCloaiVthh: data.tenChLoaiHangHoa, diaDaDiemKho: '', tenNguoiGiaoHang: data.nguoiGiaoHang, cccd: data.soCmt,
            donViNguoiGiaoHang: data.ctyNguoiGh, diaChiDonViNguoiGiaoHang: data.diaChi, donViTinh: data.donViTinh, thoiGianGiaoNhan: data.thoiGianGiaoNhan, keHoachDcDtlId: data.keHoachDcDtlId
        }
    }

    openPhieuXkModal(id: number) {
        this.idPhieuXk = id;
        this.openPhieuXk = true;
    }

    closePhieuXkModal() {
        this.idPhieuXk = null;
        this.openPhieuXk = false;
    }
    checkRoleAdd(trangThai: string): boolean {
        return this.userService.isAccessPermisson(this.MA_QUYEN.THEM) && this.userService.isChiCuc() && !trangThai
    }
    checkRoleView(trangThai: string): boolean {
        return this.userService.isAccessPermisson(this.MA_QUYEN.XEM) && trangThai && !this.checkRoleEdit(trangThai) && !this.checkRoleDuyet(trangThai) && !this.checkRoleDelete(trangThai)
    }
    checkRoleEdit(trangThai: string): boolean {
        return this.userService.isAccessPermisson(this.MA_QUYEN.THEM) && this.userService.isChiCuc() && (trangThai == STATUS.DU_THAO || trangThai == STATUS.TU_CHOI_LDCC)
    }
    checkRoleDuyet(trangThai: string): boolean {
        return this.userService.isAccessPermisson(this.MA_QUYEN.DUYET_LDCCUC) && this.userService.isChiCuc() && trangThai == STATUS.CHO_DUYET_LDCC
    }
    checkRoleDelete(trangThai: string): boolean {
        return this.userService.isAccessPermisson(this.MA_QUYEN.XOA) && this.userService.isChiCuc() && trangThai == STATUS.DU_THAO
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
}
