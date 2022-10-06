import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output,} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as dayjs from 'dayjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {
  DialogQuyetDinhGiaoChiTieuComponent
} from 'src/app/components/dialog/dialog-quyet-dinh-giao-chi-tieu/dialog-quyet-dinh-giao-chi-tieu.component';
import {DialogTuChoiComponent} from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import {MESSAGE} from 'src/app/constants/message';
import {DiaDiemGiaoNhan, KeHoachBanDauGia, PhanLoTaiSan,} from 'src/app/models/KeHoachBanDauGia';
import {UserLogin} from 'src/app/models/userlogin';
import {DanhMucService} from 'src/app/services/danhmuc.service';

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
import {DanhMucTieuChuanService} from "../../../../../services/quantri-danhmuc/danhMucTieuChuan.service";

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
  maDviTaiSan: string;
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
  phuongAnXuatList: DiaDiemNhapKho[] | any = [];
  idDxuatDtlSelect = 0;


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
        soDxuat: [null, [Validators.required]],
        idDxuat: [null,],
        maDvi: [''],
        tenDvi: [],
        ngayDxuat: [null, [Validators.required]],
        loaiVthh: [null, [Validators.required]],
        cloaiVthh: [null, [Validators.required]],
        tenLoaiVthh: [null, [Validators.required]],
        tenCloaiVthh: [null, [Validators.required]],
        tenVthh: [],
        tongSoLuong: [],
        trichYeu: [null, [Validators.required]],
        trangThai: [STATUS.DU_THAO],
        trangThaiTh: [],
        tenTrangThai: ['Dự thảo'],
        tenTrangThaiTh: [],
        loaiHinhNhapXuat: [null, [Validators.required]],
        kieuNhapXuat: [null, [Validators.required]],
        thoiGianThucHien: [],
        noiDung: [],
        nam: [dayjs().get("year"), [Validators.required]],
        tongTien: [],
        fileDinhKem: [new Array()],
        thongTinChiTiet: [new Array()],
        // phuongAnXuat: [new Array()],
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
      this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      this.spinner.hide();
    } finally {
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
          body.tongSoLuong = this.tongSLThongTinChiTiet;
          let res = await this.deXuatPhuongAnCuuTroService.create(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.idInput = res.data.id;
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
      this.listLoaiHinhNhapXuat = res.data.filter(item => item.phanLoai == 'VIEN_TRO_CUU_TRO');
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

  async duyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            trangThai: STATUS.DA_DUYET_LDTC,
          };
          let res = await this.deXuatPhuongAnCuuTroService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
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
            trangThai: STATUS.CHO_DUYET_LDTC,
          };
          let res = await this.deXuatPhuongAnCuuTroService.approve(body);
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

  async tuChoi() {
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
            trangThai: STATUS.TU_CHOI_LDTC,
          };
          let res = await this.deXuatPhuongAnCuuTroService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
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

  async luuGuiDuyet() {
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
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        } else {
          body.tongSoLuong = this.tongSLThongTinChiTiet;
          let res = await this.deXuatPhuongAnCuuTroService.create(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.idInput = res.data.id;
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        }

        //gui duyet
        body = {
          id: this.idInput,
          trangThai: STATUS.CHO_DUYET_LDTC,
        };
        let res = await this.deXuatPhuongAnCuuTroService.approve(body);
        if (res.msg == MESSAGE.SUCCESS) {
          this.notification.success(
            MESSAGE.SUCCESS,
            MESSAGE.GUI_DUYET_SUCCESS,
          );
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.quayLai();
        this.spinner.hide();

      }
    }
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
    }
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
        phuongAnXuatList: this.phuongAnXuatList,
        idDxuatDtl: this.idDxuatDtlSelect
      },
    });
    modalTuChoi.afterClose.subscribe(async (data) => {
      if (data) {
        console.log(data, 'themphuongan')
        this.phuongAnXuatList.push(data);
        data.chiTietDiaDiems.forEach(s => {
          s.maDvi = data.maDvi;
          s.maChiCuc = data.maDvi;
          s.tenChiCuc = data.tenDvi;
          s.cloaiVthh = s.chungLoaiHh;
          s.tenCloaiVthh = s.tenChungLoaiHh;
          this.formData.get('thongTinChiTiet')
          let curThongTinChiTiet = this.formData.get('thongTinChiTiet').value.find(s1 => s1.idVirtual == this.idDxuatDtlSelect);
          curThongTinChiTiet.phuongAnXuat.push(s);
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
          this.formData.get('thongTinChiTiet').value.phuongAnXuat ?? new Array().push(s);
        });
      }
    });
  }

  addThongTin() {
    try {
      if (this.thongTinChiTietCreate.noiDung && this.thongTinChiTietCreate.soLuong > 0) {
        let newRow = cloneDeep(this.thongTinChiTietCreate);
        newRow.idVirtual = new Date().getTime();
        newRow.phuongAnXuat = [];
        this.idDxuatDtlSelect = newRow.idVirtual;
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
      if (this.thongTinChiTietClone.noiDung && this.thongTinChiTietClone.soLuong > 0) {
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

  changeLoaiHinhNhapXuat(event: any) {
    let loaiHinh = this.listLoaiHinhNhapXuat.find(s => s.ma == event);
    if (loaiHinh) {
      this.formData.patchValue({kieuNhapXuat: loaiHinh.ghiChu.split('-')[0]})
    }
  }

  onClickChiTiet(item: any) {

    if (!item.idVirtual) {
      item.idVirtual = item.id;
    }
    this.idDxuatDtlSelect = item.idVirtual;
    let thongTinChiTiet = this.formData.get('thongTinChiTiet').value;
    thongTinChiTiet = thongTinChiTiet.find(s => s.id == item.id);
    console.log(thongTinChiTiet, 'thong tin chi tiet')
    if (thongTinChiTiet) {
      let nhapKhoList: DiaDiemNhapKho[] = [];
      this.tongSLCuuTro = 0;
      this.tongTien = 0;
      thongTinChiTiet.phuongAnXuat.forEach(s => {
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
        /*  if (s.donViTinh === 'tấn') {
            this.tongSLCuuTro += s.soLuong * 1000;
          } else {
            this.tongSLCuuTro += s.soLuong;
          }*/
        this.tongSLCuuTro += s.soLuong;
        this.tongTien += (s.soLuong ?? 0) * (s.donGia ?? 0);
      });
      this.phuongAnXuatList = nhapKhoList;
      this.formData.patchValue({tongSoLuong: this.tongSLCuuTro, tongTien: this.tongTien})

    }
  }
}
