import { QuyetDinhGiaoNhapHangKhacService } from './../../../../../../services/qlnv-hang/nhap-hang/nhap-khac/quyetDinhGiaoNhapHangKhac.service';
import { HttpClient } from "@angular/common/http";
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Validators } from "@angular/forms";
import * as dayjs from "dayjs";
import { cloneDeep } from 'lodash';
import { NzModalService } from "ng-zorro-antd/modal";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { Base2Component } from "src/app/components/base2/base2.component";
import {
    DialogTableSelectionComponent
} from "src/app/components/dialog/dialog-table-selection/dialog-table-selection.component";
import { MESSAGE } from "src/app/constants/message";
import { STATUS } from "src/app/constants/status";
import { DanhMucService } from "src/app/services/danhmuc.service";
import { BienBanNghiemThuBaoQuanLanDauService } from "src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/bien-ban-nghiem-thu-bao-quan-lan-dau.service";
import { StorageService } from "src/app/services/storage.service";
import { convertTienTobangChu } from "src/app/shared/commonFunction";
import { v4 as uuidv4 } from 'uuid';
import { BienBanKetThucNhapKhacNhapKhoVatTuService } from "../bien-ban-ket-thuc-nhap-khac-nhap-kho-vt.service";
import { PhieuNhapKhoService } from 'src/app/services/qlnv-hang/nhap-hang/nhap-khac/phieuNhapKho';

@Component({
    selector: 'app-chi-tiet-bien-ban-ket-thuc-nhap-khac-nhap-kho-vt',
    templateUrl: './chi-tiet-bien-ban-ket-thuc-nhap-khac-nhap-kho-vt.component.html',
    styleUrls: ['./chi-tiet-bien-ban-ket-thuc-nhap-khac-nhap-kho-vt.component.scss']
})
export class ThongTinBienBanKetThucNhapKhacNhapKhoVatTuComponent extends Base2Component implements OnInit {
    @Input() idInput: number;
    @Input() isView: boolean;
    @Input() data: any;
    @Output()
    showListEvent = new EventEmitter<any>();

    previewName: string = 'nk_bb_kt_nk';
    maBb: string;
    fileDinhKemReq: any[] = [];
    listDanhSachQuyetDinh: any[] = [];

    dsKeHoach: any[] = []

    danhSach: any[] = []
    allCheckedTT = false;
    indeterminateTT = false;

    constructor(
        httpClient: HttpClient,
        storageService: StorageService,
        notification: NzNotificationService,
        spinner: NgxSpinnerService,
        modal: NzModalService,
        private cdr: ChangeDetectorRef,
        private danhMucService: DanhMucService,
        private quyetDinhGiaoNhapHangKhacService: QuyetDinhGiaoNhapHangKhacService,
        private phieuNhapKhoService: PhieuNhapKhoService,
        private bienBanKetThucNhapKhacNhapKhoVatTuService: BienBanKetThucNhapKhacNhapKhoVatTuService,
    ) {
        super(httpClient, storageService, notification, spinner, modal, bienBanKetThucNhapKhacNhapKhoVatTuService);
        this.formData = this.fb.group({
            trangThai: [STATUS.DU_THAO],
            tenTrangThai: ['Dự thảo'],
            nam: [dayjs().get("year"), [Validators.required]],
            maDvi: [],
            id: [],
            tenDvi: [],
            maQhns: [],
            soBb: [],
            ngayLap: [dayjs().format('YYYY-MM-DD')],
            soQdPdNk: [],
            ngayQdPdNk: [],
            qdPdNkId: [],

            tenNganLoKho: [],
            soBBLayMau: [],
            soBBChuanBiKho: [],

            tenLoKho: [],
            maLoKho: [],
            tenNganKho: [],
            maNganKho: [],
            tenNhaKho: [],
            maNhaKho: [],
            tenDiemKho: [],
            maDiemKho: [],
            loaiVthh: [],
            tenLoaiVthh: [],
            cloaiVthh: [],
            tenCloaiVthh: [],
            donViTinh: [],
            hhNkBBKetThucNKDtl: [new Array<any>(),],
            ngayBatDauNhap: [],
            ngayKetThucNhap: [],
            tongSlTheoQd: [],
            tenThuKho: [],
            tenKtvBQuan: [],
            tenKeToanTruong: [],
            tenLanhDaoChiCuc: [],
            ghiChu: [],

        });
    }

    async ngOnInit() {
        this.formData.patchValue({
            maDvi: this.userInfo.MA_DVI,
            tenDvi: this.userInfo.TEN_DVI,
            maQhns: this.userInfo.DON_VI.maQhns,
            tenThuKho: this.userInfo.TEN_DAY_DU,
        })

        if (this.idInput) {
            await this.loadChiTiet(this.idInput)
        }

        // if (this.data) {
        //   this.formData.patchValue({
        //     soQdDcCuc: this.data.soQdinh,
        //     ngayQdDcCuc: this.data.thoiHanDieuChuyen,
        //     qdDcCucId: this.data.qdinhDccId,
        //     tenLoKho: this.data.tenLoKhoNhan,
        //     maLoKho: this.data.maLoKhoNhan,
        //     tenNganKho: this.data.tenNganKhoNhan,
        //     maNganKho: this.data.maNganKhoNhan,
        //     tenNhaKho: this.data.tenNhaKhoNhan,
        //     maNhaKho: this.data.maNhaKhoNhan,
        //     tenDiemKho: this.data.tenDiemKhoNhan,
        //     maDiemKho: this.data.maDiemKhoNhan,
        //     tenLoKhoXuat: this.data.tenLoKhoXuat,
        //     maLoKhoXuat: this.data.maLoKhoXuat,
        //     tenNganKhoXuat: this.data.tenNganKhoXuat,
        //     maNganKhoXuat: this.data.maNganKhoXuat,
        //     tenNhaKhoXuat: this.data.tenNhaKhoXuat,
        //     maNhaKhoXuat: this.data.maNhaKhoXuat,
        //     tenDiemKhoXuat: this.data.tenDiemKhoXuat,
        //     maDiemKhoXuat: this.data.maDiemKhoXuat,
        //     loaiVthh: this.data.loaiVthh,
        //     tenLoaiVthh: this.data.tenLoaiVthh,
        //     cloaiVthh: this.data.cloaiVthh,
        //     tenCloaiVthh: this.data.tenCloaiVthh,
        //     tichLuongKhaDung: this.data.tichLuongKd,
        //     tenDonViTinh: this.data.tenDonViTinh,
        //     idKeHoachDtl: this.data.qdinhDccId
        //   });
        //   await this.loadChiTietQdinh(this.data.qdinhDccId);
        //   await this.loadDataBaoQuan(this.data.cloaiVthh || "010101")
        // }

    }

    isCuc() {
        return this.userService.isCuc()
    }

    isChiCuc() {
        return this.userService.isChiCuc()
    }

    convertTien(tien: number): string {
        if (tien) {
            return convertTienTobangChu(tien);
        }
    }

    async loadChiTiet(id: number) {
        await this.spinner.show()
        if (id) {
            let data = await this.detail(id);
            if (data) {
                this.danhSach = data.hhNkBBKetThucNKDtl
                this.formData.patchValue(data);
                this.fileDinhKemReq = data.fileDinhKems
            }

        }
        await this.spinner.hide();
    }

    async getDanhSachTT(data) {
        const body = {
            qdGiaoNvId: data.qdPdNkId,
            maDiemKho: data.maDiemKho,
            maNhaKho: data.maNhaKho,
            maNganKho: data.maNganKho,
            maLoKho: data.maLoKho
        }
        let res = await this.phieuNhapKhoService.getDanhSachTT(body);
        if (res.msg == MESSAGE.SUCCESS) {
            this.danhSach = res.data.map(element => {
                return {
                    bangKeNhapKhoId: element.bangKeVtId,
                    hdrId: null,
                    id: null,
                    ngayNhap: element.ngayNhapKho,
                    phieuNhapKhoId: element.id,
                    soBangKeNhap: element.soBangKeVt,
                    soLuong: element.soLuong,
                    soPhieuNhapKho: element.soPhieuNhapKho
                    // checked: false
                }
            });
            if (this.danhSach && this.danhSach.length > 0) {
                const maxDate = new Date(Math.min.apply(null, this.danhSach.map(function (e) {
                    return new Date(e.ngayNhapKho);
                })));
                const minDateString = maxDate.toISOString().slice(0, 10);
                this.formData.patchValue({
                    ngayBatDauNhap: minDateString
                })
            }
        }
    }

    updateAll(): void {
        this.indeterminateTT = false;
        if (this.allCheckedTT) {
            if (this.danhSach && this.danhSach.length > 0) {
                this.danhSach.forEach((item) => {
                    item.checked = true;
                });
            }
        } else {
            if (this.danhSach && this.danhSach.length > 0) {
                this.danhSach.forEach((item) => {
                    item.checked = false;
                });
            }
        }
        this.danhSach = cloneDeep(this.danhSach)
    }

    updateSingle(): void {
        if (this.danhSach.every((item) => !item.checked)) {
            this.allCheckedTT = false;
            this.indeterminateTT = false;
        } else if (this.danhSach.every((item) => item.checked)) {
            this.allCheckedTT = true;
            this.indeterminateTT = false;
        } else {
            this.indeterminateTT = true;
        }
        this.danhSach = cloneDeep(this.danhSach)
    }


    async openDialogQD() {
        await this.spinner.show();
        let body = {
            trangThai: STATUS.BAN_HANH,
            // maDvi: this.userInfo.MA_DVI
        }
        let res = await this.quyetDinhGiaoNhapHangKhacService.search(body);
        if (res.msg == MESSAGE.SUCCESS) {
            this.listDanhSachQuyetDinh = res.data.content;
        }
        await this.spinner.hide();

        const modalQD = this.modal.create({
            nzTitle: 'Danh sách quyết định',
            nzContent: DialogTableSelectionComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {
                dataTable: this.listDanhSachQuyetDinh,
                dataHeader: ['Số quyết định', 'Ngày quyết định'],
                dataColumn: ['soQd', 'ngayQd'],
            },
        });
        modalQD.afterClose.subscribe(async (data) => {
            if (data) {
                this.formData.patchValue({
                    soQdPdNk: data.soQd,
                    ngayQdPdNk: data.ngayQd,
                    qdPdNkId: data.id,

                    tenNganLoKho: "",
                    tenLoKho: "",
                    maLoKho: "",
                    tenNganKho: "",
                    maNganKho: "",
                    tenNhaKho: "",
                    maNhaKho: "",
                    tenDiemKho: "",
                    maDiemKho: "",

                    loaiVthh: "",
                    tenLoaiVthh: "",
                    cloaiVthh: "",
                    tenCloaiVthh: "",
                    tichLuongKhaDung: "",
                    donViTinh: "",
                });
                this.danhSach = [];
                // await this.getDanhSachTT(data.id)
                await this.loadChiTietQdinh(data.id);
            }
        });
    }

    async openDialogKhoNhap() {
        await this.spinner.show();

        await this.spinner.hide();

        const modalQD = this.modal.create({
            nzTitle: 'Danh sách kho nhập',
            nzContent: DialogTableSelectionComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {
                dataTable: this.dsKeHoach,
                dataHeader: ['Lô kho nhập', 'Ngăn kho nhập', 'Nhà kho nhập', 'Điểm kho nhập'],
                dataColumn: ['tenLoKho', 'tenNganKho', 'tenNhaKho', 'tenDiemKho']
            },
        });
        modalQD.afterClose.subscribe(async (data) => {
            if (data) {
                this.formData.patchValue({
                    tenNganLoKho: data.tenLoKho ? data.tenLoKho + " - " + data.tenNganKho : data.tenNganKho,
                    tenLoKho: data.tenLoKho,
                    maLoKho: data.maLoKho,
                    tenNganKho: data.tenNganKho,
                    maNganKho: data.maNganKho,
                    tenNhaKho: data.tenNhaKho,
                    maNhaKho: data.maNhaKho,
                    tenDiemKho: data.tenDiemKho,
                    maDiemKho: data.maDiemKho,

                    loaiVthh: data.loaiVthh,
                    tenLoaiVthh: data.tenLoaiVthh,
                    cloaiVthh: data.cloaiVthh,
                    tenCloaiVthh: data.tenCloaiVthh,
                    tichLuongKhaDung: data.tichLuongKd,
                    donViTinh: data.tenDonViTinh,
                    idKeHoachDtl: data.id,

                    soBBLayMau: data.bbLayMau
                });
                await this.getDanhSachTT({ qdPdNkId: this.formData.value.qdPdNkId, maDiemKho: this.formData.value.maDiemKho, maNhaKho: this.formData.value.maNhaKho, maNganKho: this.formData.value.maNganKho, maLoKho: this.formData.value.maLoKho })

            }
        });
    }

    async loadChiTietQdinh(id: number) {
        let res = await this.quyetDinhGiaoNhapHangKhacService.getDetail(id);
        if (res.msg == MESSAGE.SUCCESS) {

            const data = res.data
            this.dsKeHoach = []
            this.dsKeHoach = cloneDeep(Array.isArray(data.dtlList) ? data.dtlList : [])
        }
    }

    async save(isGuiDuyet?) {
        await this.spinner.show();
        let body = this.formData.value;
        body.hhNkBBKetThucNKDtl = this.danhSach.filter(item => item.checked)
        body.fileDinhKemReq = this.fileDinhKemReq;

        if (this.idInput) {
            body.id = this.idInput
        }
        let data = await this.createUpdate(body);
        if (data) {
            this.formData.patchValue({ id: data.id, trangThai: data.trangThai, tenTrangThai: data.tenTrangThai, soBb: data.soBb });
            if (isGuiDuyet) {
                this.idInput = data.id;
                this.guiDuyet();
            }
            // else {
            //     this.quayLai();
            // }
        }
        await this.spinner.hide();
    }



    isGuiDuyet() {
        return this.isView && this.formData.value.trangThai !== STATUS.DU_THAO
    }

    async guiDuyet() {
        let trangThai = STATUS.CHO_DUYET_KTVBQ;
        let mesg = 'Bạn muốn gửi duyệt văn bản?'
        this.approve(this.idInput, trangThai, mesg);
    }

    isTuChoi() {
        return this.userService.isChiCuc() && [STATUS.CHO_DUYET_KTVBQ, STATUS.CHO_DUYET_KT, STATUS.CHO_DUYET_LDCC].includes(this.formData.value.trangThai)
    }

    isPheDuyet() {
        return this.userService.isChiCuc() && [STATUS.CHO_DUYET_KTVBQ, STATUS.CHO_DUYET_KT, STATUS.CHO_DUYET_LDCC].includes(this.formData.value.trangThai);
    }

    async pheDuyet(isPheDuyet?: boolean) {
        let trangThai = "";
        if (isPheDuyet) {
            const msg = 'Bạn muốn phê duyệt văn bản?';
            switch (this.formData.value.trangThai) {
                case STATUS.CHO_DUYET_KTVBQ:
                    trangThai = STATUS.CHO_DUYET_KT;
                    break;
                case STATUS.CHO_DUYET_KT:
                    trangThai = STATUS.CHO_DUYET_LDCC;
                    break;
                case STATUS.CHO_DUYET_LDCC:
                    trangThai = STATUS.DA_DUYET_LDCC;
                    break;
                default:
                    trangThai = STATUS.CHO_DUYET_KTVBQ;
                    break;
            }
            this.approve(this.idInput, trangThai, msg);
        } else {
            switch (this.formData.value.trangThai) {
                case STATUS.CHO_DUYET_KTVBQ:
                    trangThai = STATUS.TU_CHOI_KTVBQ;
                    break;
                case STATUS.CHO_DUYET_KT:
                    trangThai = STATUS.TU_CHOI_KT;
                    break;
                case STATUS.CHO_DUYET_LDCC:
                    trangThai = STATUS.TU_CHOI_LDCC;
                    break;
                default:
                    trangThai = STATUS.TU_CHOI_KTVBQ;
                    break;
            }
            this.reject(this.formData.value.id, trangThai)
        }

    }

    isBanHanh() {
        return this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC
    }

    async banHanh() {
        let trangThai = STATUS.DA_DUYET_LDCC;
        let mesg = 'Bạn muốn ban hành văn bản?'
        this.approve(this.idInput, trangThai, mesg);
    }

    quayLai() {
        this.showListEvent.emit();
    }

    ngAfterViewChecked() {
        this.cdr.detectChanges();
    }

}

