import { ThongBaoDauGiaTaiSanService } from './../../../../../../services/thongBaoDauGiaTaiSan.service';
import { BienBanBanDauGia, Cts } from './../../../../../../models/BienBanBanDauGia';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
import { QuanLyPhieuKiemTraChatLuongHangService } from 'src/app/services/quanLyPhieuKiemTraChatLuongHang.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/quyetDinhGiaoNhapHang.service';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import { UserService } from 'src/app/services/user.service';
import { convertTienTobangChu } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';

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
                [],
            ],
            soBienBan: [
                {
                    value: this.bienBanBanDauGia ? this.bienBanBanDauGia.soBienBan : null,
                    disabled: this.isView ? true : false,
                },
                [],
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
                [],
            ],
            loaiVthh: [
                {
                    value: this.bienBanBanDauGia ? this.bienBanBanDauGia.loaiVthh : null,
                    disabled: this.isView ? true : false,
                },
                [],
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
        let res = await this.quyetDinhGiaoNhapHangService.timKiem(body);
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
        };
        let res = await this.thongBanDauGiaTaiSanService.timKiem(body);
        if (res.msg == MESSAGE.SUCCESS) {
            this.listThongBaoDauGiaTaiSan = res.data.content;
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
                    this.dsChiTietCtsClone = this.bienBanBanDauGia.cts;
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
            nzContent: 'Bạn có chắc chắn muốn gửi duyệt?',
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
                        lyDoTuChoi: null,
                        trangThai: '01',
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
        this.spinner.show();
        this.bienBanBanDauGia.cts.forEach(bb => {
            delete bb.idVirtual;
        })
        try {
            let body = {
                "ct1s": [
                    // {
                    //     "bbBanDauGiaId": 0,
                    //     "donGiaCaoNhat": 0,
                    //     "id": 0,
                    //     "soLanTraGia": 0,
                    //     "thanhTien": 0,
                    //     "traGiaCaoNhat": "string"
                    // }
                ],
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
            console.log("body: ", body);

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
        } else if (trangThai === '02') {
            return 'da-ban-hanh';
        }
    }

    async changeMaThongBao(id: number) {
        this.spinner.show();
        let res = await this.thongBanDauGiaTaiSanService.loadChiTiet(id);
        if (res.msg == MESSAGE.SUCCESS) {
            this.bienBanBanDauGia.donViThongBao = res.data.tenDvi;
            this.bienBanBanDauGia.diaDiem = res.data.diaDiemToChucDauGia;
            this.bienBanBanDauGia.ngayToChuc = [res.data.thoiGianToChucDauGiaTuNgay, res.data.thoiGianToChucDauGiaDenNgay];

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
                this.bienBanBanDauGia.cts = [...this.bienBanBanDauGia.cts, this.chiTietCtsToChucThamGiaDgCreate];
                this.chiTietCtsToChucThamGiaDgCreate.stt = this.bienBanBanDauGia.cts?.filter(bb => bb.loaiTptg === '02').length;
                this.newObjectToChucThamGia();
                break;
            default:
                break;
        }
        this.dsChiTietCtsClone = cloneDeep(this.bienBanBanDauGia.cts);
        console.log("this.dsChiTietCtsClone: ", this.dsChiTietCtsClone);

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
}
