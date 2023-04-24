import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators } from "@angular/forms";
import { UserLogin } from "../../../../models/userlogin";
import { DiaDiemGiaoNhan, KeHoachBanDauGia, PhanLoTaiSan } from "../../../../models/KeHoachBanDauGia";
import { DatePipe } from "@angular/common";
import { DiaDiemNhapKho } from "../../../../models/CuuTro";
import {
    ModalInput
} from "../../../xuat/xuat-cuu-tro-vien-tro/xuat-cuu-tro/xay-dung-phuong-an/thong-tin-xay-dung-phuong-an/thong-tin-xay-dung-phuong-an.component";
import { Base2Component } from "../../../../components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { DanhMucService } from "../../../../services/danhmuc.service";
import { DeXuatKeHoachBanDauGiaService } from "../../../../services/deXuatKeHoachBanDauGia.service";
import { DonviService } from "../../../../services/donvi.service";
import { TinhTrangKhoHienThoiService } from "../../../../services/tinhTrangKhoHienThoi.service";
import { DanhMucTieuChuanService } from "../../../../services/quantri-danhmuc/danhMucTieuChuan.service";
import {
    DeXuatPhuongAnCuuTroService
} from "../../../../services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/DeXuatPhuongAnCuuTro.service";
import { QuanLyHangTrongKhoService } from "../../../../services/quanLyHangTrongKho.service";
import * as dayjs from "dayjs";
import { FileDinhKem } from "../../../../models/DeXuatKeHoachuaChonNhaThau";
import { MESSAGE } from "../../../../constants/message";
import { STATUS } from "src/app/constants/status";
import { chain, cloneDeep } from 'lodash';
import * as uuid from "uuid";
import { Utils } from 'src/app/Utility/utils';
import { TongHopDieuChuyenService } from '../tong-hop-dieu-chuyen-tai-cuc.service';
@Component({
    selector: 'app-chi-tiet-tong-hop-dieu-chuyen-tai-cuc',
    templateUrl: './chi-tiet-tong-hop-tai-cuc.component.html',
    styleUrls: ['./chi-tiet-tong-hop-tai-cuc.component.scss']
})
export class ChiTietTongHopDieuChuyenTaiCuc extends Base2Component implements OnInit {
    @Input() loaiVthhInput: string;
    @Input() idInput: number;
    @Input() isView: boolean;
    @Input() isViewOnModal: boolean;
    @Input() isViewDetail: boolean;
    @Input() isEdit: boolean;
    @Input() isAddNew: boolean
    @Output()
    showListEvent = new EventEmitter<any>();

    formData: FormGroup;
    cacheData: any[] = [];
    fileDinhKem: any[] = [];
    userLogin: UserLogin;
    titleStatus: string = '';
    titleButtonDuyet: string = '';
    iconButtonDuyet: string = '';
    errorInputRequired: string = 'Dữ liệu không được để trống.';
    userInfo: UserLogin;
    expandSet = new Set<number>();
    STATUS = STATUS;
    datePipe = new DatePipe('en-US');
    expandSetString = new Set<string>();
    tableView = [];
    tableRow: any = {};
    isVisible = false;
    isVisibleSuaNoiDung = false;
    listNoiDung = [];
    errorInputComponent: any[] = [];
    disableInputComponent: ModalInput = new ModalInput();
    Utils = Utils;
    FORMAT_DATE_TIME_STR = Utils.FORMAT_DATE_TIME_STR;

    maHauTo: string;
    isTongHop: boolean = false;
    yeuCauSuccess: boolean = false;
    capNhatAllSuccess: boolean = false;

    idKeHoachDC: any = null;
    isViewKeHoachDC: boolean = false;
    tongDuToanChiPhi: number = 0;

    tongHopData: any[] = [];

    dataTable2ChiCuc: any[];
    dataTable2Cuc: any[];
    dataCuc: any[];

    constructor(httpClient: HttpClient,
        storageService: StorageService,
        notification: NzNotificationService,
        spinner: NgxSpinnerService,
        modal: NzModalService,
        private danhMucService: DanhMucService,
        private deXuatKeHoachBanDauGiaService: DeXuatKeHoachBanDauGiaService,
        private donViService: DonviService,
        private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
        private dmTieuChuanService: DanhMucTieuChuanService,
        private deXuatPhuongAnCuuTroService: DeXuatPhuongAnCuuTroService,
        private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,
        private tongHopDieuChuyenService: TongHopDieuChuyenService,
        private cdr: ChangeDetectorRef,) {
        super(httpClient, storageService, notification, spinner, modal, tongHopDieuChuyenService);
        this.formData = this.fb.group(
            {
                id: [''],
                trangThai: [''],
                idQdPd: [''],
                soQdPd: [''],
                ngayGduyet: [''],
                nguoiGduyetId: [''],
                ngayPduyet: [''],
                nguoiPduyetId: [''],
                lyDoTuChoi: [''],
                tenTrangThai: [''],

                maTongHop: [''],
                soCongVan: [''],
                ngayTaoDeXuat: [dayjs().format('YYYY-MM-DD')],
                trichYeu: [''],
                ngayTrinhTc: [''],

                namKeHoach: [dayjs().get('year'), Validators.required],
                loaiDieuChuyen: ['ALL', Validators.required],
                thoiGianTongHop: ['']
            }
        );
        this.userInfo = this.userService.getUserLogin();
        this.maHauTo = '/' + this.userInfo.MA_TCKT;
    }

    async ngOnInit() {

        if (this.isEdit || this.isViewDetail) {
            this.isTongHop = true
        };
        await this.initData();
        try {
            this.spinner.show();
            //this.loadDonVi();
            await Promise.all([
            ])

            // await this.loadDetail(this.idInput)
            if (this.formData.value.id) {
                await this.detail(this.formData.value.id)
            }
            // await Promise.all([this.loaiVTHHGetAll(), this.loaiHopDongGetAll()]);
            this.spinner.hide();
        } catch (e) {
            this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
            this.spinner.hide();
        } finally {
            this.spinner.hide();
        }
    };
    async initData() {
        this.formData.controls["id"].setValue(this.idInput)
    };


    // async loadDetail(idInput: number) {
    //     if (idInput > 0) {
    //         await this.tongHopDieuChuyenService.getDetail(idInput)
    //             .then(async (res) => {
    //                 if (res.msg == MESSAGE.SUCCESS) {
    //                     this.maHauTo = '/' + res.data.soDx.split("/")[1];
    //                     res.data.soDx = res.data.soDx.split("/")[0];
    //                     this.formData.patchValue(res.data);
    //                     this.formData.value.deXuatPhuongAn.forEach(s => s.idVirtual = uuid.v4());
    //                     // this.buildTableView();
    //                 }
    //             })
    //             .catch((e) => {
    //                 console.log('error: ', e);
    //                 this.spinner.hide();
    //                 this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    //             });
    //     } else {
    //         this.formData.patchValue({
    //             maDvi: this.userInfo.MA_DVI,
    //             tenDvi: this.userInfo.TEN_DVI,
    //             maDviCuc: this.userInfo.MA_DVI?.slice(0, -2)
    //         });
    //     }

    // }
    setExpand(parantExpand: boolean = false, children: any = []): void {
        if (parantExpand) {
            return children.map(f => ({ ...f, expand: false }))
        }
        return children
    }
    mapExpanData = (list: any[] = [], key: string = "children") => {
        let result = list.map(f => {
            if (Array.isArray(f[key]) && f[key].length > 0) {
                return { ...f, expand: true, [key]: this.mapExpanData(f[key], key) }
            }
            return { ...f }
        });
        return result;
    }
    handleChangeLoaiDC = (value) => {
        this.isTongHop = false;
        this.formData.patchValue({ thoiGianTongHop: '' })
    }
    yeuCauChiCucNhan = ($event) => {
        $event.stopPropagation();
        //call api yêu cầu chi cục xác định điểm nhập
        this.formData.controls["trangThai"].setValue("00");
        this.formData.controls["tenTrangThai"].setValue("Dự thảo");
        this.yeuCauSuccess = true;
        const body = this.formData.value;
        let res;
        if (body.id) {
            res = this.tongHopDieuChuyenService.capNhatTHCuc(body)
        } else {
            res = this.tongHopDieuChuyenService.themTHCuc(body)
        }
        if (res.msg == MESSAGE.SUCCESS) {
            if (body.id) {
                this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            } else {
                this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                // this.formData.reset();
            }
        } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
        }
    }
    expandAll() {
        // this.phuongAnView.forEach(s => {
        //     this.expandSetString.add(s.idVirtual);
        // })
    }

    onExpandStringChange(id: string, checked: boolean): void {
        if (checked) {
            this.expandSetString.add(id);
        } else {
            this.expandSetString.delete(id);
        }
    }

    quayLai() {
        this.showListEvent.emit();
    }


    async selectRow(item: any) {
        if (this.dataCuc.length > 0) {
            this.dataCuc.forEach(i => i.selected = false);
            item.selected = true;
            //   this.idHopDong = cloneDeep(item.id);
            //   this.isView = true;
        }
    }


    handleOk(): void {

    }

    handleCancel(): void {
        this.isVisible = false;
        //clean
        this.errorInputComponent = [];
        // this.phuongAnRow = {}
        // this.listChiCuc = []
        this.disableInputComponent = new ModalInput();
    }
    async save(isGuiDuyet: boolean) {
        await this.spinner.show();
        this.setValidator(isGuiDuyet)
        let body = this.formData.value;
        if (this.formData.value.soQd) {
            // body.soQd = this.formData.value.soQd + "/" + this.maQd;
        }
        body.fileDinhKems = this.fileDinhKem;
        let data;
        if (body.id) {
            data = this.tongHopDieuChuyenService.capNhatTHCuc(body)
        }
        else {
            data = await this.tongHopDieuChuyenService.themTHCuc(body)
        }
        if (data) {
            if (isGuiDuyet) {
                this.approve(data.id, STATUS.CHO_DUYET_TP, "Bạn có chắc chắn muốn gửi duyệt?");
            } else {
                this.quayLai();
            }
        }
        await this.spinner.hide();
    }
    async tongHop() {
        this.yeuCauSuccess = false;
        // const data = await this.createUpdate({ loaiDieuChuyen: this.formData.value.loaiDieuChuyen });
        // if (data) {
        //     this.tongHopData = Array.isArray(data) ? data : [];
        // }
        this.setValidator(false);
        try {
            if (this.formData.valid) {
                this.isTongHop = true;
                const thoiGianTongHop = dayjs().format("YYYY-MM-DD HH:mm:ss");
                this.formData.patchValue({ thoiGianTongHop: thoiGianTongHop })
                // call api tổng hợp dữ liệu;
                const body = {
                    namKeHoach: this.formData.value.namKeHoach,
                    loaiDieuChuyen: this.formData.value.loaiDieuChuyen,
                    thoiGianTongHop: this.formData.value.thoiGianTongHop

                }
                this.spinner.show();
                const data = await this.tongHopDieuChuyenService.lapKeHoach(body);
                if (data.msg == MESSAGE.SUCCESS) {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
                } else {
                    this.notification.error(MESSAGE.ERROR, data.msg);
                }

                this.tongHopData = cloneDeep(data);
                this.convertTongHop(this.tongHopData)
            } else {
                Object.values(this.formData.controls).forEach(control => {
                    control.markAsDirty();
                    control.updateValueAndValidity({ onlySelf: true });
                });
            }
        } catch (error) {
            console.log("error", error)
        }
        finally {
            this.spinner.hide()
        }

    }
    convertTongHop(data) {
        const data2ChiCuc = ["ALL", "CUC"].includes(this.formData.value.loaiDieuChuyen) ? data.data : [];
        this.dataCuc = this.formData.value.loaiDieuChuyen === "ALL" ? data.otherData : this.formData.value.loaiDieuChuyen == "CUC" ? data.data : [];
        const buildData2ChiCuc = this.buildTableView(data2ChiCuc?.reduce((arr, cur) => {
            return arr.concat(cur.dcnbKeHoachDcDtls.map(f => ({ ...f, maChiCucDxuat: cur.maChiCucDxuat, tenChiCucDxuat: cur.tenChiCucDxuat })))
        }, []));
        this.dataTable2ChiCuc = this.mapExpanData(buildData2ChiCuc, "children");
        this.dataTable2Cuc = this.mapExpanData(this.dataCuc?.map(f => ({ ...f, duToanKphi: f.dcnbKeHoachDcDtls.reduce((sum, cur) => sum += cur.duToanKphi, 0) })), "dcnbKeHoachDcDtls");
        console.log("dataTable2Cuc", this.dataTable2Cuc)
    }
    // buildTableView(data) {
    //     let dataView = chain(data)
    //         .groupBy("maChiCucDxuat")
    //         .map((value, key) => {
    //             let rs = chain(value)
    //                 .groupBy("maDiemKho")
    //                 .map((v, k) => {
    //                     let rss = chain(v)
    //                         .groupBy("maLoKho")
    //                         .map((vs, ks) => {
    //                             let maLoKho = vs.find(s => s.maLoKho === ks);
    //                             let khoNhan = vs.filter(item => !(item.maDiemKhoNhan == undefined || item.maDiemKhoNhan == ""));
    //                             let rsss = chain(khoNhan)
    //                                 .groupBy("maNhaKhoNhan")
    //                                 .map((vss, kss) => {
    //                                     let maNhaKhoNhan = vss.find(s => s.maNhaKhoNhan === kss);
    //                                     return {
    //                                         ...maNhaKhoNhan,
    //                                         idVirtual: maNhaKhoNhan ? maNhaKhoNhan.idVirtual ? maNhaKhoNhan.idVirtual : uuid.v4() : uuid.v4(),
    //                                         children: vss
    //                                     }
    //                                 }
    //                                 ).value();
    //                             return {
    //                                 ...maLoKho,
    //                                 idVirtual: maLoKho ? maLoKho.idVirtual ? maLoKho.idVirtual : uuid.v4() : uuid.v4(),
    //                                 maDiemKhoNhan: "",
    //                                 tenDiemKhoNhan: "",
    //                                 maNhaKhoNhan: "",
    //                                 tenNhaKhoNhan: "",
    //                                 maNganKhoNhan: "",
    //                                 tenNganKhoNhan: "",
    //                                 coLoKhoNhan: true,
    //                                 maLoKhoNhan: "",
    //                                 tenLoKhoNhan: "",
    //                                 soLuongPhanBo: 0,
    //                                 tichLuongKd: 0,
    //                                 slDcConLai: 0,
    //                                 children: rsss
    //                             }
    //                         }
    //                         ).value();
    //                     let duToanKphi = v.reduce((prev, cur) => prev + cur.duToanKphi, 0);
    //                     let rowDiemKho = v.find(s => s.maDiemKho === k);

    //                     return {
    //                         ...rowDiemKho,
    //                         idVirtual: rowDiemKho ? rowDiemKho.idVirtual ? rowDiemKho.idVirtual : uuid.v4() : uuid.v4(),
    //                         duToanKphi: duToanKphi,
    //                         children: rss
    //                     }
    //                 }
    //                 ).value();

    //             let duToanKphi = rs.reduce((prev, cur) => prev + cur.duToanKphi, 0);
    //             let rowChiCuc = value.find(s => s.maChiCucDxuat === key);
    //             return {
    //                 ...rowChiCuc,
    //                 idVirtual: rowChiCuc ? rowChiCuc.idVirtual ? rowChiCuc.idVirtual : uuid.v4() : uuid.v4(),
    //                 duToanKphi: duToanKphi,
    //                 children: rs
    //             };
    //         }).value();
    //     // this.tableView = dataView;
    //     // this.expandAll()

    //     if (data.length !== 0) {
    //         this.tongDuToanChiPhi = data.reduce((prev, cur) => prev + cur.duToanKphi, 0);
    //     }
    //     return dataView
    // }
    buildTableView(data) {
        let dataView = chain(data)
            .groupBy("maChiCucDxuat")
            .map((value, key) => {
                let rs = chain(value)
                    .groupBy("maDiemKho")
                    .map((v, k) => {
                        let duToanKphi = v.reduce((prev, cur) => prev + cur.duToanKphi, 0);
                        let rowDiemKho = v.find(s => s.maDiemKho === k);

                        return {
                            ...rowDiemKho,
                            idVirtual: rowDiemKho ? rowDiemKho.idVirtual ? rowDiemKho.idVirtual : uuid.v4() : uuid.v4(),
                            duToanKphi: duToanKphi,
                            children: v
                        }
                    }
                    ).value();

                let duToanKphi = rs.reduce((prev, cur) => prev + cur.duToanKphi, 0);
                let rowChiCuc = value.find(s => s.maChiCucDxuat === key);
                return {
                    ...rowChiCuc,
                    idVirtual: rowChiCuc ? rowChiCuc.idVirtual ? rowChiCuc.idVirtual : uuid.v4() : uuid.v4(),
                    duToanKphi: duToanKphi,
                    children: rs
                };
            }).value();
        // this.tableView = dataView;
        // this.expandAll()

        if (data.length !== 0) {
            this.tongDuToanChiPhi = data.reduce((prev, cur) => prev + cur.duToanKphi, 0);
        }
        return dataView
    }
    setValidator(isGuiDuyet) {
        if (isGuiDuyet) {
            this.formData.controls["soCongVan"].setValidators([Validators.required]);
            this.formData.controls["trichYeu"].setValidators([Validators.required]);
        }
        else {
            this.formData.controls["soCongVan"].clearValidators();
            this.formData.controls["trichYeu"].clearValidators();
        }
    }
    closeModalKeHoachDC() {
        this.idKeHoachDC = null;
        this.isViewKeHoachDC = false;
    }
    openModalKeHoachDC(id: any) {
        if (id) {
            this.idKeHoachDC = id;
            this.isViewKeHoachDC = true;
        }

    }
}
