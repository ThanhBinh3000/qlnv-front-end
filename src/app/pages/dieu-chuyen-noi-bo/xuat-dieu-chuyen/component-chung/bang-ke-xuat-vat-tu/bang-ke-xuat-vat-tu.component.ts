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
    donViNguoiGiaoHang: string, diaChiDonViNguoiGiaoHang: string, donViTinh: string, tenDonViTinh: string, thoiGianGiaoNhan: string
}
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
        donViNguoiGiaoHang: '', diaChiDonViNguoiGiaoHang: '', donViTinh: '', tenDonViTinh: '', thoiGianGiaoNhan: ''
    }
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
            thayDoiThuKho: []
        })
    }


    async ngOnInit() {
        try {
            this.initData()
            await this.timKiem();
        } catch (e) {
            console.log('error: ', e)
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
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
        await this.spinner.show()
        this.formData.patchValue({
            isVatTu: this.isVatTu,
            loaiDc: this.loaiDc,
            type: this.type,
            thayDoiThuKho: this.thayDoiThuKho
        });
        await super.search(roles);
        this.buildTableView();
        await this.spinner.hide()
    }
    resetForm() {
        this.formData.reset();
        this.formData.patchValue({ loaiDc: this.loaiDc, isVatTu: this.isVatTu, thayDoiThuKho: this.thayDoiThuKho, type: this.type })
    }
    clearForm(): void {
        this.resetForm();
        this.timKiem()
    }
    async timKiem() {
        await this.spinner.show();
        try {
            if (this.formData.value.ngayDx) {
                this.formData.value.ngayDxTu = dayjs(this.formData.value.ngayDx[0]).format('YYYY-MM-DD')
                this.formData.value.ngayDxDen = dayjs(this.formData.value.ngayDx[1]).format('YYYY-MM-DD')
            }
            if (this.formData.value.ngayKetThuc) {
                this.formData.value.ngayKetThucTu = dayjs(this.formData.value.ngayKetThuc[0]).format('YYYY-MM-DD')
                this.formData.value.ngayKetThucDen = dayjs(this.formData.value.ngayKetThuc[1]).format('YYYY-MM-DD')
            }
            await this.search();
        } catch (e) {
            console.log(e)
        } finally {
            await this.spinner.hide();
        }
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
        console.log("dataView", dataView)
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
            donViNguoiGiaoHang: '', diaChiDonViNguoiGiaoHang: '', donViTinh: '', tenDonViTinh: '', thoiGianGiaoNhan: ''
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
            donViNguoiGiaoHang: data.ctyNguoiGh, diaChiDonViNguoiGiaoHang: data.diaChi, donViTinh: data.donViTinh, tenDonViTinh: data.tenDonViTinh, thoiGianGiaoNhan: data.thoiGianGiaoNhan
        }
    }

    openPhieuXkModal(id: number) {
        console.log(id, 'id');
        this.idPhieuXk = id;
        this.openPhieuXk = true;
    }

    closePhieuXkModal() {
        this.idPhieuXk = null;
        this.openPhieuXk = false;
    }
    checkRoleAdd(trangThai: string): boolean {
        return this.userService.isChiCuc()
    }
    checkRoleView(trangThai: string): boolean {
        return trangThai && !this.checkRoleEdit(trangThai) && !this.checkRoleDuyet(trangThai) && !this.checkRoleDelete(trangThai)
    }
    checkRoleEdit(trangThai: string): boolean {
        return this.userService.isChiCuc() && (trangThai == STATUS.DU_THAO || trangThai == STATUS.TU_CHOI_LDCC)
    }
    checkRoleDuyet(trangThai: string): boolean {
        return this.userService.isChiCuc() && trangThai == STATUS.CHO_DUYET_LDCC
    }
    checkRoleDelete(trangThai: string): boolean {
        return this.userService.isChiCuc() && trangThai == STATUS.DU_THAO
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
