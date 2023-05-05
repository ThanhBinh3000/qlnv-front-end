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
import { KeHoachDieuChuyenService } from '../../ke-hoach-dieu-chuyen/ke-hoach-dieu-chuyen.service';
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
    FORMAT_DATE_STR = Utils.FORMAT_DATE_STR;

    maHauTo: string;
    isTongHop: boolean = false;
    daXdinhDiemNhap: boolean = false;

    idKeHoachDC: any = null;
    isViewKeHoachDC: boolean = false;
    tongDuToanChiPhi: number = 0;

    tongHopData: any[] = [];

    dataTable2ChiCuc: any[];
    dataTable2Cuc: any[];
    groupData2Cuc: any[];
    data2Chi = [
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
                },
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
                    hdrId: 111
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
    ];
    listTenTrangThai = {
        "00": "Dự thảo",
        "01": "Chờ duyệt - tp",
        "02": "Từ chối -tp",
        "03": "Chờ duyệt - lđ cục",
        "04": "Từ chối - lđ cục",
        "05": "Đã duyệt - lđ cục",
        "65": "Y/c chi cục xác định điểm nhập"
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
        private keHoachDieuChuyenService: KeHoachDieuChuyenService,
        private cdr: ChangeDetectorRef,) {
        super(httpClient, storageService, notification, spinner, modal, tongHopDieuChuyenService);
        this.formData = this.fb.group(
            {
                id: [''],
                lyDoTuChoi: [''],

                trangThai: [''],
                tenTrangThai: [''],

                maTongHop: [''],
                soDeXuat: [''],
                ngayTongHop: [dayjs().format('YYYY-MM-DD')],
                trichYeu: [''],
                ngayDuyetLdc: [''],

                namKeHoach: [dayjs().get('year'), Validators.required],
                loaiDieuChuyen: ['CHI_CUC', Validators.required],
                thoiGianTongHop: ['']
            }
        );
        this.userInfo = this.userService.getUserLogin();
        this.maHauTo = '/' + this.userInfo.MA_TCKT;
    }

    async ngOnInit() {

        this.spinner.show();
        await this.initData();
        try {
            // await this.loadDetail(this.idInput)
            if (this.formData.value.id) {
                const data = await this.detail(this.formData.value.id);
                this.formData.patchValue(data);
                this.daXdinhDiemNhap = data?.daXdinhDiemNhap
                this.convertTongHop(data, this.isAddNew)
            }
            // await Promise.all([this.loaiVTHHGetAll(), this.loaiHopDongGetAll()]);
        } catch (e) {
            console.log("e", e)
            this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
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
    async detail(id, roles?: any) {
        if (!this.checkPermission(roles)) {
            return
        }
        this.spinner.show();
        try {
            let res = await this.tongHopDieuChuyenService.getDetail(id);
            if (res.msg == MESSAGE.SUCCESS) {
                if (res.data) {
                    const data = res.data;
                    this.helperService.bidingDataInFormGroup(this.formData, data);
                    this.fileDinhKem = data.fileDinhKem
                    return data;
                }
            } else {
                this.notification.error(MESSAGE.ERROR, res.msg);
                this.spinner.hide();
                return null;
            }
        } catch (e) {
            this.notification.error(MESSAGE.ERROR, e);
            this.spinner.hide();
        } finally {
            this.spinner.hide();
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
    yeuCauXacDinhDiemNhap = async ($event) => {
        $event.stopPropagation();
        await this.save(false);
        this.tongHopDieuChuyenService.guiYeuCauXacDinhDiemNhap({ id: this.formData.value.id })
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


    async selectRow(item: any, isAddNew) {
        if (this.groupData2Cuc?.length > 0) {
            this.groupData2Cuc = this.groupData2Cuc.map(i => {
                i.selected = false;
                if (i.soDxuat == item.soDxuat) {
                    i.selected = true
                }
                return { ...i }
            });

            // const detailCuc = Array.isArray(this.groupData2Cuc) && Array.isArray(this.groupData2Cuc.find(f => f.soDxuat === item.soDxuat)?.dcnbKeHoachDcDtls) ? this.groupData2Cuc.find(f => f.soDxuat === item.soDxuat)?.dcnbKeHoachDcDtls : []
            if (item.dcnbKeHoachDcHdrId) {
                const res = await this.keHoachDieuChuyenService.getDetail(item.dcnbKeHoachDcHdrId);
                const detailCuc = res.data;
                if (!detailCuc) return;
                detailCuc.duToanKphi = detailCuc.danhSachHangHoa.reduce((sum, cur) => sum += cur.duToanKphi, 0)
                this.dataTable2Cuc = this.mapExpanData(Array.isArray([detailCuc]) ? [detailCuc] : [], "danhSachHangHoa");

            }
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
        try {
            this.setValidator(isGuiDuyet)
            await this.spinner.show();
            let body = this.formData.value;
            let data;
            if (body.id) {
                data = await this.tongHopDieuChuyenService.capNhatTHCuc(body)
            }
            else {
                data = await this.tongHopDieuChuyenService.themTHCuc(body);
            };
            if (data.statusCode == 0) {
                this.isAddNew = false;
                this.isViewDetail = false;
                this.isDetail = true;
                this.isEdit = true;
                this.isTongHop = true;
                data?.data?.id && this.formData.patchValue({ ...data?.data, maTongHop: data.data.id })

                if (isGuiDuyet) {
                    if (this.formData.valid) {
                        await this.approve(this.formData.value.id, STATUS.CHO_DUYET_TP, "Bạn có chắc chắn muốn gửi duyệt?");
                        this.quayLai();

                    } else {
                        Object.values(this.formData.controls).forEach(control => {
                            control.markAsDirty();
                            control.updateValueAndValidity({ onlySelf: true });
                        });
                    }
                }
            }
        } catch (error) {
            console.log("e", error)
        } finally {
            await this.spinner.hide();

        }

    }
    async tongHop() {
        this.groupData2Cuc = [];
        this.dataTable2Cuc = [];
        this.dataTable2ChiCuc = [];
        this.formData.value.ngayTongHop = dayjs().format("YYYY-MM-DD")
        await this.setValidator(false);
        try {
            if (this.formData.valid) {
                this.isTongHop = true;
                const thoiGianTongHop = dayjs().format("YYYY-MM-DDTHH:mm:ss");
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
                    // this.notification.success(MESSAGE.SUCCESS);
                    this.tongHopData = cloneDeep(data.data);
                    this.convertTongHop(this.tongHopData, this.isAddNew)
                } else {
                    this.notification.error(MESSAGE.ERROR, data.msg);
                }

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
        if (!data) return;
        if (isNew) {
            if (this.formData.value.loaiDieuChuyen === "CHI_CUC") {
                const buildData2ChiCuc = this.buildTableView(data?.reduce((arr, cur) => {
                    return arr.concat(cur.dcnbKeHoachDcDtls?.map(f => ({ ...f, maDvi: cur.maDvi, tenDvi: cur.tenDvi })))
                }, []));
                // this.dataTable2ChiCuc = this.mapExpanData(buildData2ChiCuc, "children");
                this.dataTable2ChiCuc = cloneDeep(buildData2ChiCuc)
            }
            else if (this.formData.value.loaiDieuChuyen === "CUC") {
                // this.groupData2Cuc = chain(data).groupBy('soDxuat').map((item, i) => {
                //     const soDeXuat = item.find(f => f.soDxuat == i);
                //     const newItem = item.map(f => {
                //         const duToanKphi = f.dcnbKeHoachDcDtls?.reduce((sum, cur) => sum += cur.duToanKphi, 0);
                //         return {
                //             ...f, duToanKphi
                //         }
                //     });
                //     const duToanKphi = item?.reduce((sum, cur) => sum += cur.duToanKphi, 0);
                //     return {
                //         ...soDeXuat,
                //         dcnbKeHoachDcDtls: newItem,
                //         duToanKphi
                //     }
                // }).value();
                this.groupData2Cuc = cloneDeep(data)
                Array.isArray(data) && this.selectRow(this.groupData2Cuc[0], isNew)
            }
        } else {
            if (data.loaiDieuChuyen == "CHI_CUC") {
                if (Array.isArray(data.thKeHoachDieuChuyenNoiBoCucDtls && data.thKeHoachDieuChuyenNoiBoCucDtls.length > 0)) {
                    this.daXdinhDiemNhap = true;
                    data.thKeHoachDieuChuyenNoiBoCucDtls?.forEach(element => {
                        if (!element.dcnbKeHoachDcDtl.daXdinhDiemNhap) {
                            this.daXdinhDiemNhap = false;
                        }
                    });

                }
                const buildData2ChiCuc = this.buildTableView(data.thKeHoachDieuChuyenNoiBoCucDtls?.reduce((arr, cur) => {
                    return arr.concat([cur.dcnbKeHoachDcDtl]?.map(f => ({ ...f, maDvi: cur.maDvi, tenDvi: cur.tenDvi })))
                }, []));
                this.dataTable2ChiCuc = cloneDeep(buildData2ChiCuc);
            }
            else if (data.loaiDieuChuyen == "CUC") {
                this.groupData2Cuc = Array.isArray(data.thKeHoachDieuChuyenCucKhacCucDtls) ? data.thKeHoachDieuChuyenCucKhacCucDtls.map((item, i) => ({ ...item.dcnbKeHoachDcHdr, dcnbKeHoachDcHdrId: item.dcnbKeHoachDcHdrId })) : []
                if (Array.isArray(this.groupData2Cuc)) {
                    this.daXdinhDiemNhap = true;
                    this.groupData2Cuc.forEach((item, id) => {
                        if (item.danhSachHangHoa.some(cur => !cur.daXdinhDiemNhap)) {
                            this.daXdinhDiemNhap = false
                        }
                    })
                    this.selectRow(this.groupData2Cuc[0], isNew)
                }
            }
        }

    }

    buildTableView(data: any[] = [], keychild: string = "children") {
        let dataView = chain(data)
            .groupBy("maDvi")
            ?.map((value, key) => {
                let rs = chain(value)
                    .groupBy("maDiemKho")
                    ?.map((v, k) => {
                        let rss = chain(v)
                            .groupBy("maLoKho")
                            ?.map((vs, ks) => {
                                const maLoKho = vs.find(s => s?.maLoKho == ks);
                                const rsss = chain(vs).groupBy("id").map((x, ix) => {
                                    const ids = x.find(f => f.id == ix);
                                    //
                                    const hasDiemKhoNhan = x.some(f => f.maDiemKhoNhan);
                                    if (!hasDiemKhoNhan) return {
                                        ...ids
                                    }
                                    //
                                    const rssx = chain(x).groupBy("maDiemKhoNhan")?.map((m, im) => {
                                        const maDiemKhoNhan = m.find(f => f.maDiemKho == im);
                                        return {
                                            ...maDiemKhoNhan,
                                            children: m
                                        }
                                    }).value()
                                    return {
                                        ...ids,
                                        children: rssx
                                    }
                                }).value()
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
                let rowChiCuc = value?.find(s => s.maDvi === key);
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
    async setValidator(isGuiDuyet: boolean) {
        if (isGuiDuyet) {
            this.formData.controls["soDeXuat"].setValidators([Validators.required]);
            this.formData.controls["trichYeu"].setValidators([Validators.required]);
        }
        else {
            this.formData.controls["soDeXuat"].clearValidators();
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
