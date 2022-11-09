import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import {
    DialogDanhSachHangHoaComponent
} from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DonviService } from 'src/app/services/donvi.service';
import { QuanLyBangKeCanHangService } from 'src/app/services/quanLyBangKeCanHang.service';
import {
    QuanLyPhieuKiemTraChatLuongHangService
} from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/quanLyPhieuKiemTraChatLuongHang.service';
import {
    QuanLyPhieuNhapKhoService
} from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/nhap-kho/quanLyPhieuNhapKho.service';
import { QuanLyPhieuSoKhoService } from 'src/app/services/quanLySoKho.service';
import {
    QuyetDinhGiaoNhapHangService
} from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';
import { ThongTinHopDongService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/hop-dong/thongTinHopDong.service';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { UserService } from 'src/app/services/user.service';
import { convertTienTobangChu, thongTinTrangThaiNhap } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import { BaseComponent } from "../../../../../../components/base/base.component";
import { FormBuilder, Validators } from "@angular/forms";
import { STATUS } from "../../../../../../constants/status";
import {
    DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import { isEmpty } from 'lodash';
import { HelperService } from "../../../../../../services/helper.service";

@Component({
    selector: 'thong-tin-quan-ly-bang-ke-can-hang',
    templateUrl: './thong-tin-quan-ly-bang-ke-can-hang.component.html',
    styleUrls: ['./thong-tin-quan-ly-bang-ke-can-hang.component.scss'],
})
export class ThongTinQuanLyBangKeCanHangComponent extends BaseComponent implements OnInit {
    @Input() id: number;
    @Input() isView: boolean;
    @Input() typeVthh: string;
    @Input() idQdGiaoNvNh: number;
    @Output()
    showListEvent = new EventEmitter<any>();

    @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
    isVisibleChangeTab$ = new Subject();
    visibleTab: boolean = false;

    userInfo: UserLogin;

    listSoQuyetDinh: any[] = [];
    listDiaDiemNhap: any[] = [];
    listSoPhieuNhapKho: any[] = [];
    dataTable: any[] = []
    rowItem: any = {};

    constructor(
        private fb: FormBuilder,
        private spinner: NgxSpinnerService,
        private donViService: DonviService,
        private danhMucService: DanhMucService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        public userService: UserService,
        private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
        private quanLyBangKeCanHangService: QuanLyBangKeCanHangService,
        private quanLyPhieuKiemTraChatLuongHangService: QuanLyPhieuKiemTraChatLuongHangService,
        private quanLyPhieuSoKhoService: QuanLyPhieuSoKhoService,
        private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
        private quanLyPhieuNhapKhoService: QuanLyPhieuNhapKhoService,
        private thongTinHopDongService: ThongTinHopDongService,
        public globals: Globals,
        private quyetDinhNhapXuatService: QuyetDinhGiaoNhapHangService,
        private helperService: HelperService,
    ) {
        super();
        this.formData = this.fb.group({
            id: [],
            nam: [dayjs().get('year')],
            maDvi: ['', [Validators.required]],
            maQhns: ['',],
            tenDvi: ['', [Validators.required]],
            soBangKe: [''],
            soPhieuNhapKho: [],
            ngayNhapKho: [],
            soLuongNhapKho: [],

            soQdGiaoNvNh: [],
            idQdGiaoNvNh: [],

            soHd: [''],
            ngayHd: [null,],

            idDdiemGiaoNvNh: [, [Validators.required]],
            maDiemKho: ['', [Validators.required]],
            tenDiemKho: ['', [Validators.required]],
            maNhaKho: ['', [Validators.required]],
            tenNhaKho: ['', [Validators.required]],
            maNganKho: ['', [Validators.required]],
            tenNganKho: ['', [Validators.required]],
            maLoKho: [''],
            tenLoKho: [''],

            loaiVthh: ['',],
            tenLoaiVthh: ['',],
            cloaiVthh: [''],
            tenCloaiVthh: [''],
            moTaHangHoa: [''],
            tenNguoiTao: [''],
            tenNguoiPduyet: [''],
            keToanTruong: [''],
            nguoiGiaoHang: [''],
            cmtNguoiGiaoHang: [''],
            donViGiaoHang: [''],
            diaChiNguoiGiao: [''],
            thoiGianGiaoNhan: [''],
            ghiChu: [''],

            trangThai: [],
            tenTrangThai: [],
            lyDoTuChoi: [],
        })
    }


    async ngOnInit() {
        await this.spinner.show();
        try {
            super.ngOnInit();
            this.userInfo = this.userService.getUserLogin();
            await Promise.all([
                this.loadSoQuyetDinh(),
            ]);
            if (this.id) {
                await this.loadChiTiet(this.id);
            } else {
                await this.initForm();
            }
            await this.spinner.hide();
        } catch (e) {
            console.log('error: ', e);
            await this.spinner.hide();
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
    }

    async loadChiTiet(id) {
        if (id > 0) {
            await this.spinner.show();

            let res = await this.quanLyBangKeCanHangService.getDetail(id);
            if (res.msg == MESSAGE.SUCCESS) {
                if (res.data) {
                    const data = res.data
                    this.helperService.bidingDataInFormGroup(this.formData, data);
                    await this.bindingDataQd(data.idQdGiaoNvNh);
                    let dataDdNhap = this.listDiaDiemNhap.filter(item => item.id == data.idDdiemGiaoNvNh)[0];
                    this.bindingDataDdNhap(dataDdNhap);
                    this.bindingDataPhieuNhapKho(data.soPhieuNhapKho.split("/")[0]);
                    this.dataTable = data.chiTiets;
                }
            }
            await this.spinner.hide();
        }
    }

    async initForm() {
        let res = await this.userService.getId("BANG_KE_CAN_HANG_LT_SEQ");
        this.formData.patchValue({
            soBangKe: `${res}/${this.formData.get('nam').value}/BKCH-CCDTVP`,
            maDvi: this.userInfo.MA_DVI,
            tenDvi: this.userInfo.TEN_DVI,
            maQhns: this.userInfo.DON_VI.maQhns,
            trangThai: STATUS.DU_THAO,
            tenTrangThai: 'Dự thảo',
            tenNguoiTao: this.userInfo.sub
        });
        if (this.idQdGiaoNvNh) {
            await this.bindingDataQd(this.idQdGiaoNvNh);
        }
    }

    async loadSoQuyetDinh() {
        let body = {
            "maDvi": this.userInfo.MA_DVI,
            "maVthh": this.typeVthh,
            "paggingReq": {
                "limit": this.globals.prop.MAX_INTERGER,
                "page": 0
            },
            "trangThai": STATUS.BAN_HANH,
            "namNhap": this.formData.get('nam').value
        }
        let res = await this.quyetDinhGiaoNhapHangService.search(body);
        if (res.msg == MESSAGE.SUCCESS) {
            let data = res.data;
            this.listSoQuyetDinh = data.content;
        } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
        }
    }

    async openDialogSoQd() {
        const modalQD = this.modal.create({
            nzTitle: 'Danh sách số quyết định kế hoạch giao nhiệm vụ nhập hàng',
            nzContent: DialogTableSelectionComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {
                dataTable: this.listSoQuyetDinh,
                dataHeader: ['Số quyết định', 'Ngày quyết định', 'Loại hàng hóa'],
                dataColumn: ['soQd', 'ngayQdinh', 'tenLoaiVthh'],
            },
        })
        modalQD.afterClose.subscribe(async (dataChose) => {
            if (dataChose) {
                await this.bindingDataQd(dataChose.id);
            }
        });
    };

    async bindingDataQd(id) {
        await this.spinner.show();
        let dataRes = await this.quyetDinhNhapXuatService.getDetail(id)
        const data = dataRes.data;
        this.formData.patchValue({
            soQdGiaoNvNh: data.soQd,
            idQdGiaoNvNh: data.id,
            ngayQdGiaoNvNh: data.ngayQdinh,
            loaiVthh: data.loaiVthh,
            cloaiVthh: data.cloaiVthh,
            tenLoaiVthh: data.tenLoaiVthh,
            tenCloaiVthh: data.tenCloaiVthh,
            moTaHangHoa: data.moTaHangHoa,
            soHd: data.soHd,
            ngayHd: data.hopDong.ngayKy,
            donGiaHd: data.hopDong.donGia
        });
        let dataChiCuc = data.dtlList.filter(item => item.maDvi == this.userInfo.MA_DVI);
        if (dataChiCuc.length > 0) {
            this.listDiaDiemNhap = dataChiCuc[0].children;
        }
        await this.spinner.hide();
    }

    openDialogDdiemNhapHang() {
        const modalQD = this.modal.create({
            nzTitle: 'Danh sách địa điểm nhập hàng',
            nzContent: DialogTableSelectionComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {
                dataTable: this.listDiaDiemNhap,
                dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho', 'Số lượng'],
                dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho', 'soLuong']
            },
        });
        modalQD.afterClose.subscribe(async (data) => {
            if (data) {
                this.bindingDataDdNhap(data, true);
            }
        });
    }

    bindingDataDdNhap(data, isDetail?) {
        this.dataTable = [];
        this.formData.patchValue({
            idDdiemGiaoNvNh: data.id,
            maDiemKho: data.maDiemKho,
            tenDiemKho: data.tenDiemKho,
            maNhaKho: data.maNhaKho,
            tenNhaKho: data.tenNhaKho,
            maNganKho: data.maNganKho,
            tenNganKho: data.tenNganKho,
            maLoKho: data.maLoKho,
            tenLoKho: data.tenLoKho,
        });
        if (isDetail) {
            this.formData.patchValue({
                soPhieuNhapKho: null,
                ngayNhapKho: null,
                nguoiGiaoHang: null,
                cmtNguoiGiaoHang: null,
                donViGiaoHang: null,
                diaChiNguoiGiao: null,
                thoiGianGiaoNhan: null,
            });
        }
        this.listSoPhieuNhapKho = data.listPhieuNhapKho.filter(item => (item.trangThai == STATUS.DU_THAO && isEmpty(item.bangKeCanHang)));
    }

    openDialogSoPhieuNhapKho() {
        const modalQD = this.modal.create({
            nzTitle: 'Danh sách số phiếu nhập kho',
            nzContent: DialogTableSelectionComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {
                dataTable: this.listSoPhieuNhapKho,
                dataHeader: ['Số phiếu nhập kho', 'Số phiếu kiểm tra chất lượng'],
                dataColumn: ['soPhieuNhapKho', 'soPhieuKtraCl']
            },
        });
        modalQD.afterClose.subscribe(async (data) => {
            if (data) {
                await this.bindingDataPhieuNhapKho(data.id);
            }
        });
    }

    async bindingDataPhieuNhapKho(id) {
        let res = await this.quanLyPhieuNhapKhoService.getDetail(id);
        if (res.msg == MESSAGE.SUCCESS) {
            const data = res.data;
            this.formData.patchValue({
                soPhieuNhapKho: data.soPhieuNhapKho,
                ngayNhapKho: data.ngayTao,
                nguoiGiaoHang: data.nguoiGiaoHang,
                cmtNguoiGiaoHang: data.cmtNguoiGiaoHang,
                donViGiaoHang: data.donViGiaoHang,
                diaChiNguoiGiao: data.diaChiNguoiGiao,
                thoiGianGiaoNhan: data.thoiGianGiaoNhan,
                soLuongNhapKho: data.hangHoaList[0].soLuongThucNhap
            });
        }
    }


    isDisableField() {
        // if (this.detail && (this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP || this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.detail.trangThai == this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC)) {
        //   return true;
        // }
    }

    convertTien(tien: number): string {
        return convertTienTobangChu(tien);
    }

    deleteRow(data: any) {

    }

    editRow(stt: number) {
    }

    addRow() {
        if (this.validateDataRow()) {
            this.dataTable = [...this.dataTable, this.rowItem];
            this.rowItem = {};
        }
    }

    validateDataRow() {
        if (this.rowItem.maCan && this.rowItem.trongLuongBaoBi && this.rowItem.trongLuongCaBaoBi) {
            let tongTrongLuong = this.calcTong('trongLuongCaBaoBi');
            if (tongTrongLuong + this.rowItem.trongLuongCaBaoBi > this.formData.value.soLuongNhapKho) {
                this.notification.error(MESSAGE.ERROR, "Trọng lượng bao bì không được vượt quá số lượng nhập kho");
                return false
            }
            return true;
        } else {
            this.notification.error(MESSAGE.ERROR, "Vui lòng nhập đủ thông tin");
            return false
        }
    }

    cancelEdit(stt: number): void {

    }

    saveEdit(stt: number): void {

    }

    clearItemRow() {
        this.rowItem = {};
    }

    pheDuyet() {
        let trangThai = ''
        let mess = ''
        switch (this.formData.get('trangThai').value) {
            case STATUS.TU_CHOI_LDCC:
            case STATUS.DU_THAO: {
                trangThai = STATUS.CHO_DUYET_LDCC;
                mess = 'Bạn có muối gửi duyệt ?'
                break;
            }
            case STATUS.CHO_DUYET_LDCC: {
                trangThai = STATUS.DA_DUYET_LDCC;
                mess = 'Bạn có chắc chắn muốn phê duyệt ?'
                break;
            }
        }
        this.modal.confirm({
            nzClosable: false,
            nzTitle: 'Xác nhận',
            nzContent: mess,
            nzOkText: 'Đồng ý',
            nzCancelText: 'Không',
            nzOkDanger: true,
            nzWidth: 500,
            nzOnOk: async () => {
                this.spinner.show();
                try {
                    let body = {
                        id: this.id,
                        trangThai: trangThai,
                    };
                    let res =
                        await this.quanLyBangKeCanHangService.approve(
                            body,
                        );
                    if (res.msg == MESSAGE.SUCCESS) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
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

    tuChoi() {
        const modalTuChoi = this.modal.create({
            nzTitle: 'Từ chối',
            nzContent: DialogTuChoiComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {},
        });
        modalTuChoi.afterClose.subscribe(async (text) => {
            if (text) {
                this.spinner.show();
                try {
                    let body = {
                        id: this.id,
                        lyDoTuChoi: text,
                        trangThai: STATUS.TU_CHOI_LDCC,
                    };
                    let res =
                        await this.quanLyBangKeCanHangService.approve(
                            body,
                        );
                    if (res.msg == MESSAGE.SUCCESS) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
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
            }
        });
    }

    huyBo() {
        this.modal.confirm({
            nzClosable: false,
            nzTitle: 'Xác nhận',
            nzContent: 'Bạn có chắc chắn muốn hủy bỏ các thao tác đang làm?',
            nzOkText: 'Đồng ý',
            nzCancelText: 'Không',
            nzOkDanger: true,
            nzWidth: 310,
            nzOnOk: () => {
                this.back();
            },
        });
    }

    back() {
        this.showListEvent.emit();
    }

    async save(isGuiDuyet: boolean) {
        if (this.validateSave()) {
            this.spinner.show();
            try {
                this.helperService.markFormGroupTouched(this.formData);
                if (this.formData.invalid) {
                    await this.spinner.hide();
                    return;
                }
                let body = this.formData.value;
                body.chiTiets = this.dataTable;
                let res;
                if (this.formData.get('id').value > 0) {
                    res = await this.quanLyBangKeCanHangService.update(body);
                } else {
                    res = await this.quanLyBangKeCanHangService.create(body);
                }
                if (res.msg == MESSAGE.SUCCESS) {
                    if (isGuiDuyet) {
                        await this.spinner.hide();
                        this.id = res.data.id;
                        this.pheDuyet();
                    } else {
                        if (this.formData.get('id').value) {
                            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
                            this.back();
                        } else {
                            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                            this.back();
                        }
                        await this.spinner.hide();
                    }
                } else {
                    this.notification.error(MESSAGE.ERROR, res.msg);
                    await this.spinner.hide();
                }
                this.spinner.hide();
            } catch (e) {
                console.log('error: ', e);
                this.spinner.hide();
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        }
    }

    validateSave() {
        let tongTrongLuong = this.calcTong('trongLuongCaBaoBi');
        if (tongTrongLuong != this.formData.value.soLuongNhapKho) {
            this.notification.error(MESSAGE.ERROR, "Tổng trọng lượng bao bì của bảng kê đang không đủ số lượng nhập kho")
            return false;
        }
        return true;
    }

    print() {

    }

    thongTinTrangThai(trangThai: string): string {
        return thongTinTrangThaiNhap(trangThai);
    }


    calcTong(columnName) {
        if (this.dataTable) {
            const sum = this.dataTable.reduce((prev, cur) => {
                prev += cur[columnName];
                return prev;
            }, 0);
            return sum;
        }
    }
}
