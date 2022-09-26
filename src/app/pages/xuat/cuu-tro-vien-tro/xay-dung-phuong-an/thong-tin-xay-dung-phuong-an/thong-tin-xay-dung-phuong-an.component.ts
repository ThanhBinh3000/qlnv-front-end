import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output,} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as dayjs from 'dayjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {
  DialogQuyetDinhGiaoChiTieuComponent
} from 'src/app/components/dialog/dialog-quyet-dinh-giao-chi-tieu/dialog-quyet-dinh-giao-chi-tieu.component';
import {
  DialogThemDiaDiemNhapKhoComponent
} from 'src/app/components/dialog/dialog-them-dia-diem-nhap-kho/dialog-them-dia-diem-nhap-kho.component';
import {DialogTuChoiComponent} from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import {MESSAGE} from 'src/app/constants/message';
import {DiaDiemGiaoNhan, KeHoachBanDauGia, PhanLoTaiSan,} from 'src/app/models/KeHoachBanDauGia';
import {UserLogin} from 'src/app/models/userlogin';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {DanhMucTieuChuanService} from 'src/app/services/danhMucTieuChuan.service';
import {DeXuatKeHoachBanDauGiaService} from 'src/app/services/deXuatKeHoachBanDauGia.service';
import {DonviService} from 'src/app/services/donvi.service';
import {HelperService} from 'src/app/services/helper.service';
import {TinhTrangKhoHienThoiService} from 'src/app/services/tinhTrangKhoHienThoi.service';
import {UserService} from 'src/app/services/user.service';
import {thongTinTrangThaiNhap} from 'src/app/shared/commonFunction';
import {Globals} from 'src/app/shared/globals';
import VNnum2words from 'vn-num2words';
import {
  DeXuatPhuongAnCuuTroService
} from "../../../../../services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/DeXuatPhuongAnCuuTro.service";
import {STATUS} from "../../../../../constants/status";
import {
  DialogDanhSachHangHoaComponent
} from "../../../../../components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component";
import {DatePipe} from "@angular/common";
import {
  DialogDiaDiemNhapKhoComponent
} from "../../../../../components/dialog/dialog-dia-diem-nhap-kho/dialog-dia-diem-nhap-kho.component";
import {cloneDeep} from 'lodash';

//obj declare
export class DiaDiemNhapKho {
  idVirtual: number;
  maDvi: string;
  tenDvi: string;
  soLuong: number = 0;
  thanhTien: number = 0;
  soLuongTheoChiTieu: number;
  slDaLenKHBan: number;
  tongKhoanTienDatTruoc: string;
  tongGiaKhoiDiem: string;
  donViTinh: string;
  chiTietDiaDiems: ChiTietDiaDiemNhapKho[] = [];
  tenChiCuc: string;
}

export class ChiTietDiaDiemNhapKho {
  maDiemKho: string;
  maNhaKho: string;
  maNganKho: string;
  maLoKho: string;
  tenDiemKho: string;
  tenNhaKho: string;
  tenNganKho: string;
  tenLoKho: string;
  cloaiVthh: string;
  tenCloaiVthh: string;
  donViTinh: string;
  maDvTaiSan: string;
  tonKho: number;
  soLuong: number;
  donGia: number;
  donGiaChuaVAT: number;
  giaKhoiDiem: number;
  soTienDatTruoc: number;
  idVirtual: number;
  soLanTraGia: number;
  donGiaCaoNhat: number;
  traGiaCaoNhat: string;
  hoTen: string;
  thanhTien: number;
  isEdit: boolean;
}

@Component({
  selector: 'app-thong-tin-xay-dung-phuong-an',
  templateUrl: './thong-tin-xay-dung-phuong-an.component.html',
  styleUrls: ['./thong-tin-xay-dung-phuong-an.component.scss']
})

export class ThongTinXayDungPhuongAnComponent implements OnInit {
  @Input() loaiVthhInput: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input() id: number;
  formData: FormGroup;
  cacheData: any[] = [];
  fileDinhKem: any[] = [];
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
  userInfo: UserLogin;
  expandSet = new Set<number>();
  bangPhanBoList: Array<any> = [];
  khBanDauGia: KeHoachBanDauGia = new KeHoachBanDauGia();
  diaDiemGiaoNhan: DiaDiemGiaoNhan = new DiaDiemGiaoNhan();
  diaDiemGiaoNhanList: Array<DiaDiemGiaoNhan> = [];
  phanLoTaiSanList: Array<PhanLoTaiSan> = [];
  listChungLoaiHangHoa: any[] = [];
  maDeXuat: string;
  listLoaiHopDong: any[] = [];
  STATUS = STATUS;
  listLoaiHinhNhapXuat: any[] = [];
  listKieuNhapXuat: any[] = [];
  datePipe = new DatePipe('en-US');
  tongSLThongTinChiTiet = 0;
  tongSLCuuTro = 0;
  tongTien = 0;
  diaDiemNhapKho: any[] = [];
  thongTinChiTietCreate: any = {};
  thongTinChiTietClone: any = {};
  phuongAnXuatList: DiaDiemNhapKho[] = [];


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
    private dmTieuChuanService: DanhMucTieuChuanService,
    private deXuatPhuongAnCuuTroService: DeXuatPhuongAnCuuTroService,
    private cdr: ChangeDetectorRef,
    private helperService: HelperService,
  ) {
    this.formData = this.fb.group(
      {
        id: [],
        loaiNhapXuat: [],
        soDxuat: [],
        maDvi: [''],
        tenDvi: [],
        ngayDxuat: [],
        loaiVthh: [],
        cloaiVthh: [],
        tenLoaiVthh: [],
        tenCloaiVthh: [],
        tenVthh: [],
        tongSoLuong: [],
        trichYeu: [],
        trangThai: [STATUS.DU_THAO],
        trangThaiTh: [],
        tenTrangThai: ['Dự thảo'],
        tenTrangThaiTh: [],
        loaiHinhNhapXuat: [],
        kieuNhapXuat: [],
        thoiGianThucHien: [],
        noiDung: [],
        nam: [dayjs().get("year"), [Validators.required]],
        fileDinhKem: [new Array()],
        thongTinChiTiet: [new Array()],
        phuongAnXuat: [new Array()],
      }
    );
    this.userInfo = this.userService.getUserLogin();
    this.maDeXuat = '/' + this.userInfo.MA_TCKT;
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
    // this.setTitle();
  }

  async ngOnInit() {
    try {
      this.spinner.show();
      //this.loadDonVi();
      await Promise.all([
        this.dsLoaiHinhNhapXuat(),
        this.dsKieuNhapXuat(),
        this.loadDetail(this.idInput),

      ])
      // await Promise.all([this.loaiVTHHGetAll(), this.loaiHopDongGetAll()]);
      console.log(this.formData.value);
      this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      this.spinner.hide();
    }
  }

  async loaiHopDongGetAll() {
    this.listLoaiHopDong = [];
    let res = await this.danhMucService.loaiHopDongGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiHopDong = res.data;
    }
  }

  openDialogQuyetDinhGiaoChiTieu() {
    if (this.idInput >= 0 && !this.isView) {
      const modalQD = this.modal.create({
        nzTitle: 'Thông tin QĐ giao chỉ tiêu kế hoạch',
        nzContent: DialogQuyetDinhGiaoChiTieuComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          capDonVi: 2,
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          this.formData.patchValue({
            qdGiaoChiTieuId: data ? data.id : null,
            qdGiaoChiTieuNam: data ? data.soQuyetDinh : null,
          });
          this.spinner.hide();
        }
      });
    }
  }

  async changeChiCuc(event, index?) {
    const res = await this.tinhTrangKhoHienThoiService.getChiCucByMaTongCuc(
      event,
    );
    this.listDiemKho = [];
    if (res.msg == MESSAGE.SUCCESS) {
      for (let i = 0; i < res.data?.child.length; i++) {
        const item = {
          value: res.data.child[i].maDiemkho,
          text: res.data.child[i].tenDiemkho,
          diaDiemNhap: res.data.child[i].diaDiem,
        };
        this.listDiemKho.push(item);
      }
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

  themMoiBangPhanLoTaiSan(item?: any) {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng điền đủ thông tin');
      console.log(this.formData);
      return;
    }
    if (
      !this.formData.get('loaiHangHoa').value ||
      !this.formData.get('qdGiaoChiTieuNam').value ||
      !this.formData.get('khoanTienDatTruoc').value
    ) {
      return;
    }
    const modalGT = this.modal.create({
      nzTitle: 'Thêm địa điểm nhập kho',
      nzContent: DialogThemDiaDiemNhapKhoComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1162px',
      nzFooter: null,
      nzComponentParams: {
        phanLoTaiSanEdit: item ?? null,
        loaiHangHoa: this.formData.get('loaiHangHoa').value,
        idChiTieu: this.formData.get('qdGiaoChiTieuId').value,
        khoanTienDatTruoc: this.formData.get('khoanTienDatTruoc').value,
      },
    });

    modalGT.afterClose.subscribe((res) => {
      if (!res) {
        return;
      }

      this.checkExistBangPhanLo(res);
      this.diaDiemGiaoNhanList = [];
      this.bangPhanBoList.forEach((phanLo) => {
        this.donviService.getDonVi(phanLo.maDvi).then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const ddGiaoNhan = new DiaDiemGiaoNhan();
            ddGiaoNhan.id = res.data?.id;
            ddGiaoNhan.tenChiCuc = res.data?.tenDvi;
            ddGiaoNhan.diaChi = res.data?.diaChi;
            ddGiaoNhan.soLuong = phanLo.soLuong;
            this.diaDiemGiaoNhanList = [
              ...this.diaDiemGiaoNhanList,
              ddGiaoNhan,
            ];
            const tongSoLuong = this.diaDiemGiaoNhanList.reduce(
              (previousChiTiet, currentChiTiet) =>
                previousChiTiet + currentChiTiet.soLuong,
              0,
            );
            this.formData.patchValue({
              soLuong: tongSoLuong
                ? Intl.NumberFormat('en-US').format(tongSoLuong)
                : '0',
            });
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        });
      });
    });
  }

  checkExistBangPhanLo(data: any) {

    if (this.bangPhanBoList) {
      let indexExist = this.bangPhanBoList.findIndex(
        (x) => x.maDvi == data.maDvi,
      );
      if (indexExist != -1) {
        this.bangPhanBoList.splice(indexExist, 1);
      }
    } else {
      this.bangPhanBoList = [];
    }
    this.bangPhanBoList = [...this.bangPhanBoList, data];
  }

  async save(isOther?: boolean) {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng điền đủ thông tin');
      return;
    } else {
      try {
        this.spinner.show();
        let body = this.formData.value;
        // body.fileDinhKem = this.fileDinhKem;
        body.ngayDxuat = this.datePipe.transform(body.ngayDxuat, 'yyyy-MM-dd');
        body.thoiGianThucHien = this.datePipe.transform(body.thoiGianThucHien, 'yyyy-MM-dd');
        body.soDxuat = body.soDxuat + this.maDeXuat;
        if (this.idInput) {
          let res = await this.deXuatPhuongAnCuuTroService.update(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        } else {
          body.loaiVthh = "0101";
          body.cloaiVthh = "010101";
          body.loaiHinhNhapXuat = "A";
          body.kieuNhapXuat = "B";
          let res = await this.deXuatPhuongAnCuuTroService.create(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        }
      } catch (e) {
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

  async dsKieuNhapXuat() {
    let res = await this.danhMucService.danhMucChungGetAll("KIEU_NHAP_XUAT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listKieuNhapXuat = res.data;
    }
  }

  async loaiVTHHGetAll() {
    let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      if (!this.loaiVthhInput) {
        this.listLoaiHangHoa = res.data;
      } else {
        this.listLoaiHangHoa = res.data?.filter((x) => x.ma == this.loaiVthhInput);
      }
    }
  }

  async loadDetail(id: number) {
    if (id > 0) {
      await this.deXuatPhuongAnCuuTroService.getDetail(id)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            res.data.soDxuat = res.data.soDxuat.split('/')[0];
            this.formData.patchValue(res.data);
            this.fileDinhKem = this.formData.get('fileDinhKem').value;
            if (res.data.phuongAnXuat) {
              let nhapKhoList: DiaDiemNhapKho[] = [];
              res.data.phuongAnXuat.forEach(s => {
                let kho = nhapKhoList.find(r => r.maDvi == s.maDvi);
                if (!kho) {
                  kho = new DiaDiemNhapKho();
                }
                kho.idVirtual = s.maDvi;
                kho.tenChiCuc = s.tenChiCuc;
                kho.soLuong += s.soLuong;
                kho.thanhTien += s.soLuong * s.donGia;
                kho.maDvi = s.maChiCuc;
                let khoChiTiet = new ChiTietDiaDiemNhapKho();
                Object.assign(khoChiTiet, s);
                kho.chiTietDiaDiems.push(khoChiTiet);
                nhapKhoList = nhapKhoList.filter(r => r != kho);
                nhapKhoList.push(kho);

                this.expandSet.add(kho.idVirtual);
                if (s.donViTinh === 'tấn') {
                  this.tongSLCuuTro += s.soLuong * 1000;
                } else {
                  this.tongSLCuuTro += s.soLuong;
                }
                this.tongTien += s.soLuong * s.donGia;
              });
              this.phuongAnXuatList = nhapKhoList;
              this.formData.patchValue({tongSoLuong: this.tongSLCuuTro})
            }
            this.tongSLThongTinChiTiet = 0;
            this.formData.get('thongTinChiTiet').value.forEach(s => this.tongSLThongTinChiTiet += parseInt(s.soLuong));
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

  convertTienTobangChu(tien: number): string {
    return VNnum2words(tien);
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
    let trangThai = this.formData.get('trangThai').value;
    switch (trangThai) {
      case STATUS.DU_THAO: {
        this.titleStatus = 'Dự thảo';
        break;
      }
      case STATUS.TU_CHOI_TP: {
        this.iconButtonDuyet = 'htvbdh_tcdt_guiduyet';
        this.titleButtonDuyet = 'Lưu và gửi duyệt';
        this.titleStatus = 'Từ chối - TP';
        break;
      }
      case STATUS.CHO_DUYET_TP: {
        this.iconButtonDuyet = 'htvbdh_tcdt_pheduyet';
        this.titleButtonDuyet = 'Duyệt';
        this.titleStatus = 'Chờ duyệt - TP';
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        this.iconButtonDuyet = 'htvbdh_tcdt_baocao2';
        this.titleButtonDuyet = 'Duyệt';
        this.titleStatus = 'Chờ duyệt - LĐ Cục';
        break;
      }
      case STATUS.TU_CHOI_LDC: {
        this.iconButtonDuyet = 'htvbdh_tcdt_guiduyet';
        this.titleButtonDuyet = 'Lưu và gửi duyệt';
        this.titleStatus = 'Từ chối - LĐ Cục';
        break;
      }
      case STATUS.BAN_HANH: {
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

  thongTinTrangThai(trangThai: string): string {
    return thongTinTrangThaiNhap(trangThai);
  }

  isDetailPermission() {
    return true;
  }

  selectHangHoa() {
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

  themPhuongAn() {
    let data = this.loaiVthhInput;
    const modalTuChoi = this.modal.create({
      nzTitle: 'Danh sách hàng hóa',
      nzContent: DialogDiaDiemNhapKhoComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '100%',
      nzFooter: null,
      nzComponentParams: {
        loaiHangHoa: this.formData.get('loaiVthh').value,
        cLoaiVthh: this.formData.get('cloaiVthh').value,
        // tenCloaiVthh: this.formData.get('tenCloaiVthh').value,
        nam: this.formData.get('nam').value
      },
    });
    modalTuChoi.afterClose.subscribe(async (data) => {
      if (data) {
        this.phuongAnXuatList.push(data);
        data.chiTietDiaDiems.forEach(s => {
          s.maDvi = data.maDvi;
          s.maChiCuc = data.maDvi;
          s.tenChiCuc = data.tenDvi;
          this.formData.get('phuongAnXuat').value.push(s);
        });
      }
    });
  }

  suaPhuongAn(item: DiaDiemNhapKho) {
    let data = this.loaiVthhInput;
    const modalTuChoi = this.modal.create({
      nzTitle: 'Danh sách hàng hóa',
      nzContent: DialogDiaDiemNhapKhoComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '100%',
      nzFooter: null,
      nzComponentParams: {
        loaiHangHoa: this.formData.get('loaiVthh').value,
        cLoaiVthh: this.formData.get('cloaiVthh').value,
        // tenCloaiVthh: this.formData.get('tenCloaiVthh').value,
        nam: this.formData.get('nam').value,
        listPhuongAn: item,
      },
    });
    modalTuChoi.afterClose.subscribe(async (data) => {
      if (data) {
        this.phuongAnXuatList.push(data);
        data.chiTietDiaDiems.forEach(s => {
          s.maDvi = data.maDvi;
          s.maChiCuc = data.maDvi;
          s.tenChiCuc = data.tenDvi;
          this.formData.get('phuongAnXuat').value.push(s);
        });
      }
    });
  }

  addThongTin() {
    try {
      if (this.thongTinChiTietCreate.noiDung && this.thongTinChiTietCreate.soLuong > 0) {
        let newRow = cloneDeep(this.thongTinChiTietCreate);
        this.formData.get('thongTinChiTiet').value.push(newRow);
        this.tongSLThongTinChiTiet = 0;
        this.formData.get('thongTinChiTiet').value.forEach(s => this.tongSLThongTinChiTiet += parseInt(s.soLuong));
        this.clearThongTin();
      }
    } catch (e) {
    }
  }

  clearThongTin() {
    this.thongTinChiTietCreate = {};
  }

  editThongTin(index: number) {
    try {
      this.thongTinChiTietClone = cloneDeep(this.formData.get('thongTinChiTiet').value[index]);
      this.formData.get('thongTinChiTiet').value[index].isEdit = true;
    } catch (e) {
    }
  }

  deleteThongTin(index: number) {
    try {
      this.formData.get('thongTinChiTiet').value.splice(index, 1);
      this.tongSLThongTinChiTiet = 0;
      this.formData.get('thongTinChiTiet').value.forEach(s => this.tongSLThongTinChiTiet += parseInt(s.soLuong));
    } catch (e) {
    }
    // this.thongTinChiTietCreate[index].isEdit = false;
  }

  saveEditThongTin(index: number) {
    try {
      if (this.thongTinChiTietCreate.noiDung && this.thongTinChiTietCreate.soLuong > 0) {
        this.tongSLThongTinChiTiet = 0;
        this.formData.get('thongTinChiTiet').value.forEach(s => this.tongSLThongTinChiTiet += parseInt(s.soLuong));
        this.formData.get('thongTinChiTiet').value[index].isEdit = false;
      }
    } catch (e) {
    }
  }

  cancelEditThongTin(index: number) {
    try {
      this.formData.get('thongTinChiTiet').value[index] = this.thongTinChiTietClone;
      this.formData.get('thongTinChiTiet').value[index].isEdit = false;
    } catch (e) {
    }
  }
}
