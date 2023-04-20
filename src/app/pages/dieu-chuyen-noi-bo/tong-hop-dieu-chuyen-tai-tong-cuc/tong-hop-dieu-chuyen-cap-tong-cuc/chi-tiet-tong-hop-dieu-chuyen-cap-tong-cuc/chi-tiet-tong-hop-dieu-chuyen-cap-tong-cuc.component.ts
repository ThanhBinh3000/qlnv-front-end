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
    listNam: any[] = [];
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
    listNoiDung = [];
    errorInputComponent: any[] = [];
    disableInputComponent: ModalInput = new ModalInput();
    Utils = Utils;
    FORMAT_DATE_TIME_STR = Utils.FORMAT_DATE_TIME_STR;

    maHauTo: string;
    isTongHop: boolean = false;
    yeuCauSuccess: boolean = false;

    dataTable: any[] = [
        {
            id: 1,
            tenChiCuc: "Chi cục 1",
            diemKho: "",
            cap: 1,
            key: "1",
            children: [
                {
                    id: 1,
                    cap: 2,
                    diemKho: "DiemKho A",
                    key: "1-1",
                    dtKinhPhi: 10000000,
                    children: [
                        {
                            id: 1,
                            cap: 3,
                            loKho: "Lo kho 1",
                            key: "1-1-1",
                            time: "30/03/2023",
                            dtKinhPhi: 5000000,
                            checked: false
                        },
                        {
                            id: 2,
                            cap: 3,
                            loKho: "Lo kho 2",
                            key: "1-1-2",
                            time: "28/03/2023",
                            dtKinhPhi: 5000000,
                            checked: false
                        }
                    ]
                }

            ]
        },

        {
            id: 2,
            tenChiCuc: "Chi cục 2",
            diemKho: "",
            cap: 1,
            key: "2",
            children: [
                {
                    id: 1,
                    cap: 2,
                    diemKho: "DiemKho A",
                    key: "2-1",
                    children: [
                        {
                            id: 1,
                            cap: 3,
                            loKho: "Lo kho 1",
                            key: "2-1-1",
                            time: "12/02/2023",
                            checked: false,
                        },
                        {
                            id: 2,
                            cap: 3,
                            loKho: "Lo kho 2",
                            key: "2-1-2",
                            time: "15/02/2023",
                            checked: false
                        }
                    ]
                },
                {
                    id: 2,
                    cap: 2,
                    diemKho: "DiemKho B",
                    key: "2-2",
                    children: [
                        {
                            id: 3,
                            cap: 3,
                            loKho: "Lo kho 1",
                            key: "2-2-2",
                            time: "20/02/2023",
                            checked: false
                        },
                    ]
                }

            ]
        },
        {
            id: 3,
            tenChiCuc: "Chi cục 3",
            diemKho: "",
            cap: 1,
            key: "3",
            children: []
        }

    ];
    dataTableDsDCCuc: any[] = [
        {
            id: 1, ten: "Cục dự trữ khu vực A", soCongVan: "576/KH-CDTVP", ngayTrinhKy: "10/03/2023", tongKinhPhi: 10000000, trichYeu: ""
        },
        {
            id: 1, ten: "Cục dự trữ khu vực B", soCongVan: "576/KH-CDTVP", ngayTrinhKy: "10/03/2023", tongKinhPhi: 10000000, trichYeu: ""
        },
        {
            id: 1, ten: "Cục dự trữ khu vực C", soCongVan: "576/KH-CDTVP", ngayTrinhKy: "10/03/2023", tongKinhPhi: 10000000, trichYeu: ""
        },
        {
            id: 1, ten: "Cục dự trữ khu vực D", soCongVan: "576/KH-CDTVP", ngayTrinhKy: "10/03/2023", tongKinhPhi: 10000000, trichYeu: ""
        },
    ];

    dataTableChiCuc: any[] = [
        {
            id: 1, key: '1', tenChiCuc: "Chi cục A", children: [
                {
                    id: 1, key: '1-1', diemKho: 'Điểm kho A', loKho: 'Lô 1 - Ngăn A1/1', tenChiCucDen: "Chi cục G"
                },
                {
                    id: 2, key: '1-2', diemKho: 'Điểm kho B', loKho: 'Lô 1 - Ngăn A2/1', tenChiCucDen: "Chi cục G"
                },
                {
                    id: 3, key: '1-3', diemKho: 'Điểm kho C', loKho: 'Lô 1 - Ngăn A3/1', tenChiCucDen: "Chi cục G"
                },
            ]
        },
        {
            id: 2, key: '2', tenChiCuc: "Chi cục A", children: [
                {
                    id: 4, key: '2-4', diemKho: 'Điểm kho D', loKho: 'Lô 2 - Ngăn B1/2', tenChiCucDen: "Chi cục G"
                },
                {
                    id: 5, key: '2-5', diemKho: 'Điểm kho E', loKho: 'Lô 2 - Ngăn B2/2', tenChiCucDen: "Chi cục G"
                },
                {
                    id: 6, key: '2-6', diemKho: 'Điểm kho F', loKho: 'Lô 2 - Ngăn B3/2', tenChiCucDen: "Chi cục G"
                },
            ]
        },
    ]
    mapExpandDataTable: any = [];
    mapExpanDataTableChiCuc: any = [];

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
        private cdr: ChangeDetectorRef,) {
        super(httpClient, storageService, notification, spinner, modal, deXuatPhuongAnCuuTroService);
        for (let i = 0; i < 10; i++) {
            this.listNam.push({
                value: dayjs().get('year') + i,
                text: dayjs().get('year') + i,
            });
        }
        this.formData = this.fb.group(
            {
                id: [0],
                nam: [dayjs().get("year")],
                maDvi: ['', [Validators.required]],
                maDviCuc: ['', [Validators.required]],
                maDviChiCucNhan: ['', [Validators.required]],
                ngayDieuChuyen: ['', [Validators.required]],
                loaiNhapXuat: [''],
                kieuNhapXuat: ['Xuất không thu tiền'],
                soDx: ['',],
                loaiVthh: ['', [Validators.required]],
                cloaiVthh: [''],
                tenVthh: [''],
                tonKho: [0],
                ngayDx: [''],
                ngayKetThuc: [''],
                noiDungDx: [''],
                trangThai: [STATUS.DU_THAO],
                idQdPd: [''],
                soQdPd: [''],
                tongSoLuong: [0],
                thanhTien: [0],
                ngayGduyet: [''],
                nguoiGduyetId: [''],
                ngayPduyet: [''],
                nguoiPduyetId: [''],
                lyDoTuChoi: [''],
                tenDvi: [''],
                tenLoaiVthh: [''],
                tenCloaiVthh: [''],
                donViTinh: [''],
                soLuongXuatCap: [''],
                tenTrangThai: ['Dự Thảo'],
                deXuatPhuongAn: [new Array()],

                canCu: [new Array<FileDinhKem>()],
                lyDoDc: [''],
                type: ['CHI_CUC'],
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
        this.mapExpandDataTable = this.mapExpanData(this.dataTable);
        this.mapExpanDataTableChiCuc = this.mapExpanData(this.dataTableChiCuc)
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
    mapExpanData = (list: any[] = []) => {
        let result = list.map(f => {
            if (Array.isArray(f.children) && f.children.length > 0) {
                return { ...f, expand: true, children: this.mapExpanData(f.children) }
            }
            return { ...f }
        });
        return result;
    }
    handleChangeLoaiDC = (value) => {
        this.isTongHop = false;
        this.formData.patchValue({ thoiGianTongHop: '' })
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
        if (this.dataTableDsDCCuc.length > 0) {
            this.dataTableDsDCCuc.forEach(i => i.selected = false);
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
    async save(isGuiDuyet?) {
        await this.spinner.show();
        this.setValidator(isGuiDuyet)
        let body = this.formData.value;
        if (this.formData.value.soQd) {
            // body.soQd = this.formData.value.soQd + "/" + this.maQd;
        }
        body.fileDinhKems = this.fileDinhKem;
        let data = await this.createUpdate(body);
        if (data) {
            // if (isGuiDuyet) {
            //     this.idInput = data.id;
            //     this.guiDuyet();
            // } else {
            //     this.quayLai();
            // }
        }
        await this.spinner.hide();
    }
    tongHop() {
        this.isTongHop = true;
        this.yeuCauSuccess = false;
        const thoiGianTongHop = dayjs().format("YYYY-MM-DD HH:mm:ss")
        this.formData.patchValue({ thoiGianTongHop: thoiGianTongHop })
        // call api tổng hợp dữ liệu
    }
    async saveAndSend(message: string) {
        this.setValidator();

    }

    async saveAndChangeStatus(status: string, message: string, sucessMessage: string) {
        this.setValidator();
    }

    flattenTree(tree) {
        return tree.flatMap((item) => {
            return item.childData ? this.flattenTree(item.childData) : item;
        });
    }


    setValidator(isGuiDuyet?) {
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
