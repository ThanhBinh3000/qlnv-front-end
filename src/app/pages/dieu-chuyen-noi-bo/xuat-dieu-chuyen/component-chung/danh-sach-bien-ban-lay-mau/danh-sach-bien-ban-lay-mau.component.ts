import { STATUS } from 'src/app/constants/status';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import dayjs from 'dayjs';
import { chain, cloneDeep, groupBy } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { MESSAGE } from 'src/app/constants/message';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { BienBanLayMauDieuChuyenService } from '../services/dcnb-bien-ban-lay-mau.service';

export interface PassData {
    idBbLayMau: number, qddccId: number, soQdinhDcc: string, maLoKho: string, tenLoKho: string, maNganKho: string, tenNganKho: string, maNhaKho: string,
    tenNhaKho: string, maDiemKho: string, tenDiemKho: string, loaiVthh: string, tenLoaiVthh: string, cloaiVthh: string, tenCloaiVthh: string, thuKho: number, tenThuKho: string, donViTinh: string,
    keHoachDcDtlId: number
}
export interface MA_QUYEN_BBLM {
    XEM: string,
    THEM: string,
    XOA: string,
    DUYET_LDCCUC: string,
    EXP: string,
    IN: string
}
@Component({
    selector: 'app-danh-sach-bien-ban-lay-mau',
    templateUrl: './danh-sach-bien-ban-lay-mau.component.html',
    styleUrls: ['./danh-sach-bien-ban-lay-mau.component.scss'],
})
export class DanhSachBienBanLayMau extends Base2Component implements OnInit {
    @Input() title: string = "Danh sách biên bản lấy mẫu/bàn giao mẫu";
    @Input() fileNameExport: string = "file.xlsx";
    @Input() loaiDc: string;
    @Input() isVatTu: boolean;
    @Input() thayDoiThuKho: boolean;
    @Input() type: string;
    @Input() typeQd: string;
    @Input() loaiMaQuyen: string;
    // @Output() checkPermissonDelete = new EventEmitter<boolean>();
    // @Output() checkPermissonExport = new EventEmitter<boolean>();
    // @Output() checkPermissonAdd = new EventEmitter<boolean>();
    isDetail: boolean = false;
    isAddNew: boolean = false;
    isView: boolean = false;
    idBbLayMau: number;
    isEdit: boolean = false;
    selectedId: number | null;
    list: any[] = [];
    expandSetString = new Set<string>();
    dataView: any[];
    isViewQdDc: boolean = false;
    qddccId: number;

    page: number = 1;
    pageSize: number = PAGE_SIZE_DEFAULT;
    totalRecord: number = 0;
    dataTable: any[];
    passData: PassData = {
        idBbLayMau: null, qddccId: null, soQdinhDcc: '', maLoKho: '', tenLoKho: '', maNganKho: '', tenNganKho: '', maNhaKho: '', tenNhaKho: '', maDiemKho: '',
        tenDiemKho: '', loaiVthh: '', tenLoaiVthh: '', cloaiVthh: '', tenCloaiVthh: '', thuKho: null, tenThuKho: '', donViTinh: '', keHoachDcDtlId: null
    }
    LIST_TRANG_THAI: { [key: string]: string } = {
        [STATUS.DU_THAO]: "Dự thảo",
        [STATUS.CHO_DUYET_LDCC]: "Chờ duyệt LĐ Chi Cục",
        [STATUS.TU_CHOI_LDCC]: "Từ chối LĐ Chi Cục",
        [STATUS.DA_DUYET_LDCC]: "Đã duyệt LĐ Chi Cục"
    };
    MA_QUYEN = {
        XEM: "",
        THEM: "",
        XOA: "",
        DUYET_LDCCUC: "",
        EXP: "",
        IN: ""
    };
    constructor(httpClient: HttpClient,
        storageService: StorageService,
        notification: NzNotificationService,
        spinner: NgxSpinnerService,
        modal: NzModalService,
        private bienBanLayMauDieuChuyenService: BienBanLayMauDieuChuyenService,
        private cdr: ChangeDetectorRef,) {
        super(httpClient, storageService, notification, spinner, modal, bienBanLayMauDieuChuyenService);
        this.formData = this.fb.group({
            nam: [null],
            soBbLayMau: [null],
            soQdinhDcc: [null],
            dviKiemNghiem: [null],
            ngayLayMau: [null],
            tuNgay: [null],
            denNgay: [null],
            // trangThai: [STATUS.BAN_HANH],
            loaiDc: [],
            isVatTu: [false],
            thayDoiThuKho: [false],
            type: [],
            typeQd: []
        })
        this.filterTable = {
            nam: '',
            soBbLayMau: '',
            soQdinhDcc: '',
            ngayTao: '',
            tenLoaiVthh: '',
            tenCloaiVthh: '',
            thoiHanDieuChuyen: '',
            trichYeu: '',
            bbTinhKho: '',
            bbHaoDoi: '',
            trangThai: '',
        };
        switch (this.loaiMaQuyen) {
            case 'DCNB_LT_KHACTK':
                this.MA_QUYEN.XEM = 'DCNB_XUAT_NBCC_KHACTK_KTCL_LT_BBLM_XEM';
                this.MA_QUYEN.THEM = 'DCNB_XUAT_NBCC_KHACTK_KTCL_LT_BBLM_THEM';
                this.MA_QUYEN.XOA = 'DCNB_XUAT_NBCC_KHACTK_KTCL_LT_BBLM_XOA';
                this.MA_QUYEN.DUYET_LDCCUC = 'DCNB_XUAT_NBCC_KHACTK_KTCL_LT_BBLM_DUYET_LDCCUC';
                this.MA_QUYEN.EXP = 'DCNB_XUAT_NBCC_KHACTK_KTCL_LT_BBLM_EXP';
                this.MA_QUYEN.IN = 'DCNB_XUAT_NBCC_KHACTK_KTCL_LT_BBLM_IN';
                break;
            case 'DCNB_VT_KHACTK':
                this.MA_QUYEN.XEM = 'DCNB_XUAT_NBCC_KHACTK_KTCL_VT_BBLM_XEM';
                this.MA_QUYEN.THEM = 'DCNB_XUAT_NBCC_KHACTK_KTCL_VT_BBLM_THEM';
                this.MA_QUYEN.XOA = 'DCNB_XUAT_NBCC_KHACTK_KTCL_VT_BBLM_XOA';
                this.MA_QUYEN.DUYET_LDCCUC = 'DCNB_XUAT_NBCC_KHACTK_KTCL_VT_BBLM_DUYET_LDCCUC';
                this.MA_QUYEN.EXP = 'DCNB_XUAT_NBCC_KHACTK_KTCL_VT_BBLM_EXP';
                this.MA_QUYEN.IN = 'DCNB_XUAT_NBCC_KHACTK_KTCL_VT_BBLM_IN';
                break;
            case 'CHICUC_LT':
                this.MA_QUYEN.XEM = 'DCNB_XUAT_CUNG1CUC_KTCL_LT_BBLM_XEM';
                this.MA_QUYEN.THEM = 'DCNB_XUAT_CUNG1CUC_KTCL_LT_BBLM_THEM';
                this.MA_QUYEN.XOA = 'DCNB_XUAT_CUNG1CUC_KTCL_LT_BBLM_XOA';
                this.MA_QUYEN.DUYET_LDCCUC = 'DCNB_XUAT_CUNG1CUC_KTCL_LT_BBLM_DUYET_LDCCUC';
                this.MA_QUYEN.EXP = 'DCNB_XUAT_CUNG1CUC_KTCL_LT_BBLM_EXP';
                this.MA_QUYEN.IN = 'DCNB_XUAT_CUNG1CUC_KTCL_LT_BBLM_IN';
                break;
            case 'CHICUC_VT':
                this.MA_QUYEN.XEM = 'DCNB_XUAT_CUNG1CUC_KTCL_VT_BBLM_XEM';
                this.MA_QUYEN.THEM = 'DCNB_XUAT_CUNG1CUC_KTCL_VT_BBLM_THEM';
                this.MA_QUYEN.XOA = 'DCNB_XUAT_CUNG1CUC_KTCL_VT_BBLM_XOA';
                this.MA_QUYEN.DUYET_LDCCUC = 'DCNB_XUAT_CUNG1CUC_KTCL_VT_BBLM_DUYET_LDCCUC';
                this.MA_QUYEN.EXP = 'DCNB_XUAT_CUNG1CUC_KTCL_VT_BBLM_EXP';
                this.MA_QUYEN.IN = 'DCNB_XUAT_CUNG1CUC_KTCL_VT_BBLM_IN';
                break;
            case 'CUC_LT':
                this.MA_QUYEN.XEM = 'DCNB_XUAT_2CUC_KTCL_LT_BBLM_XEM';
                this.MA_QUYEN.THEM = 'DCNB_XUAT_2CUC_KTCL_LT_BBLM_THEM';
                this.MA_QUYEN.XOA = 'DCNB_XUAT_2CUC_KTCL_LT_BBLM_XOA';
                this.MA_QUYEN.DUYET_LDCCUC = 'DCNB_XUAT_2CUC_KTCL_LT_BBLM_DUYET_LDCCUC';
                this.MA_QUYEN.EXP = 'DCNB_XUAT_2CUC_KTCL_LT_BBLM_EXP';
                this.MA_QUYEN.IN = 'DCNB_XUAT_2CUC_KTCL_LT_BBLM_IN';
                break;
            case 'CUC_VT':
                this.MA_QUYEN.XEM = 'DCNB_XUAT_2CUC_KTCL_VT_BBLM_XEM';
                this.MA_QUYEN.THEM = 'DCNB_XUAT_2CUC_KTCL_VT_BBLM_THEM';
                this.MA_QUYEN.XOA = 'DCNB_XUAT_2CUC_KTCL_VT_BBLM_XOA';
                this.MA_QUYEN.DUYET_LDCCUC = 'DCNB_XUAT_2CUC_KTCL_VT_BBLM_DUYET_LDCCUC';
                this.MA_QUYEN.EXP = 'DCNB_XUAT_2CUC_KTCL_VT_BBLM_EXP';
                this.MA_QUYEN.IN = 'DCNB_XUAT_2CUC_KTCL_VT_BBLM_IN';
                break;
            default:
                break;
        }
    }

    async ngOnInit(): Promise<void> {
        try {
            this.spinner.show();
            this.formData.patchValue({ loaiDc: this.loaiDc, isVatTu: this.isVatTu, thayDoiThuKho: this.thayDoiThuKho, type: this.type, typeQd: this.typeQd });
            await this.timKiem()
        } catch (error) {
            console.log("e", error);
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        } finally {
            this.spinner.hide()
        }
    }
    async timKiem() {
        try {
            const data = this.formData.value;
            const dataTrim = this.trimStringData(data);
            this.formData.patchValue({ ...dataTrim })
            await this.search();
            this.buildTableView();

        } catch (error) {
            console.log("error", error)
        }
    }
    trimStringData(obj: any) {
        for (const key in obj) {
            const value = obj[key];
            if (typeof value === 'string' || value instanceof String) {
                obj[key] = value.trim();
            }
        };
        return obj
    }
    resetForm() {
        this.formData.reset();
        this.formData.patchValue({ loaiDc: this.loaiDc, isVatTu: this.isVatTu, thayDoiThuKho: this.thayDoiThuKho, type: this.type, typeQd: this.typeQd })
    }
    clearFilter() {
        this.resetForm();
        this.timKiem();
    }
    redirectDetail(id: number, b: boolean) {
        this.selectedId = id;
        this.isDetail = true;
        this.isAddNew = b;
    }
    // buildTableView() {
    //     let dataView = Array.isArray(this.dataTable) ?
    //         this.dataTable.map((data) => {

    //             let rs = Array.isArray(data.dcnbBienBanLayMauHdrList) ? chain(data.dcnbBienBanLayMauHdrList).groupBy("maDiemKho").map((v, k) => {
    //                 let rowLv2 = v.find(s => s.maDiemKho === k);
    //                 if (!rowLv2) {
    //                     return;
    //                 }
    //                 return {
    //                     ...rowLv2,
    //                     idVirtual: uuidv4(),
    //                     maDiemKho: k,
    //                     childData: v
    //                 }
    //             }
    //             ).value() : [];

    //             return {
    //                 ...data,
    //                 soQdinhDcc: data.soQdinh,
    //                 qdccId: data.id,
    //                 idVirtual: uuidv4(),
    //                 childData: rs
    //             };
    //         }) : []
    //     this.dataView = dataView;
    //     this.expandAll()
    // }
    // buildTableView() {
    //     let dataView = Array.isArray(this.dataTable) ? this.dataTable.map((data) => {
    //         let arr = [];
    //         Array.isArray(data.danhSachQuyetDinh) ? data.danhSachQuyetDinh.forEach(element => {
    //             Array.isArray(element?.dcnbKeHoachDcHdr?.danhSachHangHoa) && element.dcnbKeHoachDcHdr.danhSachHangHoa.forEach(item => {
    //                 arr.push(item)
    //             });
    //         }) : [];
    //         const rs = chain(arr).groupBy("maDiemKho").map((v, k) => {
    //             let rowLv2 = v.find(s => s.maDiemKho === k);
    //             if (!rowLv2) {
    //                 return;
    //             }
    //             return {
    //                 ...rowLv2,
    //                 idVirtual: uuidv4(),
    //                 maDiemKho: k,
    //                 childData: v
    //             }
    //         }).value()
    //         return {
    //             ...data,
    //             soQdinhDcc: data.soQdinh,
    //             qdccId: data.id,
    //             idVirtual: uuidv4(),
    //             childData: rs
    //         }
    //     }) : [];
    //     this.dataView = dataView;
    //     this.expandAll()
    // }
    buildTableView() {
        // let removeDuplicateData = [];
        // this.dataTable.forEach((item, i) => {
        //     const maLoNganKho = item.maLoNganKho ? item.maLoNganKho : (item.maloKho ? `${item.maloKho}${item.maNganKho}` : item.maNganKho);
        //     const dataIndex = removeDuplicateData.findIndex(f => f.soQdinh == item.soQdinh && f.maLoNganKho == maLoNganKho);
        //     if (dataIndex < 0) {
        //         removeDuplicateData.push({ ...item, maLoNganKho })
        //     }
        // })
        let dataView = Array.isArray(this.dataTable) ?
            chain(this.dataTable).groupBy("soQdinh").map((rs, i) => {
                const dataSoQdinh = rs.find(f => f.soQdinh == i);
                if (!dataSoQdinh) return;
                const rsx = chain(rs).groupBy("maDiemKho").map((v, k) => {
                    let rowLv2 = v.find(s => s.maDiemKho === k);
                    if (!rowLv2) {
                        return;
                    }
                    return {
                        ...rowLv2,
                        idVirtual: uuidv4(),
                        maDiemKho: k,
                        childData: v
                    }
                }).value()
                return {
                    ...dataSoQdinh,
                    soQdinhDcc: dataSoQdinh.soQdinh,
                    idVirtual: uuidv4(),
                    childData: rsx
                }
            }).value() : [];
        this.dataView = cloneDeep(dataView);
        this.expandAll()
    }
    expandAll() {
        this.dataView.forEach(s => {
            this.expandSetString.add(s.idVirtual);
        })
    }

    onExpandStringChange(id: string, checked: boolean): void {
        if (checked) {
            this.expandSetString.add(id);
        } else {
            this.expandSetString.delete(id);
        }
    }
    viewDetail(id: number, isView: boolean) {

    }
    redirectToChiTiet(data: any, isView: boolean, idBbLayMau?: number, qddccId?: number, soQdinhDcc?: string, maLoKho?: string, tenLoKho?: string,
        maNganKho?: string, tenNganKho?: string, maNhaKho?: string, tenNhaKho?: string, maDiemKho?: string, tenDiemKho?: string, loaiVthh?: string, tenLoaiVthh?: string, cloaiVthh?: string,
        tenCloaiVthh?: string, thuKho?: number, tenThuKho?: string, donViTinh?: string, keHoachDcDtlId?: number) {
        this.selectedId = idBbLayMau;
        this.isDetail = true;
        this.isView = isView;
        this.passData = {
            idBbLayMau, qddccId, soQdinhDcc, maLoKho, tenLoKho, maNganKho, tenNganKho, maNhaKho, tenNhaKho, maDiemKho, tenDiemKho, loaiVthh, tenLoaiVthh, cloaiVthh, tenCloaiVthh, thuKho, tenThuKho, donViTinh, keHoachDcDtlId
        }
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
    checkPermissonAdd(): boolean {
        return this.userService.isAccessPermisson(this.MA_QUYEN.THEM);
    }
    checkPermissonExport(): boolean {
        return this.userService.isAccessPermisson(this.MA_QUYEN.EXP)
    }
    checkPermissonDelete(): boolean {
        return this.userService.isAccessPermisson(this.MA_QUYEN.XOA)
    }
    checkRoleAdd(trangThai: STATUS): boolean {
        return this.userService.isAccessPermisson(this.MA_QUYEN.THEM) && this.userService.isChiCuc() && !trangThai;
    }
    checkRoleView(trangThai: STATUS): boolean {
        return this.userService.isAccessPermisson(this.MA_QUYEN.XEM) && trangThai && !this.checkRoleAdd(trangThai) && !this.checkRoleEdit(trangThai) && !this.checkRoleApprove(trangThai);
    }
    checkRoleEdit(trangThai: STATUS): boolean {
        return this.userService.isAccessPermisson(this.MA_QUYEN.THEM) && [STATUS.DU_THAO, STATUS.TU_CHOI_LDCC].includes(trangThai) && this.userService.isChiCuc();
    }
    checkRoleApprove(trangThai: STATUS): boolean {
        return this.userService.isAccessPermisson(this.MA_QUYEN.DUYET_LDCCUC) && trangThai == this.STATUS.CHO_DUYET_LDCC && this.userService.isChiCuc();
    }
    checkRoleDelete(trangThai: STATUS): boolean {
        return this.userService.isAccessPermisson(this.MA_QUYEN.XOA) && trangThai == this.STATUS.DU_THAO && this.userService.isChiCuc();
    }
    xoaItem(item: any, roles?) {
        if (!this.checkPermission(roles)) {
            return
        }
        this.modal.confirm({
            nzClosable: false,
            nzTitle: 'Xác nhận',
            nzContent: 'Bạn có chắc chắn muốn xóa?',
            nzOkText: 'Đồng ý',
            nzCancelText: 'Không',
            nzOkDanger: true,
            nzWidth: 310,
            nzOnOk: async () => {
                this.spinner.show();
                try {
                    let body = {
                        id: item.id,
                        type: '00'
                    };
                    const res = await this.bienBanLayMauDieuChuyenService.delete(body);
                    if (res.msg == MESSAGE.SUCCESS) {
                        await this.timKiem();
                    }
                } catch (e) {
                    console.log('error: ', e);
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                }
                finally {
                    this.spinner.hide()
                }
            },
        });
    }
    showList() {
        this.isDetail = false;
        this.timKiem();
    }
    openModalQdDc(qddccId: number) {
        this.qddccId = qddccId;
        this.isViewQdDc = true
    }
    closeModalQdDc() {
        this.qddccId = null;
        this.isViewQdDc = false;
    }
}

