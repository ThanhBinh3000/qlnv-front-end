import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators } from "@angular/forms";
import { UserLogin } from "../../../../../models/userlogin";
import { DiaDiemGiaoNhan, KeHoachBanDauGia, PhanLoTaiSan } from "../../../../../models/KeHoachBanDauGia";
import { DatePipe } from "@angular/common";
import { DiaDiemNhapKho } from "../../../../../models/CuuTro";
import {
    ModalInput
} from "../../../../xuat/xuat-cuu-tro-vien-tro/xuat-cuu-tro/xay-dung-phuong-an/thong-tin-xay-dung-phuong-an/thong-tin-xay-dung-phuong-an.component";
import { Base2Component } from "../../../../../components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { DanhMucService } from "../../../../../services/danhmuc.service";
import { DeXuatKeHoachBanDauGiaService } from "../../../../../services/deXuatKeHoachBanDauGia.service";
import { DonviService } from "../../../../../services/donvi.service";
import { TinhTrangKhoHienThoiService } from "../../../../../services/tinhTrangKhoHienThoi.service";
import { DanhMucTieuChuanService } from "../../../../../services/quantri-danhmuc/danhMucTieuChuan.service";
import {
    DeXuatPhuongAnCuuTroService
} from "../../../../../services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/DeXuatPhuongAnCuuTro.service";
import { QuanLyHangTrongKhoService } from "../../../../../services/quanLyHangTrongKho.service";
import * as dayjs from "dayjs";
import { FileDinhKem } from "../../../../../models/DeXuatKeHoachuaChonNhaThau";
import { MESSAGE } from "../../../../../constants/message";
import { STATUS } from "src/app/constants/status";
import { chain, cloneDeep } from 'lodash';
import * as uuid from "uuid";
import { Utils } from 'src/app/Utility/utils';
import { Router } from '@angular/router';
@Component({
    selector: 'app-chi-tiet-tong-hop-dieu-chuyen-cap-tong-cuc',
    templateUrl: './chi-tiet-tong-hop-dieu-chuyen-cap-tong-cuc.component.html',
    styleUrls: ['./chi-tiet-tong-hop-dieu-chuyen-cap-tong-cuc.component.scss']
})
export class ChiTietTongHopDieuChuyenCapTongCuc extends Base2Component implements OnInit {
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
    styleStatus: string = 'du-thao-va-lanh-dao-duyet';
    tabSelected: string = 'thongTinChung';
    listHangHoaAll: any[] = [];
    listLoaiHangHoa: any[] = [];
    errorInputRequired: string = 'Dữ liệu không được để trống.';
    userInfo: UserLogin;
    expandSet = new Set<number>();
    bangPhanBoList: Array<any> = [];
    khBanDauGia: KeHoachBanDauGia = new KeHoachBanDauGia();
    diaDiemGiaoNhan: DiaDiemGiaoNhan = new DiaDiemGiaoNhan();
    diaDiemGiaoNhanList: Array<DiaDiemGiaoNhan> = [];
    phanLoTaiSanList: Array<PhanLoTaiSan> = [];
    STATUS = STATUS;
    datePipe = new DatePipe('en-US');
    expandSetString = new Set<string>();
    tableView = [];
    tableRow: any = {};
    isVisible = false;
    isVisibleSuaNoiDung = false;
    isViewKeHoachDC: boolean = false;
    idKeHoachDC: any = null;
    listNoiDung = [];
    errorInputComponent: any[] = [];
    disableInputComponent: ModalInput = new ModalInput();
    Utils = Utils;
    FORMAT_DATE_TIME_STR = Utils.FORMAT_DATE_TIME_STR;

    maHauTo: string;
    isTongHop: boolean = false;
    yeuCauSuccess: boolean = false;
    tongHopData: any[] = [];
    data: any = {
        id: 202,
        ngaytao: null,
        nguoiTaoId: null,
        ngaySua: "20/04/2023 19:18:15",
        nguoiSuaId: 1405,
        maTongHop: "1",
        soDeXuat: null,
        ngayDXuat: null,
        ngayTongHop: null,
        trichYeu: "test2",
        namKeHoach: null,
        loaiDieuChuyen: "02",
        thTuNgay: null,
        thDenNgay: null,
        trangThai: null,
        ngayGDuyet: null,
        nguoiGDuyetId: null,
        ngayDuyetTp: null,
        nguoiDuyetTpId: null,
        ngayDuyetLdc: null,
        nguoiDuyetLdcId: null,
        lyDoTuChoi: null,
        maDvi: "010102",
        tenDvi: "Cục DTNNKV Vĩnh Phú",
        tenTrangThai: null,
        thKeHoachDieuChuyenNoiBoCucDtls: [
            {
                id: 2,
                hdrId: 202,
                maChiCucDxuat: "01010201",
                tenChiCucDxuat: "Chi cục Dự trữ Nhà nước Việt Trì",
                dcnbKeHoachDcHdrId: 162,
                dcnbKeHoachDcDtlId: 342,
                dcnbKeHoachDcDtlList: [
                    {
                        id: 342,
                        parentId: 341,
                        maChiCucNhan: "01010202",
                        tenChiCucNhan: "Chi cục Dự trữ Nhà nước Phong Châu",
                        thoiGianDkDc: "2023-04-06",
                        loaiVthh: "0101",
                        cloaiVthh: "010101",
                        tenLoaiVthh: "Thóc tẻ",
                        tenCloaiVthh: "Hạt rất dài",
                        donViTinh: "0",
                        tenDonViTinh: "kg",
                        tonKho: 76767,
                        soLuongDc: 1,
                        duToanKphi: 1,
                        tichLuongKd: 0,
                        soLuongPhanBo: 0,
                        slDcConLai: 0,
                        coLoKho: true,
                        maDiemKho: "0101020101",
                        tenDiemKho: "Điểm kho Phủ Đức",
                        maNhaKho: "010102010101",
                        tenNhaKho: "Nhà kho A1",
                        maNganKho: "01010201010101",
                        tenNganKho: "Ngăn kho A1/1",
                        maLoKho: "0101020101010104",
                        tenLoKho: "Lô kho mới 01",
                        maDiemKhoNhan: null,
                        tenDiemKhoNhan: null,
                        maNhaKhoNhan: null,
                        tenNhaKhoNhan: null,
                        maNganKhoNhan: null,
                        tenNganKhoNhan: null,
                        maLoKhoNhan: null,
                        tenLoKhoNhan: null,
                        coLoKhoNhan: true,
                        hdrId: 162
                    }
                ]
            },
            {
                id: 1,
                hdrId: 202,
                maChiCucDxuat: "01010203",
                tenChiCucDxuat: "Chi cục Dự trữ Nhà nước Việt Trì",
                dcnbKeHoachDcHdrId: 162,
                dcnbKeHoachDcDtlId: 342,
                dcnbKeHoachDcDtlList: [
                    {
                        id: 342,
                        parentId: 341,
                        maChiCucNhan: "01010202",
                        tenChiCucNhan: "Chi cục Dự trữ Nhà nước Phong Châu",
                        thoiGianDkDc: "2023-04-06",
                        loaiVthh: "0101",
                        cloaiVthh: "010101",
                        tenLoaiVthh: "Thóc tẻ",
                        tenCloaiVthh: "Hạt rất dài",
                        donViTinh: "0",
                        tenDonViTinh: "kg",
                        tonKho: 76767,
                        soLuongDc: 1,
                        duToanKphi: 1,
                        tichLuongKd: 0,
                        soLuongPhanBo: 0,
                        slDcConLai: 0,
                        coLoKho: true,
                        maDiemKho: "0101020301",
                        tenDiemKho: "Điểm kho Phủ Đức",
                        maNhaKho: "010102030101",
                        tenNhaKho: "Nhà kho A1",
                        maNganKho: "01010203010101",
                        tenNganKho: "Ngăn kho A1/1",
                        maLoKho: "0101020301010104",
                        tenLoKho: "Lô kho mới 01",
                        maDiemKhoNhan: null,
                        tenDiemKhoNhan: null,
                        maNhaKhoNhan: null,
                        tenNhaKhoNhan: null,
                        maNganKhoNhan: null,
                        tenNganKhoNhan: null,
                        maLoKhoNhan: null,
                        tenLoKhoNhan: null,
                        coLoKhoNhan: true,
                        hdrId: 162
                    }
                ]
            }
        ],
        thKeHoachDieuChuyenCucKhacCucDtls: [
            {
                id: 2,
                maCucNhan: "010103",
                tenCucNhan: "Cục DTNN KV A",
                soDxuat: null,
                ngayDxuat: null,
                ngayGduyetTc: null,
                tongDuToanKp: null,
                trichYeu: null,
                hdrId: 202,
                dcnbKeHoachDcHdrId: 161,
                maChiCucDxuat: "01010201",
                tenChiCucDxuat: "Chi cục Dự trữ Nhà nước Việt Trì",
                dcnbKeHoachDcDtlList: [
                    {
                        id: 341,
                        parentId: null,
                        maChiCucNhan: "01010202",
                        tenChiCucNhan: "Chi cục Dự trữ Nhà nước Phong Châu",
                        thoiGianDkDc: "2023-04-06",
                        loaiVthh: "0101",
                        cloaiVthh: "010101",
                        tenLoaiVthh: "Thóc tẻ",
                        tenCloaiVthh: "Hạt rất dài",
                        donViTinh: "0",
                        tenDonViTinh: "kg",
                        tonKho: 76767,
                        soLuongDc: 1,
                        duToanKphi: 1,
                        tichLuongKd: 0,
                        soLuongPhanBo: 0,
                        slDcConLai: 0,
                        coLoKho: true,
                        maDiemKho: "0101020101",
                        tenDiemKho: "Điểm kho Phủ Đức",
                        maNhaKho: "010102010101",
                        tenNhaKho: "Nhà kho A1",
                        maNganKho: "01010201010101",
                        tenNganKho: "Ngăn kho A1/1",
                        maLoKho: "0101020101010104",
                        tenLoKho: "Lô kho mới 01",
                        maDiemKhoNhan: null,
                        tenDiemKhoNhan: null,
                        maNhaKhoNhan: null,
                        tenNhaKhoNhan: null,
                        maNganKhoNhan: null,
                        tenNganKhoNhan: null,
                        maLoKhoNhan: null,
                        tenLoKhoNhan: null,
                        coLoKhoNhan: true,
                        hdrId: 161
                    }
                ]
            },
            {
                id: 3,
                maCucNhan: "010104",
                tenCucNhan: "Cục DTNN KV B",
                soDxuat: null,
                ngayDxuat: null,
                ngayGduyetTc: null,
                tongDuToanKp: null,
                trichYeu: null,
                hdrId: 202,
                dcnbKeHoachDcHdrId: 161,
                maChiCucDxuat: "01010202",
                tenChiCucDxuat: "Chi cục Dự trữ Nhà nước Hoàng Liên Sơn",
                dcnbKeHoachDcDtlList: [
                    {
                        id: 341,
                        parentId: null,
                        maChiCucNhan: "01010202",
                        tenChiCucNhan: "Chi cục Dự trữ Nhà nước Phong Châu",
                        thoiGianDkDc: "2023-04-06",
                        loaiVthh: "0101",
                        cloaiVthh: "010101",
                        tenLoaiVthh: "Thóc tẻ",
                        tenCloaiVthh: "Hạt rất dài",
                        donViTinh: "0",
                        tenDonViTinh: "kg",
                        tonKho: 76767,
                        soLuongDc: 1,
                        duToanKphi: 1,
                        tichLuongKd: 0,
                        soLuongPhanBo: 0,
                        slDcConLai: 0,
                        coLoKho: true,
                        maDiemKho: "0101020101",
                        tenDiemKho: "Điểm kho Phủ Đức",
                        maNhaKho: "010102010101",
                        tenNhaKho: "Nhà kho A1",
                        maNganKho: "01010201010101",
                        tenNganKho: "Ngăn kho A1/1",
                        maLoKho: "0101020101010104",
                        tenLoKho: "Lô kho mới 01",
                        maDiemKhoNhan: null,
                        tenDiemKhoNhan: null,
                        maNhaKhoNhan: null,
                        tenNhaKhoNhan: null,
                        maNganKhoNhan: null,
                        tenNganKhoNhan: null,
                        maLoKhoNhan: null,
                        tenLoKhoNhan: null,
                        coLoKhoNhan: true,
                        hdrId: 161
                    }
                ]
            }
        ]
    }

    dataTable2ChiCuc: any[];
    dataTable2Cuc: any[];
    dataCuc: any[];

    tongDuToanChiPhi: number;

    constructor(httpClient: HttpClient,
        storageService: StorageService,
        notification: NzNotificationService,
        spinner: NgxSpinnerService,
        modal: NzModalService,
        private router: Router,
        private danhMucService: DanhMucService,
        private deXuatKeHoachBanDauGiaService: DeXuatKeHoachBanDauGiaService,
        private donViService: DonviService,
        private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
        private dmTieuChuanService: DanhMucTieuChuanService,
        private deXuatPhuongAnCuuTroService: DeXuatPhuongAnCuuTroService,
        private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,
        private cdr: ChangeDetectorRef,) {
        super(httpClient, storageService, notification, spinner, modal, deXuatPhuongAnCuuTroService);
        this.formData = this.fb.group(
            {
                id: [''],
                nam: [dayjs().get("year")],
                maDvi: [''],
                maDviCuc: [''],
                loaiVthh: [''],
                cloaiVthh: [''],
                tenVthh: [''],
                trangThai: [''],
                idQdPd: [''],
                soQdPd: [''],
                nguoiGduyetId: [''],
                ngayPduyet: [''],
                nguoiPduyetId: [''],
                lyDoTuChoi: [''],
                tenDvi: [''],
                tenLoaiVthh: [''],
                tenCloaiVthh: [''],
                donViTinh: [''],
                tenTrangThai: [''],

                lyDoDc: [''],
                namKeHoach: [dayjs().get('year'), Validators.required],
                loaiDieuChuyen: ['CHI_CUC', Validators.required],
                thoiGianTongHop: [''],

                maTongHop: [''],
                soCongVan: [''],
                ngayTaoDeXuat: [dayjs().format('YYYY-MM-DD')],
                trichYeu: [''],
                ngayTrinhTc: ['']
            }
        );
        this.userInfo = this.userService.getUserLogin();
        this.maHauTo = '/' + this.userInfo.MA_TCKT;
    }

    async ngOnInit() {
        if (this.isEdit || this.isViewDetail) {
            this.isTongHop = true
        }
        try {
            this.spinner.show();
            //this.loadDonVi();
            await Promise.all([
            ])

            await this.loadDetail(this.idInput)
            // await Promise.all([this.loaiVTHHGetAll(), this.loaiHopDongGetAll()]);
            this.spinner.hide();
        } catch (e) {
            this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
            this.spinner.hide();
        } finally {
            this.spinner.hide();
        }
    }


    async loadDetail(idInput: number) {
        if (idInput > 0) {
            await this.deXuatPhuongAnCuuTroService.getDetail(idInput)
                .then(async (res) => {
                    if (res.msg == MESSAGE.SUCCESS) {
                        this.maHauTo = '/' + res.data.soDx.split("/")[1];
                        res.data.soDx = res.data.soDx.split("/")[0];
                        this.formData.patchValue(res.data);
                        this.formData.value.deXuatPhuongAn.forEach(s => s.idVirtual = uuid.v4());
                        // this.buildTableView();
                    }
                })
                .catch((e) => {
                    console.log('error: ', e);
                    this.spinner.hide();
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                });
        } else {
            this.formData.patchValue({
                maDvi: this.userInfo.MA_DVI,
                tenDvi: this.userInfo.TEN_DVI,
                maDviCuc: this.userInfo.MA_DVI?.slice(0, -2)
            });
        }

    }
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
        this.formData.patchValue({ thoiGianTongHop: '' });
        this.formData.controls["maTongHop"].setValue('');
        this.formData.controls["soCongVan"].setValue('');
        this.formData.controls["ngayTaoDeXuat"].setValue('');
        this.formData.controls["trichYeu"].setValue('');
    }
    yeuCauChiCucNhan = () => {
        //call api yêu cầu chi cục xác định điểm nhập
        this.yeuCauSuccess = true;
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
    async taoQuyetDinh() {
        //save record-->redirect page tao quyet dinh
        let id;
        try {
            id = await this.save(true);

        } catch (error) {
            console.log("error", error)
        }
        finally {
            this.router.navigate([
                '/kehoach/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc',
                id,
            ]);
        }
    }
    async save(isGuiDuyet?) {
        await this.spinner.show();
        this.setValidator(isGuiDuyet)
        let body = this.formData.value;
        if (this.formData.value.soQd) {
            // body.soQd = this.formData.value.soQd + "/" + this.maQd;
        }
        body.fileDinhKems = this.fileDinhKem;
        let data = await this.createUpdate(body);
        await this.spinner.hide();
        if (data) {
            return data.id
        }
    }
    async tongHop() {
        this.yeuCauSuccess = false;
        // const data = await this.createUpdate({ loaiDieuChuyen: this.formData.value.loaiDieuChuyen });
        // if (data) {
        //     this.tongHopData = Array.isArray(data) ? data : [];
        // }
        this.setValidator(false);
        if (this.formData.valid) {
            this.isTongHop = true;
            const thoiGianTongHop = dayjs().format("YYYY-MM-DD HH:mm:ss");
            this.formData.patchValue({ thoiGianTongHop: thoiGianTongHop })
            // call api tổng hợp dữ liệu;
            this.tongHopData = cloneDeep(this.data);
            this.convertTongHop(this.tongHopData)
        } else {
            Object.values(this.formData.controls).forEach(control => {
                control.markAsDirty();
                control.updateValueAndValidity({ onlySelf: true });
            });
        }

    };
    convertTongHop(data) {
        const buildData2ChiCuc = this.buildTableView(data.thKeHoachDieuChuyenNoiBoCucDtls?.reduce((arr, cur) => {
            return arr.concat(cur.dcnbKeHoachDcDtlList.map(f => ({ ...f, maChiCucDxuat: cur.maChiCucDxuat, tenChiCucDxuat: cur.tenChiCucDxuat })))
        }, []));
        this.dataTable2ChiCuc = this.mapExpanData(buildData2ChiCuc, "children");
        this.dataCuc = this.data.thKeHoachDieuChuyenCucKhacCucDtls.map(f => ({
            maCucNhan: f.maCucNhan,
            tenCucNhan: f.tenCucNhan,
            id: f.id
        }))
        this.dataTable2Cuc = this.mapExpanData(data.thKeHoachDieuChuyenCucKhacCucDtls.map(f => ({ ...f, duToanKphi: f.dcnbKeHoachDcDtlList.reduce((sum, cur) => sum += cur.duToanKphi, 0) })), "dcnbKeHoachDcDtlList");
    };
    buildTableView(data) {
        let dataView = chain(data)
            .groupBy("maChiCucDxuat")
            .map((value, key) => {
                let rs = chain(value)
                    .groupBy("maDiemKho")
                    .map((v, k) => {
                        let rss = chain(v)
                            .groupBy("maLoKho")
                            .map((vs, ks) => {
                                let maLoKho = vs.find(s => s.maLoKho === ks);
                                let khoNhan = vs.filter(item => !(item.maDiemKhoNhan == undefined || item.maDiemKhoNhan == ""));
                                let rsss = chain(khoNhan)
                                    .groupBy("maNhaKhoNhan")
                                    .map((vss, kss) => {
                                        let maNhaKhoNhan = vss.find(s => s.maNhaKhoNhan === kss);
                                        return {
                                            ...maNhaKhoNhan,
                                            idVirtual: maNhaKhoNhan ? maNhaKhoNhan.idVirtual ? maNhaKhoNhan.idVirtual : uuid.v4() : uuid.v4(),
                                            children: vss
                                        }
                                    }
                                    ).value();
                                return {
                                    ...maLoKho,
                                    idVirtual: maLoKho ? maLoKho.idVirtual ? maLoKho.idVirtual : uuid.v4() : uuid.v4(),
                                    maDiemKhoNhan: "",
                                    tenDiemKhoNhan: "",
                                    maNhaKhoNhan: "",
                                    tenNhaKhoNhan: "",
                                    maNganKhoNhan: "",
                                    tenNganKhoNhan: "",
                                    coLoKhoNhan: true,
                                    maLoKhoNhan: "",
                                    tenLoKhoNhan: "",
                                    soLuongPhanBo: 0,
                                    tichLuongKd: 0,
                                    slDcConLai: 0,
                                    children: rsss
                                }
                            }
                            ).value();
                        let duToanKphi = v.reduce((prev, cur) => prev + cur.duToanKphi, 0);
                        let rowDiemKho = v.find(s => s.maDiemKho === k);

                        return {
                            ...rowDiemKho,
                            idVirtual: rowDiemKho ? rowDiemKho.idVirtual ? rowDiemKho.idVirtual : uuid.v4() : uuid.v4(),
                            duToanKphi: duToanKphi,
                            children: rss
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
    openModalKeHoachDC(id: any) {
        if (id) {
            this.idKeHoachDC = id;
            this.isViewKeHoachDC = true;
        }

    }
    closeModalKeHoachDC() {
        this.idKeHoachDC = null;
        this.isViewKeHoachDC = false;
    }
    setValidator(isTaoQD) {
        if (!isTaoQD) return;
        if (this.formData.get('type').value == 'TH') {
            this.formData.controls["idTongHop"].setValidators([Validators.required]);
            this.formData.controls["maTongHop"].setValidators([Validators.required]);
            this.formData.controls["idDx"].clearValidators();
            this.formData.controls["soDx"].clearValidators();
            this.formData.controls["ngayDx"].clearValidators();
        }
        if (this.formData.get('type').value == 'TTr') {
            this.formData.controls["idTongHop"].clearValidators();
            this.formData.controls["maTongHop"].clearValidators();
            this.formData.controls["ngayThop"].clearValidators();
            this.formData.controls["idDx"].setValidators([Validators.required]);
            this.formData.controls["soDx"].setValidators([Validators.required]);
        }
    }
}
