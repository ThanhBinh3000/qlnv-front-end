import { DiaDiemNhapKho, ChiTietDiaDiemNhapKho } from './../../../../../../components/dialog/dialog-them-dia-diem-nhap-kho/dialog-them-dia-diem-nhap-kho.component';
import { ThongBaoDauGiaTaiSanService } from './../../../../../../services/thongBaoDauGiaTaiSan.service';
import { BienBanBanDauGia, Cts, Ct1s } from './../../../../../../models/BienBanBanDauGia';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import { UserLogin } from 'src/app/models/userlogin';
import { ChiTieuKeHoachNamCapTongCucService } from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DonviService } from 'src/app/services/donvi.service';
import { QuanLyBienBanBanDauGiaService } from 'src/app/services/quanLyBienBanBanDauGia.service';
import { QuanLyPhieuKiemTraChatLuongHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/quanLyPhieuKiemTraChatLuongHang.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import { UserService } from 'src/app/services/user.service';
import { convertTienTobangChu } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import { HelperService } from "../../../../../../services/helper.service";

@Component({
    selector: 'app-themmoi-bien-ban-ban-dau-gia',
    templateUrl: './themmoi-bien-ban-ban-dau-gia.component.html',
    styleUrls: ['./themmoi-bien-ban-ban-dau-gia.component.scss']
})
export class ThemmoiBienBanBanDauGiaComponent implements OnInit {
    @Input() id: number;
    @Input() isView: boolean;
    @Input() typeVthh: string;
    @Output()
    showListEvent = new EventEmitter<any>();

    userInfo: UserLogin;
    detail: any = {};
    idNhapHang: number = 0;
    detailGiaoNhap: any = {};

    listDiemKho: any[] = [];
    listNhaKho: any[] = [];
    listNganKho: any[] = [];
    listNganLo: any[] = [];
    listPhieuKiemTraChatLuong: any[] = [];
    listDanhMucHang: any[] = [];
    listSoQuyetDinh: any[] = [];
    listVthh: any[] = [];
    listThongBaoDauGiaTaiSan: Array<any> = [];
    listNam: any[] = [];
    yearNow: number = 0;

    taiLieuDinhKemList: any[] = [];

    create: any = {};
    editDataCache: { [key: string]: { edit: boolean; data: any } } = {};
    expandSet = new Set<number>();
    formData: FormGroup;
    bienBanBanDauGia: BienBanBanDauGia = new BienBanBanDauGia();
    chiTietCtsKhachMoiCreate: Cts = new Cts();
    chiTietCtsDauGiaVienCreate: Cts = new Cts();
    chiTietCtsToChucThamGiaDgCreate: Cts = new Cts();
    dsChiTietCtsClone: Array<Cts> = [];
    bangPhanBoList: Array<any> = [];
    dsToChuc: Array<any> = [];
    ct1sList: Array<Ct1s> = [];
    onExpandChange(id: number, checked: boolean): void {
        if (checked) {
            this.expandSet.add(id);
        } else {
            this.expandSet.delete(id);
        }
    }
    listOfData = [
        {
            id: 1,
            name: 'John Brown',
            age: 32,
            expand: false,
            address: 'New York No. 1 Lake Park',
            description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.'
        },
        {
            id: 2,
            name: 'Jim Green',
            age: 42,
            expand: false,
            address: 'London No. 1 Lake Park',
            description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.'
        },
        {
            id: 3,
            name: 'Joe Black',
            age: 32,
            expand: false,
            address: 'Sidney No. 1 Lake Park',
            description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.'
        }
    ];
    constructor(
        private spinner: NgxSpinnerService,
        private donViService: DonviService,
        private danhMucService: DanhMucService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        private userService: UserService,
        private quanLyBienBanBanDauGiaService: QuanLyBienBanBanDauGiaService,
        private quanLyPhieuKiemTraChatLuongHangService: QuanLyPhieuKiemTraChatLuongHangService,
        public globals: Globals,
        private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
        private uploadFileService: UploadFileService,
        private chiTieuKeHoachNamService: ChiTieuKeHoachNamCapTongCucService,
        private fb: FormBuilder,
        private helperService: HelperService,
        private thongBanDauGiaTaiSanService: ThongBaoDauGiaTaiSanService,
    ) { }

    async ngOnInit() {
        this.spinner.show();
        try {
            this.userInfo = this.userService.getUserLogin();
            this.bienBanBanDauGia.nam = dayjs().year();
            this.yearNow = dayjs().get('year');
            for (let i = -3; i < 23; i++) {
                this.listNam.push({
                    value: this.yearNow - i,
                    text: this.yearNow - i,
                });
            };

            this.initForm();
            await Promise.all([
                // this.loadDiemKho(),
                // this.loadDanhMucHang(),
                // this.loadSoQuyetDinh(),
                this.getListVthh(),
                this.loadThongBaoDauGiaTaiSan()
            ]);

            if (this.id > 0) {
                await this.loadChiTiet(this.id);
            }
            this.spinner.hide();
        } catch (e) {
            console.log('error: ', e);
            this.spinner.hide();
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
    }


    initForm() {
        this.formData = this.fb.group({
            id: [
                {
                    value: this.bienBanBanDauGia ? this.bienBanBanDauGia.id : null,
                    disabled: this.isView ? true : false,
                },
                [],
            ],
            namKeHoach: [
                {
                    value: this.bienBanBanDauGia ? this.bienBanBanDauGia.nam : null,
                    disabled: true,
                },
                [Validators.required],
            ],
            soBienBan: [
                {
                    value: this.bienBanBanDauGia ? this.bienBanBanDauGia.soBienBan : null,
                    disabled: this.isView ? true : false,
                },
                [Validators.required],
            ],
            trichYeu: [
                {
                    value: this.bienBanBanDauGia ? this.bienBanBanDauGia.trichYeu : null,
                    disabled: this.isView ? true : false,
                },
                [],
            ],
            ngayKy: [
                {
                    value: this.bienBanBanDauGia ? this.bienBanBanDauGia.ngayKy : null,
                    disabled: this.isView ? true : false,
                },
                [Validators.required],
            ],
            loaiVthh: [
                {
                    value: this.bienBanBanDauGia ? this.bienBanBanDauGia.loaiVthh : null,
                    disabled: this.isView ? true : false,
                },
                [Validators.required],
            ],
            thongBaoBdgId: [
                {
                    value: this.bienBanBanDauGia ? this.bienBanBanDauGia.thongBaoBdgId : null,
                    disabled: this.isView ? true : false,
                },
                [],
            ],
            donViThongBao: [
                {
                    value: this.bienBanBanDauGia ? this.bienBanBanDauGia.donViThongBao : null,
                    disabled: true,
                },
                [],
            ],
            ngayToChuc: [
                {
                    value: this.bienBanBanDauGia ? this.bienBanBanDauGia.ngayToChuc : null,
                    disabled: true,
                },
                [],
            ],
            trangThai: [
                {
                    value: this.bienBanBanDauGia ? this.bienBanBanDauGia.trangThai : this.globals.prop.NHAP_BAN_HANH,
                    disabled: true,
                },
                [Validators.required],
            ],
            diaDiem: [
                {
                    value: this.bienBanBanDauGia ? this.bienBanBanDauGia.diaDiem : null,
                    disabled: true,
                },
                [],
            ],
        });
    }


    async getListVthh() {
        let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
        if (res.msg == MESSAGE.SUCCESS) {
            if (res.data && res.data.length > 0) {
                res.data.forEach(element => {
                    element.count = 0;
                    this.listVthh.push(element);
                });
            }
        }
    }

    async loadSoQuyetDinh() {
        let body = {
            "denNgayQd": null,
            "loaiQd": "",
            "maDvi": this.userInfo.MA_DVI,
            "maVthh": this.typeVthh,
            "namNhap": null,
            "ngayQd": "",
            "orderBy": "",
            "orderDirection": "",
            "paggingReq": {
                "limit": 1000,
                "orderBy": "",
                "orderType": "",
                "page": 0
            },
            "soHd": "",
            "soQd": null,
            "str": "",
            "trangThai": this.globals.prop.NHAP_BAN_HANH,
            "tuNgayQd": null,
            "veViec": null
        }
        let res = await this.quyetDinhGiaoNhapHangService.search(body);
        if (res.msg == MESSAGE.SUCCESS) {
            let data = res.data;
            this.listSoQuyetDinh = data.content;
        } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
        }
    }



    async loadDanhMucHang() {
        let body = {
            "str": this.typeVthh
        };
        let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha(body);
        if (res.msg == MESSAGE.SUCCESS) {
            if (res.data) {
                this.listDanhMucHang = res.data;
            }
        } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
        }
    }

    async loadThongBaoDauGiaTaiSan() {
        let body = {
            trangThai: this.globals.prop.NHAP_BAN_HANH
        };
        let res = await this.thongBanDauGiaTaiSanService.timKiem(body);
        if (res.msg == MESSAGE.SUCCESS) {
            this.listThongBaoDauGiaTaiSan =
                Array.from(new Set(res.data.content.map(a => a.id)))
                    .map(id => {
                        return res.data.content.find(a => a.id === id)
                    })
            this.listThongBaoDauGiaTaiSan = this.listThongBaoDauGiaTaiSan.filter(obj => {
                return !obj.hasOwnProperty('bienBanBDG') || obj.bienBanBDG == null;
            })
        } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
        }
    }

    changeDanhMucHang(item) {
        if (item) {
            let getHang = this.listDanhMucHang.filter(x => x.ten == this.create.tenVatTu);
            if (getHang && getHang.length > 0) {
                item.maVatTu = getHang[0].ma;
                item.donViTinh = getHang[0].maDviTinh;
            }
        }
    }

    async loadChiTiet(id) {
        if (id > 0) {
            let res = await this.quanLyBienBanBanDauGiaService.loadChiTiet(id);
            if (res.msg == MESSAGE.SUCCESS) {
                if (res.data) {
                    this.bienBanBanDauGia = res.data;
                    this.bienBanBanDauGia.ngayToChuc = [res.data.ngayToChucTu, res.data.ngayToChucDen];
                    this.dsChiTietCtsClone = this.bienBanBanDauGia.cts;
                    this.dsChiTietCtsClone.forEach(cts => {
                        if (cts.loaiTptg === '02') {
                            this.dsToChuc = [...this.dsToChuc, cts];
                        }
                    })
                    const phanLoTaiSans = res.data.ct1s;
                    if (phanLoTaiSans && phanLoTaiSans.length > 0) {
                        for (let i = 0; i <= phanLoTaiSans.length - 1; i++) {
                            for (let j = i + 1; j <= phanLoTaiSans.length; j++) {
                                if (phanLoTaiSans.length == 1 || phanLoTaiSans[i].chiCuc === phanLoTaiSans[j].chiCuc) {
                                    const diaDiemNhapKho = new DiaDiemNhapKho();
                                    diaDiemNhapKho.maDvi = phanLoTaiSans[i].maChiCuc;
                                    diaDiemNhapKho.tenDonVi = phanLoTaiSans[i].tenChiCuc;
                                    diaDiemNhapKho.slDaLenKHBan = phanLoTaiSans[i].slDaLenKHBan;
                                    diaDiemNhapKho.soLuong = phanLoTaiSans[i].soLuong;
                                    const chiTietDiaDiem = new ChiTietDiaDiemNhapKho();
                                    chiTietDiaDiem.tonKho = phanLoTaiSans[i].tonKho;
                                    chiTietDiaDiem.giaKhoiDiem = phanLoTaiSans[i].giaKhoiDiem;
                                    chiTietDiaDiem.soTienDatTruoc = phanLoTaiSans[i].soTienDatTruoc;
                                    chiTietDiaDiem.maDiemKho = phanLoTaiSans[i].maDiemKho;
                                    chiTietDiaDiem.tenDiemKho = phanLoTaiSans[i].tenDiemKho;
                                    chiTietDiaDiem.maNhaKho = phanLoTaiSans[i].maNhaKho;
                                    chiTietDiaDiem.tenNhaKho = phanLoTaiSans[i].tenNhaKho;
                                    chiTietDiaDiem.maNganKho = phanLoTaiSans[i].maNganKho;
                                    chiTietDiaDiem.tenNganKho = phanLoTaiSans[i].tenNganKho;
                                    chiTietDiaDiem.maNganLo = phanLoTaiSans[i].maLoKho;
                                    chiTietDiaDiem.tenLoKho = phanLoTaiSans[i].tenLoKho;
                                    chiTietDiaDiem.chungLoaiHh = phanLoTaiSans[i].chungLoaiHh;
                                    chiTietDiaDiem.donViTinh = phanLoTaiSans[i].donViTinh;
                                    chiTietDiaDiem.tenChungLoaiHh = phanLoTaiSans[i].tenChungLoaiHh;
                                    chiTietDiaDiem.maDonViTaiSan = phanLoTaiSans[i].maDvTaiSan;
                                    chiTietDiaDiem.soLuong = phanLoTaiSans[i].soLuong;
                                    chiTietDiaDiem.donGiaChuaVAT = phanLoTaiSans[i].donGia;
                                    chiTietDiaDiem.idVirtual = phanLoTaiSans[i].id;
                                    chiTietDiaDiem.soLanTraGia = phanLoTaiSans[i].soLanTraGia;
                                    chiTietDiaDiem.donGiaCaoNhat = phanLoTaiSans[i].donGiaCaoNhat;
                                    chiTietDiaDiem.hoTen = phanLoTaiSans[i].traGiaCaoNhat;
                                    chiTietDiaDiem.thanhTien = phanLoTaiSans[i].thanhTien;
                                    diaDiemNhapKho.chiTietDiaDiems.push(chiTietDiaDiem);
                                    this.bangPhanBoList.push(diaDiemNhapKho);
                                }
                            }
                        }
                    }
                    this.initForm();
                }
            }
        }
        else {
            this.detail.ngayTao = dayjs().format("YYYY-MM-DD");
        }
    }

    convertTien(tien: number): string {
        return convertTienTobangChu(tien);
    }

    async loadDiemKho() {
        let body = {
            maDviCha: this.detail.maDvi,
            trangThai: '01',
        }
        const res = await this.donViService.getTreeAll(body);
        if (res.msg == MESSAGE.SUCCESS) {
            if (res.data && res.data.length > 0) {
                res.data.forEach(element => {
                    if (element && element.capDvi == '3' && element.children) {
                        this.listDiemKho = [
                            ...this.listDiemKho,
                            ...element.children
                        ]
                    }
                });
            }
        } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
        }
    }

    guiDuyet() {
        this.modal.confirm({
            nzClosable: false,
            nzTitle: 'Xác nhận',
            nzContent: 'Bạn có chắc chắn muốn ban hành?',
            nzOkText: 'Đồng ý',
            nzCancelText: 'Không',
            nzOkDanger: true,
            nzWidth: 310,
            nzOnOk: async () => {
                this.spinner.show();
                try {
                    await this.save(true);
                    let body = {
                        id: this.id,
                        lyDo: null,
                        trangThai: this.globals.prop.NHAP_BAN_HANH,
                    };
                    let res =
                        await this.quanLyBienBanBanDauGiaService.updateStatus(
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

    pheDuyet() {
        this.modal.confirm({
            nzClosable: false,
            nzTitle: 'Xác nhận',
            nzContent: 'Bạn có chắc chắn muốn phê duyệt?',
            nzOkText: 'Đồng ý',
            nzCancelText: 'Không',
            nzOkDanger: true,
            nzWidth: 310,
            nzOnOk: async () => {
                this.spinner.show();
                try {
                    let body = {
                        id: this.id,
                        lyDoTuChoi: null,
                        trangThai: '02',
                    };
                    let res =
                        await this.quanLyBienBanBanDauGiaService.updateStatus(
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

    hoanThanh() {
        this.modal.confirm({
            nzClosable: false,
            nzTitle: 'Xác nhận',
            nzContent: 'Bạn có chắc chắn muốn hoàn thành biên bản?',
            nzOkText: 'Đồng ý',
            nzCancelText: 'Không',
            nzOkDanger: true,
            nzWidth: 310,
            nzOnOk: async () => {
                this.spinner.show();
                try {
                    let body = {
                        id: this.id,
                        lyDoTuChoi: null,
                        trangThai: '04',
                    };
                    let res =
                        await this.quanLyBienBanBanDauGiaService.updateStatus(
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
                        trangThai: '03',
                    };
                    let res =
                        await this.quanLyBienBanBanDauGiaService.updateStatus(
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

    async save(isOther: boolean) {
        this.helperService.markFormGroupTouched(this.formData);
        if (this.formData.invalid) {
            console.log('VOAOOOOO DAYYYYYYY')
            this.spinner.hide();
            return;
        }
        this.spinner.show();
        this.bienBanBanDauGia.cts.forEach(bb => {
            delete bb.idVirtual;
        })
        this.bangPhanBoList?.forEach(phanLo => {
            phanLo.chiTietDiaDiems?.forEach(chiTiet => {
                const ct1sTemp = new Ct1s();
                ct1sTemp.donGiaCaoNhat = chiTiet.donGiaCaoNhat;
                ct1sTemp.soLanTraGia = chiTiet.soLanTraGia;
                ct1sTemp.traGiaCaoNhat = chiTiet.hoTen;
                ct1sTemp.id = chiTiet.idVirtual;
                this.ct1sList = [...this.ct1sList, ct1sTemp];
            });
        })
        try {
            let body = {
                "ct1s": this.ct1sList,
                "cts": this.bienBanBanDauGia.cts,
                "diaDiem": this.formData.get('diaDiem').value,
                "donViThongBao": this.formData.get('donViThongBao').value,
                "id": this.bienBanBanDauGia.id,
                "loaiVthh": this.formData.get('loaiVthh').value,
                "maVatTuCha": this.formData.get('loaiVthh').value,
                "nam": this.formData.get('namKeHoach').value,
                "ngayKy": this.formData.get('ngayKy').value ? dayjs(this.formData.get('ngayKy').value).format(
                    'YYYY-MM-DD',
                )
                    : null,
                "ngayToChucDen": this.formData.get('ngayToChuc').value ? dayjs(this.formData.get('ngayToChuc').value[1]).format(
                    'YYYY-MM-DD',
                )
                    : null,
                "ngayToChucTu": this.formData.get('ngayToChuc').value ? dayjs(this.formData.get('ngayToChuc').value[0]).format(
                    'YYYY-MM-DD',
                )
                    : null,
                "soBienBan": this.formData.get('soBienBan').value,
                "thongBaoBdgId": this.formData.get('thongBaoBdgId').value,
                "trichYeu": this.formData.get('trichYeu').value
            };

            if (this.id > 0) {
                let res = await this.quanLyBienBanBanDauGiaService.sua(
                    body,
                );
                if (res.msg == MESSAGE.SUCCESS) {
                    if (!isOther) {
                        this.notification.success(
                            MESSAGE.SUCCESS,
                            MESSAGE.UPDATE_SUCCESS,
                        );
                        this.back();
                    }
                } else {
                    this.notification.error(MESSAGE.ERROR, res.msg);
                }
            } else {
                let res = await this.quanLyBienBanBanDauGiaService.them(
                    body,
                );
                if (res.msg == MESSAGE.SUCCESS) {
                    if (!isOther) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                        this.back();
                    }
                } else {
                    this.notification.error(MESSAGE.ERROR, res.msg);
                }
            }
            this.spinner.hide();
        } catch (e) {
            console.log('error: ', e);
            this.spinner.hide();
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
    }

    print() {

    }

    thongTinTrangThai(trangThai: string): string {
        if (
            trangThai === '00' ||
            trangThai === '01' ||
            trangThai === '04' ||
            trangThai === '03'
        ) {
            return 'du-thao-va-lanh-dao-duyet';
        } else if (trangThai === this.globals.prop.NHAP_BAN_HANH) {
            return 'da-ban-hanh';
        }
    }

    async changeMaThongBao(id: number) {
        if (!id) {
            return;
        }
        this.spinner.show();
        let res = await this.thongBanDauGiaTaiSanService.loadChiTiet(id);
        if (res.msg == MESSAGE.SUCCESS) {
            this.bienBanBanDauGia.donViThongBao = res.data.tenDvi;
            this.bienBanBanDauGia.diaDiem = res.data.diaDiemToChucDauGia;
            this.bienBanBanDauGia.ngayToChuc = [res.data.thoiGianToChucDauGiaTuNgay, res.data.thoiGianToChucDauGiaDenNgay];
            const phanLoTaiSans = res.data.taiSanBdgList;
            if (phanLoTaiSans && phanLoTaiSans.length > 0) {
                for (let i = 0; i <= phanLoTaiSans.length - 1; i++) {
                    for (let j = i + 1; j <= phanLoTaiSans.length; j++) {
                        if (phanLoTaiSans.length == 1 || phanLoTaiSans[i].chiCuc === phanLoTaiSans[j].chiCuc) {
                            const diaDiemNhapKho = new DiaDiemNhapKho();
                            diaDiemNhapKho.maDvi = phanLoTaiSans[i].maChiCuc;
                            diaDiemNhapKho.tenDonVi = phanLoTaiSans[i].tenChiCuc;
                            diaDiemNhapKho.slDaLenKHBan = phanLoTaiSans[i].slDaLenKHBan;
                            diaDiemNhapKho.soLuong = phanLoTaiSans[i].soLuong;
                            const chiTietDiaDiem = new ChiTietDiaDiemNhapKho();
                            chiTietDiaDiem.tonKho = phanLoTaiSans[i].tonKho;
                            chiTietDiaDiem.giaKhoiDiem = phanLoTaiSans[i].giaKhoiDiem;
                            chiTietDiaDiem.soTienDatTruoc = phanLoTaiSans[i].soTienDatTruoc;
                            chiTietDiaDiem.maDiemKho = phanLoTaiSans[i].maDiemKho;
                            chiTietDiaDiem.tenDiemKho = phanLoTaiSans[i].tenDiemKho;
                            chiTietDiaDiem.maNhaKho = phanLoTaiSans[i].maNhaKho;
                            chiTietDiaDiem.tenNhaKho = phanLoTaiSans[i].tenNhaKho;
                            chiTietDiaDiem.maNganKho = phanLoTaiSans[i].maNganKho;
                            chiTietDiaDiem.tenNganKho = phanLoTaiSans[i].tenNganKho;
                            chiTietDiaDiem.maNganLo = phanLoTaiSans[i].maLoKho;
                            chiTietDiaDiem.tenLoKho = phanLoTaiSans[i].tenLoKho;
                            chiTietDiaDiem.chungLoaiHh = phanLoTaiSans[i].chungLoaiHh;
                            chiTietDiaDiem.donViTinh = phanLoTaiSans[i].donViTinh;
                            chiTietDiaDiem.tenChungLoaiHh = phanLoTaiSans[i].tenChungLoaiHh;
                            chiTietDiaDiem.maDonViTaiSan = phanLoTaiSans[i].maDvTaiSan;
                            chiTietDiaDiem.soLuong = phanLoTaiSans[i].soLuong;
                            chiTietDiaDiem.donGiaChuaVAT = phanLoTaiSans[i].donGia;
                            chiTietDiaDiem.idVirtual = phanLoTaiSans[i].id;
                            diaDiemNhapKho.chiTietDiaDiems.push(chiTietDiaDiem);
                            this.bangPhanBoList.push(diaDiemNhapKho);
                        }
                    }
                }
            }

            this.formData.patchValue({
                ngayToChuc: this.bienBanBanDauGia.ngayToChuc,
                donViThongBao: this.bienBanBanDauGia.donViThongBao,
                diaDiem: this.bienBanBanDauGia.diaDiem
            })

        } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
        }
        this.spinner.hide();
    }
    newObjectKhachMoi() {
        this.chiTietCtsKhachMoiCreate = new Cts();
    }
    newObjectDauGiaVien() {
        this.chiTietCtsDauGiaVienCreate = new Cts();
    }
    newObjectToChucThamGia() {
        this.chiTietCtsToChucThamGiaDgCreate = new Cts();
    }

    addKhachMoi(type: string) {
        if ((type === '00' && !this.chiTietCtsKhachMoiCreate.hoTen) ||
            (type === '01' && !this.chiTietCtsDauGiaVienCreate.hoTen) ||
            (type === '02' && !this.chiTietCtsToChucThamGiaDgCreate.hoTen)) {
            return;
        }
        switch (type) {
            case "00":
                this.chiTietCtsKhachMoiCreate.idVirtual = new Date().getTime();
                this.chiTietCtsKhachMoiCreate.loaiTptg = type;
                this.bienBanBanDauGia.cts = [...this.bienBanBanDauGia.cts, this.chiTietCtsKhachMoiCreate];
                this.chiTietCtsKhachMoiCreate.stt = this.bienBanBanDauGia.cts?.filter(bb => bb.loaiTptg === '00').length;
                this.newObjectKhachMoi();
                break;
            case "01":
                this.chiTietCtsDauGiaVienCreate.idVirtual = new Date().getTime();
                this.chiTietCtsDauGiaVienCreate.loaiTptg = type;
                this.bienBanBanDauGia.cts = [...this.bienBanBanDauGia.cts, this.chiTietCtsDauGiaVienCreate];
                this.chiTietCtsDauGiaVienCreate.stt = this.bienBanBanDauGia.cts?.filter(bb => bb.loaiTptg === '01').length;
                this.newObjectDauGiaVien();
                break;
            case "02":
                this.chiTietCtsToChucThamGiaDgCreate.idVirtual = new Date().getTime();
                this.chiTietCtsToChucThamGiaDgCreate.loaiTptg = type;
                this.dsToChuc = [...this.dsToChuc, this.chiTietCtsToChucThamGiaDgCreate];
                this.bienBanBanDauGia.cts = [...this.bienBanBanDauGia.cts, this.chiTietCtsToChucThamGiaDgCreate];
                this.chiTietCtsToChucThamGiaDgCreate.stt = this.bienBanBanDauGia.cts?.filter(bb => bb.loaiTptg === '02').length;

                this.newObjectToChucThamGia();
                break;
            default:
                break;
        }
        this.dsChiTietCtsClone = cloneDeep(this.bienBanBanDauGia.cts);

    }
    saveEdit(i: number) {
        this.dsChiTietCtsClone[i].isEdit = false;
        Object.assign(
            this.bienBanBanDauGia.cts[i],
            this.dsChiTietCtsClone[i],
        );
    }
    cancelEdit(index: number) {
        this.dsChiTietCtsClone = cloneDeep(this.bienBanBanDauGia.cts);
        this.dsChiTietCtsClone[index].isEdit = false;
    }
    startEdit(index: number) {
        this.dsChiTietCtsClone[index].isEdit = true;
    }
    deleteData(id: number) {
        this.modal.confirm({
            nzClosable: false,
            nzTitle: 'Xác nhận',
            nzContent: 'Bạn có chắc chắn muốn xóa?',
            nzOkText: 'Đồng ý',
            nzCancelText: 'Không',
            nzOkDanger: true,
            nzWidth: 310,
            nzOnOk: () => {
                this.bienBanBanDauGia.cts =
                    this.bienBanBanDauGia.cts.filter(
                        (ddNhapKho) => ddNhapKho.idVirtual !== id,
                    );
                this.dsChiTietCtsClone = cloneDeep(
                    this.bienBanBanDauGia.cts,
                );
            },
        });
    }
    isDisableField() {
        if (this.bienBanBanDauGia && (this.bienBanBanDauGia.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP || this.bienBanBanDauGia.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.bienBanBanDauGia.trangThai == this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC)) {
            return true;
        }
    }
}
