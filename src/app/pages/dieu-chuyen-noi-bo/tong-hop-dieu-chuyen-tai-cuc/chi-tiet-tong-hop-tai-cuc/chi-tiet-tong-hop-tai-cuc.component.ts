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
import { chain, cloneDeep, groupBy } from 'lodash';
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

    listTenTrangThai = {
        "00": "Dự thảo",
        "01": "Chờ duyệt - tp",
        "02": "Từ chối -tp",
        "03": "Chờ duyệt - lđ cục",
        "04": "Từ chối - lđ cục",
        "05": "Đã duyệt - lđ cục"
    }
    data = {
        id: 441,
        ngaytao: "25/04/2023 09:50:16",
        nguoiTaoId: 665,
        ngaySua: null,
        nguoiSuaId: null,
        maTongHop: null,
        soDeXuat: null,
        ngayDXuat: null,
        ngayTongHop: "25/04/2023 09:50:16",
        trichYeu: "test",
        namKeHoach: 2023,
        loaiDieuChuyen: "ALL",
        thTuNgay: null,
        thDenNgay: null,
        trangThai: "00",
        ngayGDuyet: null,
        nguoiGDuyetId: null,
        ngayDuyetTp: null,
        nguoiDuyetTpId: null,
        ngayDuyetLdc: null,
        nguoiDuyetLdcId: null,
        lyDoTuChoi: null,
        maDvi: "010102",
        tenDvi: "Cục DTNNKV Vĩnh Phú",
        daXdinhDiemNhap: null,
        thKeHoachDieuChuyenNoiBoCucDtls: [
            {
                id: 221,
                hdrId: 441,
                dcKeHoachDcHdrId: 262,
                dcKeHoachDcDtlId: 444,
                maChiCucDxuat: "01010202",
                tenChiCucDxuat: "Chi cục Dự trữ Nhà nước Phong Châu",
                daXdinhDiemNhap: null,
                dcnbKeHoachDcDtlList: [
                    {
                        id: 444,
                        parentId: null,
                        maChiCucNhan: "01010202",
                        tenChiCucNhan: null,
                        thoiGianDkDc: null,
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
                        slDcConLai: null,
                        coLoKho: null,
                        maDiemKho: "0101020102",
                        tenDiemKho: "Điểm kho Ninh Dân",
                        maNhaKho: "010102010101",
                        tenNhaKho: "Nhà kho A3",
                        maNganKho: "01010201010101",
                        tenNganKho: "Ngan kho 3",
                        maLoKho: "0101020101010105",
                        tenLoKho: "Lô kho mới 02",
                        maDiemKhoNhan: "0101050102",
                        tenDiemKhoNhan: "Điểm kho B",
                        maNhaKhoNhan: "010105010201",
                        tenNhaKhoNhan: "Nhà kho B",
                        maNganKhoNhan: "01010501020101",
                        tenNganKhoNhan: "Ngăn kho B",
                        maLoKhoNhan: "0101050102010101",
                        tenLoKhoNhan: "Lô kho B",
                        coLoKhoNhan: null,
                        hdrId: 262
                    }
                ]
            },
            {
                id: 222,
                hdrId: 441,
                dcKeHoachDcHdrId: 111,
                dcKeHoachDcDtlId: 311,
                maChiCucDxuat: "01010201",
                tenChiCucDxuat: "Chi cục Dự trữ Nhà nước Việt Trì",
                daXdinhDiemNhap: null,
                dcnbKeHoachDcDtlList: [
                    {
                        id: 311,
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
                        slDcConLai: null,
                        coLoKho: null,
                        maDiemKho: "0101020101",
                        tenDiemKho: "Điểm kho Phủ Đức",
                        maNhaKho: "010102010101",
                        tenNhaKho: "Nhà kho A1",
                        maNganKho: "01010201010101",
                        tenNganKho: "Ngăn kho A1/1",
                        maLoKho: "0101020101010104",
                        tenLoKho: "Lô kho mới 01",
                        maDiemKhoNhan: "0101050102",
                        tenDiemKhoNhan: "Điểm kho C",
                        maNhaKhoNhan: "010105010201",
                        tenNhaKhoNhan: "Nhà kho C",
                        maNganKhoNhan: "01010501020101",
                        tenNganKhoNhan: "Ngăn kho C",
                        maLoKhoNhan: "0101050102010101",
                        tenLoKhoNhan: "Lô kho C",
                        hdrId: 111
                    },
                    {
                        id: 31,
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
                        slDcConLai: null,
                        coLoKho: null,
                        maDiemKho: "0101020101",
                        tenDiemKho: "Điểm kho Phủ Đức",
                        maNhaKho: "010102010101",
                        tenNhaKho: "Nhà kho A1",
                        maNganKho: "01010201010101",
                        tenNganKho: "Ngăn kho A1/1",
                        maLoKho: "0101020101010104",
                        tenLoKho: "Lô kho mới 01",
                        maDiemKhoNhan: "0101050102",
                        tenDiemKhoNhan: "Điểm kho E",
                        maNhaKhoNhan: "010105010202",
                        tenNhaKhoNhan: "Nhà kho E",
                        maNganKhoNhan: "01010501020201",
                        tenNganKhoNhan: "Ngăn kho E",
                        maLoKhoNhan: "0101050102010101",
                        tenLoKhoNhan: "Lô kho E",
                        hdrId: 111
                    },
                    {
                        id: 313,
                        parentId: null,
                        maChiCucNhan: "01010202",
                        tenChiCucNhan: "Chi cục Dự trữ A",
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
                        slDcConLai: null,
                        coLoKho: null,
                        maDiemKho: "0101020101",
                        tenDiemKho: "Điểm kho Phủ Đức",
                        maNhaKho: "010102010101",
                        tenNhaKho: "Nhà kho A1",
                        maNganKho: "01010201010101",
                        tenNganKho: "Ngăn kho A1/1",
                        maLoKho: "0101020101010104",
                        tenLoKho: "Lô kho mới 01",
                        maDiemKhoNhan: "0101050102",
                        tenDiemKhoNhan: "Điểm kho F",
                        maNhaKhoNhan: "010105010203",
                        tenNhaKhoNhan: "Nhà kho F",
                        maNganKhoNhan: "01010501020301",
                        tenNganKhoNhan: "Ngăn kho F",
                        maLoKhoNhan: "0101050102030101",
                        tenLoKhoNhan: "Lô kho F",
                        hdrId: 113
                    }
                ]
            },
            {
                id: 223,
                hdrId: 441,
                dcKeHoachDcHdrId: 241,
                dcKeHoachDcDtlId: 441,
                maChiCucDxuat: "01010201",
                tenChiCucDxuat: "Chi cục Dự trữ Nhà nước Việt Trì",
                daXdinhDiemNhap: null,
                dcnbKeHoachDcDtlList: [
                    {
                        id: 441,
                        parentId: null,
                        maChiCucNhan: "01010202",
                        tenChiCucNhan: "Chi cục Dự trữ Nhà nước B",
                        thoiGianDkDc: "2023-04-22",
                        loaiVthh: "0101",
                        cloaiVthh: "010101",
                        tenLoaiVthh: "Thóc tẻ",
                        tenCloaiVthh: "Hạt rất dài",
                        donViTinh: "0",
                        tenDonViTinh: "kg",
                        tonKho: 76767,
                        soLuongDc: 10,
                        duToanKphi: 1000000,
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
                        hdrId: 241
                    }
                ]
            }
        ],
        thKeHoachDieuChuyenCucKhacCucDtls: [
            {
                id: 201,
                maCucNhan: "010103",
                tenCucNhan: "Cục DTNNKV Bắc Thái",
                soDxuat: "323232",
                ngayDxuat: "2023-04-06",
                ngayGduyetTc: null,
                tongDuToanKp: 1,
                trichYeu: "dfdsfd",
                hdrId: 441,
                dcnbKeHoachDcHdrId: 161,
                maChiCucDxuat: null,
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
                        maDiemKhoNhan: "0101030101",
                        tenDiemKhoNhan: "Điểm kho A",
                        maNhaKhoNhan: "010103010101",
                        tenNhaKhoNhan: "Nhà Kho A1",
                        maNganKhoNhan: "01010301010101",
                        tenNganKhoNhan: "Ngăn kho A1",
                        maLoKhoNhan: "0101030101010101",
                        tenLoKhoNhan: "Lô kho A1",
                        coLoKhoNhan: true,
                        hdrId: 161
                    }
                ]
            },
            {
                id: 202,
                maCucNhan: "010101",
                tenCucNhan: "Cục DTNNKV Hoàng Liên Sơn",
                soDxuat: "1212",
                ngayDxuat: "2023-04-06",
                ngayGduyetTc: null,
                tongDuToanKp: 1,
                trichYeu: "dédf",
                hdrId: 441,
                dcnbKeHoachDcHdrId: 181,
                maChiCucDxuat: null,
                tenChiCucDxuat: "Chi cục Dự trữ Nhà nước Việt Trì",
                dcnbKeHoachDcDtlList: [
                    {
                        id: 361,
                        parentId: null,
                        maChiCucNhan: "01010202",
                        tenChiCucNhan: "Chi cục Dự trữ Nhà nước Phong Châu",
                        thoiGianDkDc: "2023-04-07",
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
                        hdrId: 181
                    }
                ]
            }
        ]
    }

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
                lyDoTuChoi: [''],

                trangThai: [''],
                tenTrangThai: [''],

                maTongHop: [''],
                soCongVan: [''],
                ngayTaoDeXuat: [dayjs().format('YYYY-MM-DD')],
                trichYeu: [''],
                ngayTrinhTc: [''],

                namKeHoach: [dayjs().get('year'), Validators.required],
                loaiDieuChuyen: ['CHI_CUC', Validators.required],
                thoiGianTongHop: ['']
            }
        );
        this.userInfo = this.userService.getUserLogin();
        this.maHauTo = '/' + this.userInfo.MA_TCKT;
    }

    async ngOnInit() {

        await this.initData();
        try {
            this.spinner.show();
            //this.loadDonVi();
            await Promise.all([
            ])

            // await this.loadDetail(this.idInput)
            if (this.formData.value.id) {
                const data = await this.detail(this.formData.value.id);
                this.formData.patchValue(data);
                this.convertTongHop(this.data, false)
            }
            // await Promise.all([this.loaiVTHHGetAll(), this.loaiHopDongGetAll()]);
            this.spinner.hide();
        } catch (e) {
            console.log("e", e)
            this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
            this.spinner.hide();
        } finally {
            if (this.isEdit || this.isViewDetail) {
                this.isTongHop = true
            };
            this.spinner.hide();
        }
    };
    async initData() {
        this.formData.controls["id"].setValue(this.idInput)
    };

    setExpand(parantExpand: boolean = false, children: any = []): void {
        if (parantExpand) {
            return children.map(f => ({ ...f, expand: false }))
        }
        return children
    }
    mapExpanData = (list: any[] = [], key: string = "children") => {
        let result = list.map(f => {
            if (Array.isArray(f[key]) && f[key]?.length > 0) {
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
        this.save(false)
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
        if (this.dataCuc?.length > 0) {
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
        await this.setValidator(isGuiDuyet)
        let body = this.formData.value;
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
        await this.setValidator(false);
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
                this.convertTongHop(this.tongHopData, true)
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

    convertTongHop(data, isNew: boolean = false) {
        if (isNew) {
            const data2ChiCuc = Array.isArray(data.thKeHoachDieuChuyenNoiBoCucDtls) ? data.thKeHoachDieuChuyenNoiBoCucDtls : ["ALL", "CHI_CUC"].includes(this.formData.value.loaiDieuChuyen) && Array.isArray(data.data) ? data.data : [];;
            this.dataCuc = Array.isArray(data.thKeHoachDieuChuyenCucKhacCucDtls) ? data.thKeHoachDieuChuyenCucKhacCucDtls : ["CUC"].includes(this.formData.value.loaiDieuChuyen) ? data.data : ["ALL"].includes(this.formData.value.loaiDieuChuyen) ? data.otherData : [];
            const buildData2ChiCuc = this.buildTableView(data2ChiCuc?.reduce((arr, cur) => {
                return arr.concat(cur.dcnbKeHoachDcDtls?.map(f => ({ ...f, maChiCucDxuat: cur.maChiCucDxuat, tenChiCucDxuat: cur.tenChiCucDxuat })))
            }, []));
            this.dataTable2ChiCuc = this.mapExpanData(buildData2ChiCuc, "children");
            this.dataTable2Cuc = this.mapExpanData(this.dataCuc?.map(f => ({ ...f, duToanKphi: f.dcnbKeHoachDcDtls.reduce((sum, cur) => sum += cur.duToanKphi, 0) })), "dcnbKeHoachDcDtls");
        } else {

            const data2ChiCuc = Array.isArray(data.thKeHoachDieuChuyenNoiBoCucDtls) ? data.thKeHoachDieuChuyenNoiBoCucDtls : ["ALL", "CHI_CUC"].includes(this.formData.value.loaiDieuChuyen) && Array.isArray(data.data) ? data.data : [];
            this.dataCuc = Array.isArray(data.thKeHoachDieuChuyenCucKhacCucDtls) ? data.thKeHoachDieuChuyenCucKhacCucDtls : ["CUC"].includes(this.formData.value.loaiDieuChuyen) ? data.data : ["ALL"].includes(this.formData.value.loaiDieuChuyen) ? data.otherData : [];
            const buildData2ChiCuc = this.buildTableView(data2ChiCuc?.reduce((arr, cur) => {
                return arr.concat(cur.dcnbKeHoachDcDtlList?.map(f => ({ ...f, maChiCucDxuat: cur.maChiCucDxuat, tenChiCucDxuat: cur.tenChiCucDxuat })))
            }, []));
            this.dataTable2ChiCuc = this.mapExpanData(buildData2ChiCuc, "children");
            this.dataTable2Cuc = this.mapExpanData(this.dataCuc?.map(f => ({ ...f, duToanKphi: f.dcnbKeHoachDcDtlList.reduce((sum, cur) => sum += cur.duToanKphi, 0) })), "dcnbKeHoachDcDtlList");
        }
        console.log("dataCuc", this.dataCuc, this.dataTable2ChiCuc)
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
            ?.map((value, key) => {
                let rs = chain(value)
                    .groupBy("maDiemKho")
                    ?.map((v, k) => {
                        console.log("vv", v, chain(v))
                        let rss = chain(v)
                            .groupBy("maLoKho")
                            ?.map((vs, ks) => {
                                console.log("vs", vs);
                                const maLoKho = vs.find(s => s?.maLoKho === ks);
                                // const ids = vs.filter(item => !(item?.id == undefined || item?.id == ""));
                                // let rsss = ids.map((x, i) => {
                                //     let rsssx = chain([x])
                                //         .groupBy("maDiemKhoNhan")
                                //         .map((vss, kss) => {
                                //             let maDiemKhoNhan = vss.find(s => s.maDiemKhoNhan === kss);
                                //             console.log("vss", vss, kss, maDiemKhoNhan)
                                //             return {
                                //                 ...maDiemKhoNhan,
                                //                 idVirtual: maDiemKhoNhan ? maDiemKhoNhan.idVirtual ? maDiemKhoNhan.idVirtual : uuid.v4() : uuid.v4(),
                                //                 children: vss,
                                //             }
                                //         }
                                //         ).value();
                                //     console.log("xx", x)
                                //     return {
                                //         ...x,
                                //         idVirtual: maLoKho ? maLoKho.idVirtual ? maLoKho.idVirtual : uuid.v4() : uuid.v4(),
                                //         children: rsssx,
                                //     }
                                // })
                                // return {
                                //     ...maLoKho,
                                //     idVirtual: maLoKho ? maLoKho.idVirtual ? maLoKho.idVirtual : uuid.v4() : uuid.v4(),
                                //     children: rsss,
                                // }
                                const hdrId = vs.filter(item => !(item?.hdrId == undefined || item?.hdrId == ""));
                                let rsss = chain(hdrId).groupBy("hdrId").map((x, i) => {
                                    const hdI = x.find(s => s.hdrId == i);
                                    console.log("hdI", hdI, x, i)
                                    let rsssx = chain(x)
                                        .groupBy("id")
                                        .map((vss, kss) => {
                                            const id = vss.find(s => s.id == kss);
                                            console.log("id", id)
                                            const f = chain(vss).groupBy("maDiemKho").map((fx, ix) => {
                                                const maDiemKho = fx.find(s => s.maDiemKhoNhan == ix);
                                                return {
                                                    ...maDiemKho,
                                                    idVirtual: maDiemKho ? maDiemKho.idVirtual ? maDiemKho.idVirtual : uuid.v4() : uuid.v4(),
                                                    children: fx, e: 1,
                                                }
                                            })
                                            return {
                                                ...id,
                                                idVirtual: id ? id.idVirtual ? id.idVirtual : uuid.v4() : uuid.v4(),
                                                children: f, e: 2,
                                            }
                                        }
                                        ).value();
                                    console.log("xx", x)
                                    return {
                                        ...hdI,
                                        idVirtual: hdI ? hdI.idVirtual ? hdI.idVirtual : uuid.v4() : uuid.v4(),
                                        children: rsssx,
                                        e: 3
                                    }
                                }).value()
                                return {
                                    ...maLoKho,
                                    idVirtual: maLoKho ? maLoKho.idVirtual ? maLoKho.idVirtual : uuid.v4() : uuid.v4(),
                                    children: rsss,
                                    e: 4
                                }
                            }
                            ).value();

                        let duToanKphi = v?.reduce((prev, cur) => prev + cur.duToanKphi, 0);
                        let rowDiemKho = v?.find(s => s.maDiemKho === k);

                        return {
                            ...rowDiemKho,
                            idVirtual: rowDiemKho ? rowDiemKho.idVirtual ? rowDiemKho.idVirtual : uuid.v4() : uuid.v4(),
                            duToanKphi: duToanKphi,
                            children: rss,
                        }
                    }
                    ).value();

                let duToanKphi = rs?.reduce((prev, cur) => prev + cur.duToanKphi, 0);
                let rowChiCuc = value?.find(s => s.maChiCucDxuat === key);
                return {
                    ...rowChiCuc,
                    idVirtual: rowChiCuc ? rowChiCuc.idVirtual ? rowChiCuc.idVirtual : uuid.v4() : uuid.v4(),
                    duToanKphi: duToanKphi,
                    children: rs,
                };
            }).value();
        // this.tableView = dataView;
        // this.expandAll()

        if (data?.length !== 0) {
            this.tongDuToanChiPhi = data.reduce((prev, cur) => prev + cur.duToanKphi, 0);
        };
        console.log("dataView", dataView)
        return dataView
    }
    async setValidator(isGuiDuyet) {
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
