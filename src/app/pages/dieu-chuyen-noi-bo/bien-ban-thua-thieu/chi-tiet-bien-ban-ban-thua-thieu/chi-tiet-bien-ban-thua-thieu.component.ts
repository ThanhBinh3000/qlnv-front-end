import { BienBanThuThieuService } from './../bien-ban-thua-thieu.service';
import { chain, cloneDeep, includes } from 'lodash';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { StorageService } from 'src/app/services/storage.service';
import { HttpClient } from '@angular/common/http';
import { STATUS } from 'src/app/constants/status';
import { MESSAGE } from 'src/app/constants/message';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { DonviService } from 'src/app/services/donvi.service';
import { QuyetDinhDieuChuyenCucService } from 'src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-c.service';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { DialogTableCheckBoxComponent } from 'src/app/components/dialog/dialog-table-check-box/dialog-table-check-box.component';
import { BaoCaoDieuChuyenService } from '../../bao-cao-dieu-chuyen/bao-cao/bao-cao.service';
@Component({
    selector: 'app-chi-tiet-bien-ban-thua-thieu',
    templateUrl: './chi-tiet-bien-ban-thua-thieu.component.html',
    styleUrls: ['./chi-tiet-bien-ban-thua-thieu.component.scss']
})
export class ChiTietBienBanThuaThieuComponent extends Base2Component implements OnInit {
    @Input() idInput: number;
    @Input() isView: boolean;
    @Input() isViewOnModal: boolean;
    @Input() loaiBc: string;
    @Input() passData: { soQdDcCuc: string, qdDcCucId: number, ngayKyQd: string, soBc: string, bcKetQuaDcId: number, tenBc: string, ngayBc: string, maDviNhan: string };
    @Output()
    showListEvent = new EventEmitter<any>();
    expandSetString = new Set<string>();
    dataView: any[] = [];
    listSoQuyetDinh: any[] = [];
    TRANG_THAI: { [key: string]: string } = {
        [STATUS.DU_THAO]: "Dự thảo",
        [STATUS.DA_HOAN_THANH]: "Hoàn thành",
    };
    danhSachKetQua: any[] = [];
    listBaoCaoChiCuc: any[] = [];
    initialAllChecked: boolean = true;
    allChecked: boolean = true;
    tongKinhPhiDcQd: number = 0;
    tongKinhPhiXuatDcTt: number = 0;
    tongKinhPhiNhapDcTt: number = 0;
    tongKinhPhiChenhLech: number = 0;
    canBoThamGia: { [key: string]: string } = {};
    canBoThamGiaClone: { [key: string]: string } = {};
    listDaiDien: any[] = [
        {
            value: "Đại diện Chi cục DTNN KV", text: "Đại diện Chi cục DTNN KV"

        }, {
            value: "Đại diện Cục DTNN KV", text: "Đại diện Cục DTNN KV"
        }
    ]
    hasThuaThieu: boolean = false;
    constructor(
        httpClient: HttpClient,
        storageService: StorageService,
        notification: NzNotificationService,
        spinner: NgxSpinnerService,
        modal: NzModalService,
        private baoCaoDieuChuyenService: BaoCaoDieuChuyenService,
        private donviService: DonviService,
        private quyetDinhDieuChuyenCucService: QuyetDinhDieuChuyenCucService,
        private bienBanThuThieuService: BienBanThuThieuService
    ) {
        super(httpClient, storageService, notification, spinner, modal, bienBanThuThieuService);
        this.formData = this.fb.group({
            id: [0],
            nam: [dayjs().get('year'), [Validators.required]],
            tenDvi: [, [Validators.required]],
            maDvi: [, [Validators.required]],
            maDviNhan: [, [Validators.required]],
            tenCanBo: [, [Validators.required]],
            ngayLap: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
            canBoId: [, [Validators.required]],
            soBb: ['', [Validators.required]],
            soBcKetQuaDc: ['', [Validators.required]],
            bcKetQuaDcId: ['', [Validators.required]],
            ngayLapBcKetQuaDc: [, [Validators.required]],
            soQdDcCuc: ['', [Validators.required]],
            qdDcCucId: [, [Validators.required]],
            ngayKyQdCuc: [, [Validators.required]],
            trangThai: ['00'],
            nguyenNhan: [],
            kienNghi: [],
            ghiChu: [],
            fileDinhKems: [new Array()],
            fileBienBanHaoDois: [new Array()],
            banKiemKe: [new Array()],
            tenBaoCao: [, [Validators.required]]
        })
    }

    async ngOnInit(): Promise<void> {
        try {
            this.spinner.show();
            await this.loadDetail(this.idInput)
        } catch (error) {
            console.log('e', error)
        }
        finally {
            this.spinner.hide()
        }
    }
    async loadDetail(id: number): Promise<void> {
        if (id) {
            const res = await this.bienBanThuThieuService.getDetail(id);
            if (res.msg === MESSAGE.SUCCESS) {
                this.formData.patchValue({ ...res.data });
                this.danhSachKetQua = res.data.chiTiet;
            }

            this.buildTableView();
        }
        else {
            this.formData.patchValue({
                maDvi: this.userInfo.MA_DVI,
                tenDvi: this.userInfo.TEN_DVI,
                tenCanBo: this.userInfo.TEN_DAY_DU,
                canBoId: this.userInfo.ID,
                soBcKetQuaDc: this.passData.soBc,
                ngayLapBcKetQuaDc: this.passData.ngayBc,
                soQdDcCuc: this.passData.soQdDcCuc,
                qdDcCucId: this.passData.qdDcCucId,
                ngayKyQdCuc: this.passData.ngayKyQd,
                bcKetQuaDcId: this.passData.bcKetQuaDcId,
                tenBaoCao: this.passData.tenBc,
                maDviNhan: this.passData.maDviNhan

            })
            if (this.passData.bcKetQuaDcId) {
                this.getChiTietBaoCao(this.passData.bcKetQuaDcId)
            }
        }
    }
    async loadSoQuyetDinh() {
        let body = {
            trangThai: STATUS.BAN_HANH,
            maDvi: this.userInfo.MA_DVI,
            // listTrangThaiXh: [STATUS.CHUA_THUC_HIEN, STATUS.DANG_THUC_HIEN],
        }
        try {
            let res = await this.quyetDinhDieuChuyenCucService.getDsSoQuyetDinhDieuChuyenChiCuc(body);
            if (res.msg == MESSAGE.SUCCESS) {
                let data = res.data;
                this.listSoQuyetDinh = Array.isArray(data) ? data.reduce((arr, cur) => {
                    if (arr.findIndex(f => f.soQdinh == cur.soQdinh) < 0) {
                        arr.push(cur)
                    }
                    return arr
                }, []) : [];
            } else {
                this.notification.error(MESSAGE.ERROR, res.msg);
            }
        } catch (error) {
            console.log("error", error)
        }
    }
    async openDialogSoQd() {
        if (this.isView) return;
        await this.loadSoQuyetDinh();
        const modalQD = this.modal.create({
            nzTitle: 'DANH SÁCH QUYẾT ĐỊNH XUẤT ĐIỀU CHUYỂN HÀNG HÓA',
            nzContent: DialogTableSelectionComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {
                dataTable: this.listSoQuyetDinh,
                // dataHeader: ['Số quyết định', 'Ngày quyết định', 'Loại hàng hóa'],
                // dataColumn: ['soQdinh', 'ngayKyQdinh', 'tenLoaiVthh'],
                dataHeader: ['Số quyết định', 'Ngày ký quyết định'],
                dataColumn: ['soQdinh', 'ngayKyQdinh'],
            },
        })
        modalQD.afterClose.subscribe(async (data) => {
            if (data) {
                this.bindingDataQd(data)
            }
        });
    };
    bindingDataQd(data: any) {
        this.formData.patchValue({
            soQdDcCuc: data.soQdinh,
            ngayKyQdCuc: data.ngayKyQdinh,
            qdDcCucId: data.id
        })
    };

    async loadListBaoCaoChiCuc() {
        try {
            const body = {
                soQdinhCuc: this.formData.value.soQdDcCuc,
                trangThai: STATUS.DA_HOAN_THANH
            }
            const res = await this.baoCaoDieuChuyenService.danhSach(body);
            if (res.msg === MESSAGE.SUCCESS) {
                this.listBaoCaoChiCuc = Array.isArray(res.data) ? res.data : [];
            }
            return this.listBaoCaoChiCuc
        } catch (error) {
            console.log("e", error)
        }
    }
    async openDialogSoBc() {
        if (this.isView) return;
        if (!this.formData.value.soQdDcCuc) {
            return this.notification.error(MESSAGE.ERROR, "Chưa có quyết định nào được chọn.")
        }
        await this.loadListBaoCaoChiCuc();
        const modalQD = this.modal.create({
            nzTitle: 'CHỌN BÁO CÁO TỪ CHI CỤC GỬI LÊN',
            nzContent: DialogTableSelectionComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {
                dataTable: this.listBaoCaoChiCuc,
                // dataHeader: ['Số quyết định', 'Ngày quyết định', 'Loại hàng hóa'],
                // dataColumn: ['soQdinh', 'ngayKyQdinh', 'tenLoaiVthh'],
                dataHeader: ['Tên báo cáo', 'Số báo cáo', 'Đơn vị gửi'],
                dataColumn: ['tenBc', 'soBc', 'tenDvi']
            }
        })
        modalQD.afterClose.subscribe(async (data) => {
            if (data) {
                this.bindingDataBaoCao(data)
            }
        });
    };
    bindingDataBaoCao(data: any) {
        this.formData.patchValue({
            soBcKetQuaDc: data.soBc,
            tenBaoCao: data.tenBc,
            ngayLapBcKetQuaDc: data.ngayBc,
            bcKetQuaDcId: data.id,
            maDviNhan: data.maDviNhan
        })
        // this.danhSachKetQua = Array.isArray(data.danhSachKetQua) ? cloneDeep(data.danhSachKetQua) : [];
        if (data.id) {
            this.getChiTietBaoCao(data.id)
        }
    }
    async getChiTietBaoCao(id: number) {
        const data = await this.baoCaoDieuChuyenService.getDetail(id);
        this.danhSachKetQua = Array.isArray(data?.data?.danhSachKetQua) ? cloneDeep(data.data.danhSachKetQua) : [];
        this.buildTableView();
        this.checkThuaThieu(this.danhSachKetQua);
    }
    checkThuaThieu(list: any[]) {
        this.hasThuaThieu = list.some(f => f.tinhTrang);
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
    buildTableView() {
        let dataView = Array.isArray(this.danhSachKetQua) ?
            chain(this.danhSachKetQua.map(f => ({ ...f, keyGroup: `${f.cloaiVthh}${f.maLoKho ? f.maLoKho + f.maNganKho : f.maNganKho}` }))).groupBy("keyGroup").map((rs, i) => {
                const dataSoQdinh = rs.find(f => f.keyGroup == i);
                const { sumSlNhapTt, sumKinhPhiNhapTt } = dataSoQdinh && Array.isArray(rs) ? rs.reduce((obj, cur) => {
                    obj.sumSlNhapTt += cur.slNhapTt;
                    obj.sumKinhPhiNhapTt += cur.kinhPhiNhapTt;
                    return obj;
                }, { sumSlNhapTt: 0, sumKinhPhiNhapTt: 0 }) : { sumSlNhapTt: 0, sumKinhPhiNhapTt: 0 };
                const slChenhLech = dataSoQdinh ? dataSoQdinh.slXuatTt - sumSlNhapTt : 0;
                const kinhPhiChenhLech = dataSoQdinh ? dataSoQdinh.kinhPhiXuatTt + sumKinhPhiNhapTt - dataSoQdinh.kinhPhiTheoQd : 0;
                return {
                    ...dataSoQdinh,
                    idVirtual: uuidv4(),
                    childData: dataSoQdinh ? rs : [],
                    sumKinhPhiNhapTt,
                    slChenhLech,
                    kinhPhiChenhLech
                }
            }).value() : [];
        this.dataView = cloneDeep(dataView);
        this.expandAll();
        const { tongKinhPhiDcQd, tongKinhPhiXuatDcTt, tongKinhPhiNhapDcTt, tongKinhPhiChenhLech } = Array.isArray(this.dataView) ? this.dataView.reduce((obj, cur) => {
            obj.tongKinhPhiDcQd += Number(cur.kinhPhiTheoQd);
            obj.tongKinhPhiXuatDcTt += Number(cur.kinhPhiXuatTt);
            obj.tongKinhPhiNhapDcTt += Number(cur.sumKinhPhiNhapTt);
            obj.tongKinhPhiChenhLech += Number(cur.kinhPhiChenhLech)
            return obj
        }, { tongKinhPhiDcQd: 0, tongKinhPhiXuatDcTt: 0, tongKinhPhiNhapDcTt: 0, tongKinhPhiChenhLech: 0 }) : { tongKinhPhiDcQd: 0, tongKinhPhiXuatDcTt: 0, tongKinhPhiNhapDcTt: 0, tongKinhPhiChenhLech: 0 };
        this.tongKinhPhiDcQd = tongKinhPhiDcQd;
        this.tongKinhPhiXuatDcTt = tongKinhPhiXuatDcTt;
        this.tongKinhPhiNhapDcTt = tongKinhPhiNhapDcTt;
        this.tongKinhPhiChenhLech = tongKinhPhiChenhLech;
    }
    async save(isGuiDuyet: boolean): Promise<void> {
        try {
            await this.spinner.show();
            this.setValidator(isGuiDuyet);
            let body = this.formData.value;
            body.chiTiet = this.danhSachKetQua;
            let data = await this.createUpdate(body);
            if (!data) return;
            this.formData.patchValue({ id: data.id, soBb: data.soBb, trangThai: data.trangThai })
            if (isGuiDuyet) {
                // this.pheDuyet();
                this.hoanThanh();
            }
        } catch (error) {
            console.log("error", error)
        } finally {
            await this.spinner.hide();

        }
    }
    async pheDuyet(): Promise<void> {
        let trangThai = '';
        let mess = '';
        switch (this.formData.get('trangThai').value) {
            case STATUS.TU_CHOI_TP:
            case STATUS.TU_CHOI_LDC:
            case STATUS.DU_THAO: {
                trangThai = STATUS.CHO_DUYET_TP;
                mess = 'Bạn có muốn gửi duyệt ?'
                break;
            }
            case STATUS.CHO_DUYET_TP: {
                trangThai = STATUS.CHO_DUYET_LDC;
                mess = 'Bạn có chắc chắn muốn phê duyệt ?'
                break;
            }
            case STATUS.CHO_DUYET_LDC: {
                trangThai = STATUS.DA_DUYET_LDC;
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
            nzWidth: 310,
            nzOnOk: async () => {
                this.spinner.show();
                try {
                    let body = {
                        id: this.formData.value.id,
                        trangThai: trangThai
                    };
                    let res =
                        await this.bienBanThuThieuService.approve(
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
    async tuChoi(): Promise<void> {
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
                        id: this.formData.value.id,
                        lyDoTuChoi: text,
                        trangThai: STATUS.TU_CHOI_LDCC,
                    };
                    let res =
                        await this.bienBanThuThieuService.approve(
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
                        await this.bienBanThuThieuService.hoanThanh(
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
    checkRoleReject(): boolean {
        const { trangThai } = this.formData.value;
        return this.userService.isCuc() && [STATUS.CHO_DUYET_TP, STATUS.CHO_DUYET_LDC].includes(trangThai)
    }
    checkRoleDuyet(): boolean {
        const { trangThai } = this.formData.value;
        return this.userService.isCuc() && [STATUS.CHO_DUYET_TP, STATUS.CHO_DUYET_LDC].includes(trangThai)
    }
    setValidator(isGuiDuyet: boolean) {

    }
    quayLai() {
        this.showListEvent.emit();
    }
    checkLoaiBc(loaiBc: string): boolean {
        if (this.loaiBc === loaiBc) {
            return true
        };
        return false
    }
    checkRoleHoanThanh() {
        if (!this.isViewOnModal && this.formData.value.trangThai === STATUS.DU_THAO && this.hasThuaThieu) {
            return true
        }
        return false
    }
    ///
    addRow() {
        if (Object.keys(this.canBoThamGia).length > 0) {
            this.formData.patchValue({ banKiemKe: this.formData.value.banKiemKe.concat(this.canBoThamGia) });
            this.canBoThamGia = {};
        }
    };
    clearRow() {
        this.canBoThamGia = {}
    };
    editRow(index: number): void {
        const banKiemKe = this.formData.value.banKiemKe.map((f, i) => {
            if (i === index) {
                return { ...f, isEdit: true }
            } else {
                if (f.isEdit) {
                    return { ...this.canBoThamGiaClone, isEdit: false }
                } else {
                    return { ...f }
                }
            }
        });
        this.formData.patchValue({
            banKiemKe
        })
        Object.assign(this.canBoThamGiaClone, banKiemKe[index])
    };
    deleteRow(index: number): void {
        const banKiemKe = this.formData.value.banKiemKe;
        banKiemKe.splice(index, 1)
        this.formData.patchValue({ banKiemKe })
    }
    saveRow(index: number): void {
        const banKiemKe = this.formData.value.banKiemKe.map(f => ({ ...f, isEdit: false }));
        this.formData.patchValue({ banKiemKe })
    }
    cancelRow(index: number): void {
        const banKiemKe = this.formData.value.banKiemKe.map((f, i) => {
            if (i === index) {
                return { ...this.canBoThamGiaClone, isEdit: false }
            }
            return { ...f, isEdit: false }
        });
        this.formData.patchValue({ banKiemKe })
    }
}
