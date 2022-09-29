import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as dayjs from 'dayjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {
  DialogQuyetDinhGiaoChiTieuComponent
} from 'src/app/components/dialog/dialog-quyet-dinh-giao-chi-tieu/dialog-quyet-dinh-giao-chi-tieu.component';
import {
  ChiTietDiaDiemNhapKho,
  DiaDiemNhapKho,
  DialogThemDiaDiemNhapKhoComponent
} from 'src/app/components/dialog/dialog-them-dia-diem-nhap-kho/dialog-them-dia-diem-nhap-kho.component';
import {DialogTuChoiComponent} from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import {MESSAGE} from 'src/app/constants/message';
import {FileDinhKem} from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import {
  DiaDiemGiaoNhan,
  KeHoachBanDauGia,
  PhanLoTaiSan,
} from 'src/app/models/KeHoachBanDauGia';
import {UserLogin} from 'src/app/models/userlogin';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {DanhMucTieuChuanService} from 'src/app/services/quantri-danhmuc/danhMucTieuChuan.service';
import {DeXuatKeHoachBanDauGiaService} from 'src/app/services/deXuatKeHoachBanDauGia.service';
import {DonviService} from 'src/app/services/donvi.service';
import {HelperService} from 'src/app/services/helper.service';
import {TinhTrangKhoHienThoiService} from 'src/app/services/tinhTrangKhoHienThoi.service';
import {UserService} from 'src/app/services/user.service';
import {thongTinTrangThaiNhap} from 'src/app/shared/commonFunction';
import {Globals} from 'src/app/shared/globals';
import VNnum2words from 'vn-num2words';
import {STATUS} from 'src/app/constants/status';
import {
  TongHopPhuongAnCuuTroService
} from "../../../../../services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/TongHopPhuongAnCuuTro.service";
import {
  DialogDanhSachHangHoaComponent
} from "../../../../../components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component";

@Component({
  selector: 'app-thong-tin-tong-hop-phuong-an',
  templateUrl: './thong-tin-tong-hop-phuong-an.component.html',
  styleUrls: ['./thong-tin-tong-hop-phuong-an.component.scss']
})
export class ThongTinTongHopPhuongAnComponent implements OnInit {
  @Input() loaiVthhInput: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input() id: number;
  STATUS = STATUS;
  maTongHop: string;
  formData: FormGroup;
  cacheData: any[] = [];
  fileDinhKem: Array<FileDinhKem> = [];
  userLogin: UserLogin;
  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  titleStatus: string = '';
  titleButtonDuyet: string = '';
  iconButtonDuyet: string = '';
  styleStatus: string = 'du-thao-va-lanh-dao-duyet';
  tabSelected: string = 'thongTinChung';
  listNam: any[] = [];
  listLoaiHangHoa: any[] = [];
  errorInputRequired: string = 'Dữ liệu không được để trống.';
  listPhuongThucThanhToan: any[] = [
    {
      ma: '1',
      giaTri: 'Tiền mặt',
    },
    {
      ma: '2',
      giaTri: 'Chuyển khoản',
    },
  ];
  userInfo: UserLogin;
  listFileDinhKem: any[] = [];
  expandSet = new Set<number>();
  bangPhanBoList: Array<any> = [];
  khBanDauGia: KeHoachBanDauGia = new KeHoachBanDauGia();
  diaDiemGiaoNhan: DiaDiemGiaoNhan = new DiaDiemGiaoNhan();
  diaDiemGiaoNhanList: Array<DiaDiemGiaoNhan> = [];
  phanLoTaiSanList: Array<PhanLoTaiSan> = [];
  listChungLoaiHangHoa: any[] = [];
  maKeHoach: string;
  listLoaiHopDong: any[] = [];
  listLoaiHinhNhapXuat: any[] = []

  constructor(
    private modal: NzModalService,
    private danhMucService: DanhMucService,
    private deXuatKeHoachBanDauGiaService: DeXuatKeHoachBanDauGiaService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private fb: FormBuilder,
    public globals: Globals,
    public userService: UserService,
    private donviService: DonviService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private tongHopPhuongAnCuuTroService: TongHopPhuongAnCuuTroService,
    private dmTieuChuanService: DanhMucTieuChuanService,
    private cdr: ChangeDetectorRef,
    private helperService: HelperService,
  ) {
    this.formData = this.fb.group(
      {
        id: [],
        maDvi: [],
        tenDvi: [],
        maTongHop: [],
        nam: [dayjs().get("year"), [Validators.required]],
        ngayTongHop: [],
        loaiVthh: [],
        cloaiVthh: [],
        tongSoLuong: [],
        trangThai: [],
        loaiHinhNhapXuat: [],
        noiDung: [],
        tenLoaiVthh: [],
        tenCloaiVthh: [],
        tenTrangThai: [],
        thongTinDeXuat: [new Array()],
        thongTinTongHop: [new Array()],
      }
    );
    this.userInfo = this.userService.getUserLogin();
    this.maTongHop = '/' + this.userInfo.MA_TCKT;
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
  }

  async ngOnInit() {
    try {
      this.spinner.show();
      //this.loadDonVi();
      await Promise.all([
        this.dsLoaiHinhNhapXuat(),
        this.loadDetail(this.idInput),

      ])
      console.log(this.formData.value);
      this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      this.spinner.hide();
    }
  }

  async loadDonVi() {
    const res = await this.donviService.layDonViCon();
    this.listChiCuc = [];
    if (res.msg == MESSAGE.SUCCESS) {
      for (let i = 0; i < res.data.length; i++) {
        const item = {
          value: res.data[i].maDvi,
          text: res.data[i].tenDvi,
        };
        this.listChiCuc.push(item);
      }
    }
  }


  async save(isOther?: boolean) {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng điền đủ thông tin');
      console.log(this.formData);
      return;
    }
    this.spinner.show();
    try {
      this.bangPhanBoList.forEach((phanBo) => {
        const phanLoTaiSan = new PhanLoTaiSan();
        phanLoTaiSan.maChiCuc = phanBo.maDvi;
        phanBo.chiTietDiaDiems.forEach((chiTiet) => {
          phanLoTaiSan.chungLoaiHh = chiTiet.tenChungLoaiHh;
          phanLoTaiSan.maDiemKho = chiTiet.maDiemKho;
          phanLoTaiSan.donGia = chiTiet.donGiaChuaVAT;
          phanLoTaiSan.donViTinh = chiTiet.donViTinh;
          phanLoTaiSan.giaKhoiDiem = chiTiet.giaKhoiDiem;
          phanLoTaiSan.maLoKho = chiTiet.maNganLo;
          phanLoTaiSan.maDvTaiSan = chiTiet.maDonViTaiSan;
          phanLoTaiSan.maNganKho = chiTiet.maNganKho;
          phanLoTaiSan.maNhaKho = chiTiet.maNhaKho;
          phanLoTaiSan.soLuong = chiTiet.soLuong;
          phanLoTaiSan.soTienDatTruoc = chiTiet.soTienDatTruoc;
          phanLoTaiSan.tonKho = null;
          this.phanLoTaiSanList = [...this.phanLoTaiSanList, phanLoTaiSan];
        });
      });
      let body = {
        capDv: null,
        diaDiemGiaoNhanList: this.diaDiemGiaoNhanList,
        fileDinhKems: this.listFileDinhKem,
        id: this.formData.get('id').value,
        khoanTienDatTruoc: this.formData.get('khoanTienDatTruoc').value,
        loaiHangHoa: this.formData.get('loaiHangHoa').value,
        loaiHopDong: this.formData.get('loaiHopDong').value,
        loaiVatTuHangHoa: null,
        maDv: null,
        namKeHoach: this.formData.get('namKeHoach').value,
        ngayKy: this.formData.get('ngayKy').value
          ? dayjs(this.formData.get('ngayKy').value).format('YYYY-MM-DD')
          : null,
        ngayLapKeHoach: this.formData.get('ngayLapKeHoach').value
          ? dayjs(this.formData.get('ngayLapKeHoach').value).format(
            'YYYY-MM-DD',
          )
          : null,
        phanLoTaiSanList: this.phanLoTaiSanList,
        phuongThucGiaoNhan: this.formData.get('phuongThucGiaoNhan').value,
        phuongThucThanhToan: this.formData.get('phuongThucThanhToan').value,
        qdGiaoChiTieuId: this.formData.get('qdGiaoChiTieuId').value,
        soKeHoach: this.formData.get('soKeHoach').value,
        soLuong: this.formData.get('soLuong').value,
        tgDkTcDenNgay: this.formData.get('thoiGianDuKien').value
          ? dayjs(this.formData.get('thoiGianDuKien').value[0]).format(
            'YYYY-MM-DD',
          )
          : null,
        tgDkTcTuNgay: this.formData.get('thoiGianDuKien').value
          ? dayjs(this.formData.get('thoiGianDuKien').value[1]).format(
            'YYYY-MM-DD',
          )
          : null,
        thoiGianKyHd: this.formData.get('thoiGianKyHd').value,
        thoiGianKyHopDongGhiChu: this.formData.get('thoiGianKyHdGhiChu').value,
        thoiHanGiaoNhan: this.formData.get('thoiHanGiaoNhan').value,
        thoiHanGiaoNhanGhiChu: this.formData.get('thoiHanGiaoNhanGhiChu').value,
        thoiHanThanhToan: this.formData.get('thoiHanThanhToan').value,
        thoiHanThanhToanGhiChu: this.formData.get('thoiHanThanhToanGhiChu')
          .value,
        thongBaoKhBdg: this.formData.get('thongBaoKhBdg').value,
        tieuChuanChatLuong: this.formData.get('tieuChuanChatLuong').value,
        trangThai: '00',
        trichYeu: this.formData.get('trichYeu').value,
        ghiChu: this.formData.get('ghiChu').value,
      }
      if (this.idInput > 0) {
        let res = await this.deXuatKeHoachBanDauGiaService.sua(body);
        if (res.msg == MESSAGE.SUCCESS) {
          if (!isOther) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.back();
          } else {
            return res.data.id;
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      } else {
        let res = await this.deXuatKeHoachBanDauGiaService.them(body);
        if (res.msg == MESSAGE.SUCCESS) {
          if (!isOther) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            this.back();
          } else {
            return res.data.id;
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(
        MESSAGE.ERROR,
        e?.error?.message ?? MESSAGE.SYSTEM_ERROR,
      );
    }
  }

  back() {
    this.showListEvent.emit();
  }

  quayLai() {
    this.showListEvent.emit();
  }

  async guiDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn gửi duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            trangThaiId: this.globals.prop.NHAP_CHO_DUYET_TP,
          };
          switch (this.khBanDauGia.trangThai) {
            case this.globals.prop.NHAP_DU_THAO:
              body.trangThaiId = this.globals.prop.NHAP_CHO_DUYET_TP;
              break;
            case this.globals.prop.NHAP_CHO_DUYET_TP:
              body.trangThaiId = this.globals.prop.NHAP_CHO_DUYET_LD_CUC;
              break;
            case this.globals.prop.NHAP_CHO_DUYET_LD_CUC:
              body.trangThaiId = this.globals.prop.NHAP_BAN_HANH;
              break;
          }

          let res = await this.deXuatKeHoachBanDauGiaService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(
              MESSAGE.SUCCESS,
              MESSAGE.GUI_DUYET_SUCCESS,
            );
            this.quayLai();
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
            id: this.idInput,
            lyDo: text,
            trangThaiId: this.globals.prop.NHAP_TU_CHOI_TP,
          };
          switch (this.khBanDauGia.trangThai) {
            case this.globals.prop.NHAP_CHO_DUYET_TP:
              body.trangThaiId = this.globals.prop.NHAP_TU_CHOI_TP;
              break;
            case this.globals.prop.NHAP_CHO_DUYET_LD_CUC:
              body.trangThaiId = this.globals.prop.NHAP_TU_CHOI_LD_CUC;
              break;
          }

          const res = await this.deXuatKeHoachBanDauGiaService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
            this.quayLai();
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

  setTitle() {
    let trangThai = this.khBanDauGia.trangThai;
    switch (trangThai) {
      case this.globals.prop.NHAP_DU_THAO: {
        this.titleStatus = 'Dự thảo';
        break;
      }
      case this.globals.prop.NHAP_TU_CHOI_TP: {
        this.iconButtonDuyet = 'htvbdh_tcdt_guiduyet';
        this.titleButtonDuyet = 'Lưu và gửi duyệt';
        this.titleStatus = 'Từ chối - TP';
        break;
      }
      case this.globals.prop.NHAP_CHO_DUYET_TP: {
        this.iconButtonDuyet = 'htvbdh_tcdt_pheduyet';
        this.titleButtonDuyet = 'Duyệt';
        this.titleStatus = 'Chờ duyệt - TP';
        break;
      }
      case this.globals.prop.NHAP_CHO_DUYET_LD_CUC: {
        this.iconButtonDuyet = 'htvbdh_tcdt_baocao2';
        this.titleButtonDuyet = 'Duyệt';
        this.titleStatus = 'Chờ duyệt - LĐ Cục';
        break;
      }
      case this.globals.prop.NHAP_TU_CHOI_LD_CUC: {
        this.iconButtonDuyet = 'htvbdh_tcdt_guiduyet';
        this.titleButtonDuyet = 'Lưu và gửi duyệt';
        this.titleStatus = 'Từ chối - LĐ Cục';
        break;
      }
      case this.globals.prop.NHAP_BAN_HANH: {
        this.titleStatus = 'Ban hành';
        this.styleStatus = 'da-ban-hanh';
        break;
      }
    }
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  async loadDetail(id: number) {
    if (id > 0) {
      await this.tongHopPhuongAnCuuTroService.getDetail(id)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            res.data.maTongHop = res.data.maTongHop.split('/')[0];
            this.formData.patchValue(res.data);
            if (res.data.thongTinTongHop) {
            }
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
        tenDvi: this.userInfo.TEN_DVI
      })
    }
  }

  async synthetic() {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      let invalid = [];
      let controls = this.formData.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name);
        }
      }
      console.log(invalid, 'invalid');
      this.notification.error(MESSAGE.ERROR, 'Vui lòng điền đủ thông tin.');
      return;
    } else {
      try {
        let body = this.formData.value;
        await this.tongHopPhuongAnCuuTroService.syntheic(body).then(res => {
          if (res.msg == MESSAGE.SUCCESS) {
            console.log(res.data);
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        });
      } catch
        (e) {
        console.log(e)
      } finally {
        this.spinner.hide();
      }
    }

  }

  async dsLoaiHinhNhapXuat() {
    let res = await this.danhMucService.danhMucChungGetAll("LOAI_HINH_NHAP_XUAT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhNhapXuat = res.data;
    }
  }

  thongTinTrangThai(trangThai: string): string {
    return thongTinTrangThaiNhap(trangThai);
  }

  openDialogHangHoa() {
    if (!this.isView) {
      let data = this.formData.value.loaiVthh;
      const modalTuChoi = this.modal.create({
        nzTitle: 'Danh sách hàng hóa',
        nzContent: DialogDanhSachHangHoaComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          onlyLuongThuc: true,
        },
      });
      modalTuChoi.afterClose.subscribe(async (data) => {
        if (data) {
          this.formData.patchValue({
            loaiVthh: data.parent.ma,
            tenLoaiVthh: data.parent.ten,
            cloaiVthh: data.ma,
            tenCloaiVthh: data.ten,
          });
        }
      });
    }
  }

  editThongTinTongHop(item: any) {

  }

  deleteThongTinTongHop(idVirtual: any) {

  }


}
