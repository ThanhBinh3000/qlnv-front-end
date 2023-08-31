import { PhieuXuatHangHaoHutSapNhapService } from 'src/app/services/qlnv-kho/dieu-chuyen-sap-nhap-kho/phieu-xuat-hang-hao-hut.service';
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

@Component({
    selector: 'app-thong-tin-bien-ban-sap-nhap-kho',
    templateUrl: './thong-tin-bien-ban-sap-nhap-kho.component.html',
    styleUrls: ['./thong-tin-bien-ban-sap-nhap-kho.component.scss']
})
export class ThongTinBienBanSapNhapKhoComponent extends Base2Component implements OnInit {
    @Input('isView') isView: boolean;
    @Output()
    showListEvent = new EventEmitter<any>();
    @Input() idInput: number;
    listCcPhapLy: any[] = [];
    listFileDinhKem: any[] = [];
    listFile: any[] = [];
    maQd: string;
    expandSetString = new Set<string>();
    listTrangThaiSn: any[] = [
        { ma: this.STATUS.CHUA_THUC_HIEN, giaTri: "Chưa thực hiện" },
        { ma: this.STATUS.DANG_THUC_HIEN, giaTri: "Đang thực hiện" },
        { ma: this.STATUS.DA_HOAN_THANH, giaTri: "Đã hoàn thành" },
    ];
    ObTrangThai: { [key: string]: string } = {
        [this.STATUS.DANG_NHAP_DU_LIEU]: "Đang nhập dữ liệu",
        [this.STATUS.BAN_HANH]: "Ban hành"
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
        private phieuXuatHangHaoHutSapNhapService: PhieuXuatHangHaoHutSapNhapService
    ) {
        super(httpClient, storageService, notification, spinner, modal, phieuXuatHangHaoHutSapNhapService);
        this.formData = this.fb.group({
            id: [],
            maDvi: [],
            tenDvi: [],
            nam: [dayjs().get("year"), [Validators.required]],
            soPhieu: [],
            maQhns: [],
            ngayTaoPhieu: [dayjs().format("YYYY-MM-DD")],
            ngayXuatKho: [dayjs().format("YYYY-MM-DD")],
            no: [],
            co: [],
            soQuyetDinh: [],
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

            tongSoLuong: [],
            tongSoLuongBc: [],
            ghiChu: [],
            lyDoTuChoi: [],
            trangThai: [STATUS.DANG_NHAP_DU_LIEU],
            tenTrangThai: [this.ObTrangThai[STATUS.DANG_NHAP_DU_LIEU]],
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
            body.phieuXuatHaoHutDtl = this.dataTable;
            body.fileDinhKem = this.listFileDinhKem;
            let data = await this.createUpdate(body, null, isGuiDuyet);
            if (data) {
                this.idInput = data.id;
                this.formData.patchValue({ id: data.id, trangThai: data.trangThai, soQuyetDinh: data.soQuyetDinh?.split('/')[0] });
                if (isGuiDuyet) {
                    this.banHanh()
                }
            }
        } catch (error) {
            console.log("e", error)
        }
        finally {
            await this.spinner.hide()
        }
    }
    banHanh() {
        this.modal.confirm({
            nzClosable: false,
            nzTitle: 'Xác nhận',
            nzContent: "Bạn có muốn ban hành bản ghi này?.",
            nzCancelText: 'Không',
            nzOkDanger: true,
            nzWidth: 310,
            nzOnOk: async () => {
                this.spinner.show();
                try {
                    let body = {
                        id: this.formData.value.id,
                        trangThai: STATUS.BAN_HANH
                    };
                    let res =
                        await this.quyetDinhDieuChuyenService.approve(
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
        await this.quyetDinhDieuChuyenService
            .getDetail(id)
            .then((res) => {
                if (res.msg == MESSAGE.SUCCESS) {
                    const dataDetail = res.data;
                    this.helperService.bidingDataInFormGroup(this.formData, dataDetail);
                    if (dataDetail) {
                        this.fileDinhKem = dataDetail.fileDinhKem;
                        this.dataTable = dataDetail.phieuXuatHaoHutDtl;
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
            maDvi: this.userInfo.MA_DVI,
            paggingReq: { limit: 2147483647, page: 0 },
        }
        let res = await this.dieuChuyenKhoService.danhSach(body);
        if (res.msg == MESSAGE.SUCCESS) {
            this.danhSachQuyetDinh = Array.isArray(res?.data?.content) ? res.data.content : [];
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
                dataHeader: ['Số quyết định', "Loại sáp nhập", 'Ngày ký quyết định'],
                dataColumn: ['soQuyetDinh', 'tenLoai', 'ngayKy'],
            },
        })
        modalQD.afterClose.subscribe(async (dataChose) => {
            if (dataChose && dataChose.id) {
                const res = await this.quyetDinhDieuChuyenService.getDetail(dataChose.id);
                console.log("dataChose", dataChose, res)
                this.dataTable = [];
                // await this.bindingDataQd(dataChose.id, false);
            }
        });
    };
    openDialogNganLoKho() {

    }
    addItemRow() {
        this.dataTable.push({
            maSo: "",
            donViTinh: this.formData.value.donViTinh,
            ten: this.formData.value.tenCloaiVthh,
            soLuong: ""
        })
    }
    deleteItemRow(i) {
        this.dataTable.splice(i, 1)
    }
    handleChangeSoLuong(value) {
        console.log("value", value)
    }

}