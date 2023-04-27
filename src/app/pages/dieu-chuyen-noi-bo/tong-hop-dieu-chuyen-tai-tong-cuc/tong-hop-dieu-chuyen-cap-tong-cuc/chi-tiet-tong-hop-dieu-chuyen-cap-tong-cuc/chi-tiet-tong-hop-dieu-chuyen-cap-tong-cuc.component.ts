import { TongHopDieuChuyenCapTongCuc } from './../tong-hop-dieu-chuyen-cap-tong-cuc.component';
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
import { chain, cloneDeep, includes } from 'lodash';
import * as uuid from "uuid";
import { Utils } from 'src/app/Utility/utils';
import { Router } from '@angular/router';
import { TongHopDieuChuyenCapTongCucService } from '../../tong-hop-dieu-chuyen-tai-tong-cuc.service';
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
        "CUC": {
            id: 42,
            ngaytao: "26/04/2023 15:40:05",
            nguoiTaoId: 1,
            ngaySua: null,
            nguoiSuaId: null,
            maTongHop: null,
            ngayTongHop: "27/04/2023 00:00:00",
            noiDung: null,
            namKeHoach: 2023,
            loaiDieuChuyen: "CUC",
            thTuNgay: null,
            thDenNgay: null,
            loaiHangHoa: null,
            tenLoaiHangHoa: null,
            chungLoaiHangHoa: null,
            trangThai: "26",
            maDVi: "0101",
            tenDVi: "Tổng cục Dự trữ Nhà nước",
            thoiGianTongHop: "27/04/2023 00:00:00",
            thKeHoachDieuChuyenTongCucDtls: [
                {
                    id: 23,
                    hdrId: 42,
                    keHoachDcHdrId: 161,
                    maCucDxuatDc: "010102",
                    tenCucDxuatDc: "Cục DTNNKV Vĩnh Phú",
                    maCucNhanDc: "010103",
                    tenCucNhanDc: "Cục DTNNKV Bắc Thái",
                    soDxuat: "323232",
                    ngayDuyetTc: null,
                    duToanKp: null,
                    trichYeu: "dfdsfd",
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
                    id: 24,
                    hdrId: 42,
                    keHoachDcHdrId: 181,
                    maCucDxuatDc: "010102",
                    tenCucDxuatDc: "Cục DTNNKV Vĩnh Phú",
                    maCucNhanDc: "010101",
                    tenCucNhanDc: "Cục DTNNKV Hoàng Liên Sơn",
                    soDxuat: "1212",
                    ngayDuyetTc: null,
                    duToanKp: null,
                    trichYeu: "dédf",
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
        }, "CHI_CUC": {
            id: 43,
            ngaytao: "26/04/2023 15:41:28",
            nguoiTaoId: 1,
            ngaySua: null,
            nguoiSuaId: null,
            maTongHop: null,
            ngayTongHop: "27/04/2023 00:00:00",
            noiDung: null,
            namKeHoach: 2023,
            loaiDieuChuyen: "CHI_CUC",
            thTuNgay: null,
            thDenNgay: null,
            loaiHangHoa: null,
            tenLoaiHangHoa: null,
            chungLoaiHangHoa: null,
            trangThai: "26",
            maDVi: "0101",
            tenDVi: "Tổng cục Dự trữ Nhà nước",
            thoiGianTongHop: "27/04/2023 21:01:40",
            thKeHoachDieuChuyenTongCucDtls: [
                {
                    id: 25,
                    hdrId: 43,
                    keHoachDcHdrId: 641,
                    maCucDxuatDc: "010102",
                    tenCucDxuatDc: "Cục DTNNKV Vĩnh Phú",
                    maCucNhanDc: null,
                    tenCucNhanDc: null,
                    tenChiCucDxuat: "Chi cục AB",
                    maChiCucDxuat: "01010203",
                    soDxuat: "123123",
                    ngayDuyetTc: null,
                    duToanKp: 1000002,
                    trichYeu: "test",
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
                            tenDiemKho: "Điểm kho A",
                            maNhaKho: "010102010101",
                            tenNhaKho: "Nhà kho A1",
                            maNganKho: "01010201010101",
                            tenNganKho: "Ngăn kho A1/1",
                            maLoKho: "0101020101010104",
                            tenLoKho: "Lô kho mới 01",
                            maDiemKhoNhan: "0101020103",
                            tenDiemKhoNhan: "Điểm kho B1",
                            maNhaKhoNhan: "010102010301",
                            tenNhaKhoNhan: "Nhà kho B1",
                            maNganKhoNhan: "01010201030101",
                            tenNganKhoNhan: "Ngăn kho B1",
                            maLoKhoNhan: "0101020103010101",
                            tenLoKhoNhan: "Lo kho B1",
                            coLoKhoNhan: true,
                            hdrId: 161
                        },
                        {
                            id: 342,
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
                            tenDiemKho: "Điểm kho A",
                            maNhaKho: "010102010101",
                            tenNhaKho: "Nhà kho A1",
                            maNganKho: "01010201010101",
                            tenNganKho: "Ngăn kho A1/1",
                            maLoKho: "0101020101010104",
                            tenLoKho: "Lô kho mới 01",
                            maDiemKhoNhan: "0101020103",
                            tenDiemKhoNhan: "Điểm kho B1",
                            maNhaKhoNhan: "010102010301",
                            tenNhaKhoNhan: "Nhà kho B1",
                            maNganKhoNhan: "01010201030101",
                            tenNganKhoNhan: "Ngăn kho B1",
                            maLoKhoNhan: "0101020103010101",
                            tenLoKhoNhan: "Lo kho B1",
                            coLoKhoNhan: true,
                            hdrId: 161
                        },
                        {
                            id: 343,
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
                            hdrId: 162
                        }
                    ]
                },
                {
                    id: 26,
                    hdrId: 43,
                    keHoachDcHdrId: 641,
                    maCucDxuatDc: "010102",
                    tenCucDxuatDc: "Cục DTNNKV Vĩnh Phú",
                    maCucNhanDc: null,
                    tenCucNhanDc: null,
                    soDxuat: "123123",
                    tenChiCucDxuat: "Chi cục Aa",
                    maChiCucDxuat: "01010204",
                    ngayDuyetTc: null,
                    duToanKp: 1000002,
                    trichYeu: "test",
                    dcnbKeHoachDcDtlList: [
                        {
                            id: 345,
                            parentId: null,
                            maChiCucNhan: "01010202",
                            tenChiCucNhan: "Chi cục Dự trữ Nhà nước AaA",
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
                            maDiemKho: "0101020106",
                            tenDiemKho: "Điểm kho Phủ Đức",
                            maNhaKho: "010102010601",
                            tenNhaKho: "Nhà kho A1",
                            maNganKho: "01010201060101",
                            tenNganKho: "Ngăn kho A1/1",
                            maLoKho: "0101020106010104",
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
                            hdrId: 165
                        }
                    ]
                },
                {
                    id: 27,
                    hdrId: 43,
                    keHoachDcHdrId: 641,
                    maCucDxuatDc: "010102",
                    tenCucDxuatDc: "Cục DTNNKV Vĩnh Phú",
                    maCucNhanDc: null,
                    tenCucNhanDc: null,
                    soDxuat: null,
                    ngayDuyetTc: null,
                    duToanKp: 1000002,
                    trichYeu: "test",
                    dcnbKeHoachDcDtlList: []
                }
            ]
        }
    }

    dataTable2ChiCuc: any[];
    dataTable2Cuc: any[];
    dataCuc: any[];
    groupData2Cuc: any[];
    groupData2ChiCuc: any[];
    daXdinhDiemNhap: boolean = false;
    tongDuToanChiPhi: number;

    constructor(httpClient: HttpClient,
        storageService: StorageService,
        notification: NzNotificationService,
        spinner: NgxSpinnerService,
        modal: NzModalService,
        private router: Router,
        private tongHopDieuChuyenCapTongCucService: TongHopDieuChuyenCapTongCucService,
        private cdr: ChangeDetectorRef,) {
        super(httpClient, storageService, notification, spinner, modal, tongHopDieuChuyenCapTongCucService);
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
            this.convertTongHop(this.data["CHI_CUC"])
            // if (this.formData.value.id) {
            //     const data = await this.detail(this.formData.value.id);
            //     this.formData.patchValue(data);
            //     this.daXdinhDiemNhap = data.daXdinhDiemNhap
            //     this.convertTongHop(this.data)
            // }
        } catch (e) {
            console.log("e", e)
            this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
        } finally {
            if (this.isEdit || this.isViewDetail) {
                this.isTongHop = true
            };
            this.spinner.hide();
        }
    }
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
    quayLai() {
        this.showListEvent.emit();
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
        try {
            this.setValidator(isGuiDuyet)
            await this.spinner.show();
            let body = { ...this.formData.value, ngayTongHop: dayjs(this.formData.value.ngayTongHop, 'DD/MM/YYYY').format("YYYY-MM-DD") };
            let data;
            if (body.id) {
                data = await this.tongHopDieuChuyenCapTongCucService.capNhatTHTongCuc(body)
            }
            else {
                data = await this.tongHopDieuChuyenCapTongCucService.themTHTongCuc(body);
            }
            if (data.data.id) {
                this.idInput = Number(data.data.id);
                this.formData.controls['id'].setValue(Number(data.data.id));
                this.isAddNew = false;
                this.isViewDetail = false;
                this.isDetail = true;
                this.isEdit = true;

                if (isGuiDuyet) {
                    if (this.formData.valid) {
                        this.approve(data.data.id, STATUS.CHO_DUYET_TP, "Bạn có chắc chắn muốn gửi duyệt?");

                    } else {
                        Object.values(this.formData.controls).forEach(control => {
                            control.markAsDirty();
                            control.updateValueAndValidity({ onlySelf: true });
                        });
                    }
                    this.quayLai();
                }
            }
        } catch (error) {
            console.log("e", error)
        } finally {
            await this.spinner.hide();

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
            const thoiGianTongHop = dayjs().format("YYYY-MM-DDTHH:mm:ss");
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
    async selectRow(item: any, isAddNew, loaiDieuChuyen) {
        if (["ALL", "CUC"].includes(loaiDieuChuyen)) {
            if (this.groupData2Cuc?.length > 0) {
                this.groupData2Cuc = this.groupData2Cuc.map(i => {
                    i.selected = false;
                    if (i.soDxuat == item.soDxuat) {
                        i.selected = true
                    }
                    return { ...i }
                });
                const detailCuc = Array.isArray(this.groupData2Cuc) ? this.groupData2Cuc.filter(f => f.soDxuat === item.soDxuat) : []
                this.dataTable2Cuc = this.mapExpanData(detailCuc, "dcnbKeHoachDcDtls");
            }
        }
        if (["ALL", "CHI_CUC"].includes(loaiDieuChuyen)) {
            if (this.groupData2ChiCuc?.length > 0) {
                this.groupData2ChiCuc = this.groupData2ChiCuc.map(i => {
                    i.selected = false;
                    if (i.soDxuat == item.soDxuat) {
                        i.selected = true
                    }
                    return { ...i }
                });
                const detailChiCuc = Array.isArray(this.groupData2ChiCuc) && this.groupData2ChiCuc.find(f => f.maCucDxuatDc === item.maCucDxuatDc) ? this.groupData2ChiCuc.find(f => f.maCucDxuatDc === item.maCucDxuatDc).dcnbKeHoachDcDtlList : []
                // this.dataTable2ChiCuc = this.mapExpanData(detailChiCuc, "dcnbKeHoachDcDtls");
                console.log("detail", detailChiCuc)
                const buildData2ChiCuc = this.buildTableView(detailChiCuc);
                this.dataTable2ChiCuc = this.mapExpanData(buildData2ChiCuc, "dcnbKeHoachDcDtls");
            }
        };
        console.log("data2Chicuc", this.groupData2ChiCuc, this.dataTable2ChiCuc)
    }
    convertTongHop(data) {
        //Chi cuc
        const data2ChiCuc = Array.isArray(data.thKeHoachDieuChuyenTongCucDtls) ? data.thKeHoachDieuChuyenTongCucDtls : [];
        this.groupData2ChiCuc = chain(this.dataCuc).groupBy('soDxuat').map((item, i) => {
            const soDeXuat = item.find(f => f.soDxuat == i);
            const newItem = item.map(f => ({
                ...f.dcnbKeHoachDcDtlList
            }));
            const duToanKphi = newItem?.reduce((sum, cur) => sum += cur.duToanKphi, 0)
            return {
                ...soDeXuat,
                dcnbKeHoachDcDtlList: newItem,
                duToanKphi
            }
        }).value();
        console.log("data2ChiCuc", data, data2ChiCuc, this.groupData2ChiCuc)
        //Cuc
        this.dataCuc = Array.isArray(data.thKeHoachDieuChuyenTongCucDtls) ? data.thKeHoachDieuChuyenTongCucDtls : [];
        this.groupData2Cuc = chain(this.dataCuc).groupBy('soDxuat').map((item, i) => {
            const soDeXuat = item.find(f => f.soDxuat == i);
            const newItem = item.map(f => ({
                ...f.dcnbKeHoachDcDtlList?.[0]
            }));
            const duToanKphi = newItem?.reduce((sum, cur) => sum += cur.duToanKphi, 0)
            return {
                ...soDeXuat,
                dcnbKeHoachDcDtlList: newItem,
                duToanKphi
            }
        }).value();
        // const buildData2ChiCuc = this.buildTableView(this.groupData2ChiCuc[0]);
        // this.dataTable2ChiCuc = this.mapExpanData(buildData2ChiCuc, "children");
        // this.dataTable2ChiCuc = cloneDeep(buildData2ChiCuc)
        this.selectRow(this.groupData2Cuc?.[0], this.isAddNew, this.formData.value.loaiDieuChuyen);
        this.selectRow(this.groupData2ChiCuc?.[0], this.isAddNew, this.formData.value.loaiDieuChuyen)
    };
    buildTableView(data) {
        console.log("data", data)
        let dataView = chain(data)
            .groupBy("maChiCucDxuat")
            ?.map((value, key) => {
                let rs = chain(value)
                    .groupBy("maDiemKho")
                    ?.map((v, k) => {
                        let rss = chain(v)
                            .groupBy("maLoKho")
                            ?.map((vs, ks) => {
                                const maLoKho = vs.find(s => s?.maLoKho === ks);
                                const hdrId = vs.filter(item => !(item?.hdrId == undefined || item?.hdrId == ""));
                                let rsss = chain(hdrId).groupBy("hdrId").map((x, i) => {
                                    const hdI = x.find(s => s.hdrId == i);
                                    let rsssx = chain(x)
                                        .groupBy("id")
                                        .map((vss, kss) => {
                                            const id = vss.find(s => s.id == kss);
                                            const f = chain(vss).groupBy("maDiemKho").map((fx, ix) => {
                                                const maDiemKho = fx.find(s => s.maDiemKhoNhan == ix);
                                                return {
                                                    ...maDiemKho,
                                                    idVirtual: maDiemKho ? maDiemKho.idVirtual ? maDiemKho.idVirtual : uuid.v4() : uuid.v4(),
                                                    children: fx
                                                }
                                            })
                                            return {
                                                ...id,
                                                idVirtual: id ? id.idVirtual ? id.idVirtual : uuid.v4() : uuid.v4(),
                                                children: f
                                            }
                                        }
                                        ).value();
                                    return {
                                        ...hdI,
                                        idVirtual: hdI ? hdI.idVirtual ? hdI.idVirtual : uuid.v4() : uuid.v4(),
                                        children: rsssx,
                                    }
                                }).value();
                                let duToanKphi = vs?.reduce((prev, cur) => prev + cur.duToanKphi, 0);
                                return {
                                    ...maLoKho,
                                    idVirtual: maLoKho ? maLoKho.idVirtual ? maLoKho.idVirtual : uuid.v4() : uuid.v4(),
                                    children: rsss,
                                    duToanKphi
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
                            expand: true
                        }
                    }
                    ).value();

                let duToanKphi = rs?.reduce((prev, cur) => prev + cur.duToanKphi, 0);
                let rowChiCuc = value?.find(s => s.maCucDxuatDc === key);
                console.log("rowChiCuc", value, key, rowChiCuc)
                return {
                    ...rowChiCuc,
                    idVirtual: rowChiCuc ? rowChiCuc.idVirtual ? rowChiCuc.idVirtual : uuid.v4() : uuid.v4(),
                    duToanKphi: duToanKphi,
                    children: rs,
                    expand: true
                };
            }).value();
        // this.tableView = dataView;
        // this.expandAll()

        if (data?.length !== 0) {
            this.tongDuToanChiPhi = data.reduce((prev, cur) => prev + cur.duToanKphi, 0);
        };
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
