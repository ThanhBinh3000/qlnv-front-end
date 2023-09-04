import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { v4 as uuidv4 } from "uuid";
import { Validators } from "@angular/forms";
import * as dayjs from "dayjs";
import { Base2Component } from "../../../../../components/base2/base2.component";
import { StorageService } from "../../../../../services/storage.service";
import { DonviService } from "../../../../../services/donvi.service";
import { DanhMucService } from "../../../../../services/danhmuc.service";
import { STATUS } from "../../../../../constants/status";
import { MESSAGE } from "../../../../../constants/message";
import { chain, cloneDeep } from 'lodash';
import { FILETYPE } from "../../../../../constants/fileType";
import { DataService } from 'src/app/services/data.service';
import {
    QuyetDinhDieuChuyenService
} from "../../../../../services/qlnv-kho/dieu-chuyen-sap-nhap-kho/quyet-dinh-dieu-chuyen.service";
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { DanhMucDuyetKhoService } from 'src/app/services/qlnv-kho/dieu-chuyen-sap-nhap-kho/danh-muc-duyet-kho.service';
import { DieuChuyenKhoService } from 'src/app/services/qlnv-kho/dieu-chuyen-sap-nhap-kho/dieu-chuyen-kho.service';
import { convertTienTobangChu } from 'src/app/shared/commonFunction';
import { PhieuNhapHangSapNhapService } from './../../../../../services/qlnv-kho/dieu-chuyen-sap-nhap-kho/phieu-nhap-hang-sap-nhap.service';

@Component({
    selector: 'app-thong-tin-phieu-nhap-hang',
    templateUrl: './thong-tin-phieu-nhap-hang.component.html',
    styleUrls: ['./thong-tin-phieu-nhap-hang.component.scss']
})
export class ThongTinPhieuNhapHangSapNhapComponent extends Base2Component implements OnInit {
    @Input('isView') isView: boolean;
    @Output()
    showListEvent = new EventEmitter<any>();
    @Input() idInput: number;
    listCcPhapLy: any[] = [];
    listFileDinhKem: any[] = [];
    listFile: any[] = [];
    maQd: string;
    expandSetString = new Set<string>();
    ObTrangThai: { [key: string]: string } = {
        [this.STATUS.DU_THAO]: "Dự thảo",
        [this.STATUS.DA_HOAN_THANH]: "Hoàn thành"
    };
    obTenLoai: { [key: string]: string } = {
        "SN_DIEM_KHO": "Điều chuyển - Sáp nhập điểm kho",
        "SN_CHI_CUC": "Điều chuyển - sáp nhập chi cục"
    }
    dsCuc: any;
    dsCucDi: any;
    dsCucDen: any;
    dsChiCuc: any;
    dsChiCucDi: any;
    dsChiCucDen: any;
    dsKho: any;
    dsKhoDi: any;
    dsKhoDen: any;
    rowItem: any = {};
    dataEdit: { [key: string]: { edit: boolean; data: any } } = {};
    hasError: boolean = false;
    isDisabledThemMoi: boolean = false;
    danhSachQuyetDinh: any[] = [];
    danhSachNganLo: any[] = [];

    constructor(httpClient: HttpClient,
        storageService: StorageService,
        notification: NzNotificationService,
        spinner: NgxSpinnerService,
        modal: NzModalService,
        private donviService: DonviService,
        private danhMucService: DanhMucService,
        private dataService: DataService,
        private dieuChuyenKhoService: DieuChuyenKhoService,
        private quyetDinhDieuChuyenService: QuyetDinhDieuChuyenService,
        private danhMucDuyetKhoService: DanhMucDuyetKhoService,
        private phieuNhapHangSapNhapService: PhieuNhapHangSapNhapService
    ) {
        super(httpClient, storageService, notification, spinner, modal, phieuNhapHangSapNhapService);
        this.formData = this.fb.group({
            id: [],
            maDvi: [],
            tenDvi: [],
            nam: [dayjs().get("year"), [Validators.required]],
            soPhieu: [],
            maQhns: [],
            ngayNhapKho: [dayjs().format("YYYY-MM-DD")],
            no: [],
            co: [],
            soQuyetDinh: [],
            soQuyetDinhId: [],
            maLoKho: [],
            maNganKho: [],
            maNhaKho: [],
            maDiemKho: [],
            maNganLo: [],
            tenLoKho: [],
            tenNganKho: [],
            tenNhaKho: [],
            tenDiemKho: [],
            tenNganLo: [],
            loaiVthh: [],
            tenLoaiVthh: [],
            cloaiVthh: [],
            tenCloaiVthh: [],
            tenCanBoLap: [],
            tenLanhDao: [],
            tenKtv: [],
            tenKtt: [],
            donViTinh: [],
            tongSoLuong: [],
            tongSoLuongBc: [],
            tongSoTien: [],
            tongSoTienBc: [],
            ghiChu: [],
            lyDoTuChoi: [],
            trangThai: [STATUS.DU_THAO],
            tenTrangThai: [this.ObTrangThai[STATUS.DU_THAO]],
        });

    }

    async ngOnInit() {
        await this.spinner.show();
        try {
            if (this.idInput) {
                await this.getDetail(this.idInput)
            } else {
                await this.bindingData();
            }
        } catch (e) {
            console.log('error: ', e);
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
        finally {
            await this.spinner.hide()
        }
    }

    async bindingData() {
        this.formData.patchValue({
            tenDvi: this.userInfo.TEN_DVI,
            maDvi: this.userInfo.MA_DVI,
            tenCanBoLap: this.userInfo.TEN_DAY_DU,
            maQhns: this.userInfo.DON_VI.maQhns
        })
    }

    async save(isGuiDuyet?: boolean) {

        try {
            await this.spinner.show();
            let body = this.formData.value;
            body.phieuNhapHangDtl = this.dataTable;
            body.fileDinhKem = this.listFileDinhKem;
            let data = await this.createUpdate(body, null, isGuiDuyet);
            if (data) {
                this.idInput = data.id;
                this.formData.patchValue({ id: data.id, trangThai: data.trangThai, soQuyetDinh: data.soQuyetDinh?.split('/')[0] });
                if (isGuiDuyet) {
                    this.hoanThanh()
                }
            }
        } catch (error) {
            console.log("e", error)
        }
        finally {
            await this.spinner.hide()
        }
    }
    hoanThanh() {
        this.modal.confirm({
            nzClosable: false,
            nzTitle: 'Xác nhận',
            nzContent: "Bạn có muốn hoàn thành bản ghi này?.",
            nzCancelText: 'Không',
            nzOkDanger: true,
            nzWidth: 310,
            nzOnOk: async () => {
                this.spinner.show();
                try {
                    let body = {
                        id: this.formData.value.id,
                        trangThai: STATUS.DA_HOAN_THANH
                    };
                    let res =
                        await this.phieuNhapHangSapNhapService.approve(
                            body,
                        );
                    if (res.msg == MESSAGE.SUCCESS) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.THAO_TAC_SUCCESS);
                        this.back();
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
    back() {
        this.showListEvent.emit();
    }

    // async flattenTree(tree) {
    //   return tree.flatMap((item) => {
    //     return item.childData ? this.flattenTree(item.childData) : item;
    //   });
    // }


    async getDetail(id: number) {
        await this.phieuNhapHangSapNhapService
            .getDetail(id)
            .then((res) => {
                if (res.msg == MESSAGE.SUCCESS) {
                    const dataDetail = res.data;
                    // this.helperService.bidingDataInFormGroup(this.formData, dataDetail);
                    if (dataDetail) {
                        const maNganLo = dataDetail.maLoKho ? `${dataDetail.maLoKho}${dataDetail.maNganKho}` : dataDetail.maNganKho;
                        const tenNganLo = dataDetail.tenLoKho ? `${dataDetail.tenLoKho}${dataDetail.tenNganKho}` : dataDetail.tenNganKho;
                        this.formData.patchValue({
                            id: dataDetail.id,
                            maDvi: dataDetail.maDvi,
                            tenDvi: dataDetail.tenDvi,
                            nam: dataDetail.nam,
                            soPhieu: dataDetail.soPhieu,
                            maQhns: dataDetail.maQhns,
                            ngayNhapKho: dataDetail.ngayNhapKho,
                            no: dataDetail.no,
                            co: dataDetail.co,
                            soQuyetDinhId: dataDetail.soQuyetDinhId,
                            maLoKho: dataDetail.maLoKho,
                            maNganKho: dataDetail.maNganKho,
                            maNhaKho: dataDetail.maNhaKho,
                            maDiemKho: dataDetail.maDiemKho,
                            maNganLo: maNganLo,
                            tenLoKho: dataDetail.tenLoKho,
                            tenNganKho: dataDetail.tenNganKho,
                            tenNhaKho: dataDetail.tenNhaKho,
                            tenDiemKho: dataDetail.tenDiemKho,
                            loaiVthh: dataDetail.loaiVthh,
                            tenLoaiVthh: dataDetail.tenLoaiVthh,
                            cloaiVthh: dataDetail.cloaiVthh,
                            tenCloaiVthh: dataDetail.tenCloaiVthh,
                            tenCanBoLap: dataDetail.tenCanBoLap,
                            tenLanhDao: dataDetail.tenLanhDao,
                            tenKtv: dataDetail.tenKtv,
                            tenKtt: dataDetail.tenKtt,
                            donViTinh: dataDetail.donViTinh,
                            tongSoLuong: dataDetail.tongSoLuong,
                            tongSoLuongBc: dataDetail.tongSoLuongBc,
                            tongSoTien: dataDetail.tongSoTien,
                            tongSoTienBc: dataDetail.tongSoTienBc,
                            ghiChu: dataDetail.ghiChu,
                            lyDoTuChoi: dataDetail.lyDoTuChoi,
                            trangThai: dataDetail.trangThai,
                            tenTrangThai: dataDetail.tenTrangThai,
                        });
                        this.formData.controls["soQuyetDinh"].setValue(dataDetail.soQuyetDinh, { emitEvent: false });
                        this.formData.controls["tenNganLo"].setValue(tenNganLo, { emitEvent: false });
                        this.listFileDinhKem = dataDetail.fileDinhKem;
                        this.dataTable = dataDetail.phieuNhapHangDtl;
                    }
                }
            })
            .catch((e) => {
                console.log('error: ', e);
                this.spinner.hide();
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            });
    }
    async getDanhsachQuyetDinh() {
        let body = {
            maDvi: this.userInfo.MA_DVI.slice(0, -2),
            paggingReq: { limit: 2147483647, page: 0 },
        }
        let res = await this.dieuChuyenKhoService.danhSach(body);
        if (res.msg == MESSAGE.SUCCESS) {
            this.danhSachQuyetDinh = Array.isArray(res?.data) ? res.data : [];
        } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
        }
    }
    async openDialogSoQuyetDinhDCSN() {
        await this.getDanhsachQuyetDinh();
        const modalQD = this.modal.create({
            nzTitle: 'DANH SÁCH QUYẾT ĐỊNH XUẤT ĐIỀU CHUYỂN SÁP NHẬP',
            nzContent: DialogTableSelectionComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {
                dataTable: this.danhSachQuyetDinh,
                dataHeader: ['Số quyết định'],
                dataColumn: ['soQuyetDinh'],
            },
        })
        modalQD.afterClose.subscribe(async (dataChose) => {
            if (dataChose && dataChose.id) {
                this.formData.patchValue({ soQuyetDinh: dataChose.soQuyetDinh, soQuyetDinhId: dataChose.soQuyetDinhId })
                const res = await this.dieuChuyenKhoService.getDetail(dataChose.id);
                const dieuChuyenKhoHangDtl = Array.isArray(res?.data?.dieuChuyenKhoHangDtl) ? res?.data?.dieuChuyenKhoHangDtl : [];
                this.danhSachNganLo = dieuChuyenKhoHangDtl.filter(f => f.maChiCucDi === this.formData.value.maDvi && f.thayDoiThuKho);
                this.dataTable = [];
                // await this.bindingDataQd(dataChose.id, false);
            }
        });
    };
    openDialogNganLoKho() {
        const modalQD = this.modal.create({
            nzTitle: 'DANH SÁCH ĐỊA ĐIỂM XUẤT HÀNG',
            nzContent: DialogTableSelectionComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {
                dataTable: this.danhSachNganLo,
                dataHeader: ['Tên lô kho', 'Tên Ngăn kho', 'Tên nhà kho', 'Tên điểm kho'],
                dataColumn: ['tenLoKhoDi', 'tenNganKhoDi', 'tenNhaKhoDi', 'tenDiemKhoDi'],
            },
        })
        modalQD.afterClose.subscribe(async (dataChose) => {
            this.dataTable = [];
            if (dataChose) {
                this.bindingDiaDiem(dataChose);
            }
        });
    };
    bindingDiaDiem(data) {
        this.formData.patchValue({
            maLoKho: data.maLoKhoDi,
            maNganKho: data.maNganKhoDi,
            maNhaKho: data.maNhaKhoDi,
            maDiemKho: data.maDiemKhoDi,
            maNganLo: data.maLoKhoDi ? `${data.maLoKhoDi}${data.maNganKhoDi}` : data.maNganKhoDi,
            tenLoKho: data.tenLoKhoDi,
            tenNganKho: data.tenNganKhoDi,
            tenNhaKho: data.tenNhaKhoDi,
            tenDiemKho: data.tenDiemKhoDi,
            tenNganLo: data.tenLoKhoDi ? `${data.tenLoKhoDi} - ${data.tenNganKhoDi}` : data.tenNganKhoDi,
            loaiVthh: data.loaiVthh,
            tenLoaiVthh: data.tenLoaiVthh,
            cloaiVthh: data.cloaiVthh,
            tenCloaiVthh: data.tenCloaiVthh,
            donViTinh: data.donViTinh
        });
        this.addItemRow();
    }
    addItemRow() {
        this.dataTable.push({
            maSo: "",
            donViTinh: this.formData.value.donViTinh,
            ten: this.formData.value.tenCloaiVthh,
            soLuong: "",
            soTien: ""
        });
    }
    deleteItemRow(i) {
        this.dataTable.splice(i, 1)
    }
    handleChangeSoLuong(value) {
        const tongSoLuong = this.dataTable.reduce((sum, cur) => sum += !isNaN(cur.soLuong) ? cur.soLuong : 0, 0);
        const tongSoLuongBc = this.convertTien(tongSoLuong, this.formData.value.donViTinh);
        this.formData.patchValue({ tongSoLuong, tongSoLuongBc })
    }

    handleChangeThanhTien(value) {
        const tongSoTien = this.dataTable.reduce((sum, cur) => sum += !isNaN(cur.soTien) ? cur.soTien : 0, 0);
        const tongSoTienBc = this.convertTien(tongSoTien, 'VNĐ');
        this.formData.patchValue({ tongSoTien, tongSoTienBc })
    }
    convertTien(tien: number, donVi: string): string {
        return (tien && tien > 0) ? `${convertTienTobangChu(tien)} (${donVi})` : '';
    }
}