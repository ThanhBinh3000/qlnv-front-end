import {Component, Input, OnInit} from '@angular/core';
import {Base2Component} from "../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {
  QuyetDinhPdKhBdgService
} from "../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/quyetDinhPdKhBdg.service";
import {
  ThongTinDauGiaService
} from "../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/thongTinDauGia.service";
import {FileDinhKem} from "../../../../models/DeXuatKeHoachuaChonNhaThau";
import {
  DialogThemDiaDiemKhoiTaoDuLieuComponent
} from "../../../../components/dialog/dialog-them-dia-diem-khoi-tao-du-lieu/dialog-them-dia-diem-khoi-tao-du-lieu.component";
import {DanhSachPhanLo} from "../../../../models/KeHoachBanDauGia";
import {STATUS} from "../../../../constants/status";
import {FormGroup} from "@angular/forms";
import {MESSAGE} from "../../../../constants/message";
import {DanhMucService} from "../../../../services/danhmuc.service";

@Component({
  selector: 'app-thong-tin-hop-dong',
  templateUrl: './thong-tin-hop-dong.component.html',
  styleUrls: ['./thong-tin-hop-dong.component.scss']
})
export class ThongTinHopDongComponent extends Base2Component implements OnInit {
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() loaiVthh: string;
  listHinhThucBDG: any[] = [];
  listPhuongThucBDG: any[] = [];
  xhQdPdKhBdgDtl: FormGroup;
  readonly TRANG_THAI_NHAP_LIEU = {
    DANG_NHAP: "00",
    HOAN_THANH: "01"
  };
  listHinhThucThanhToan: any[] = []
  listPhuongThucGiaoNhanBDG: any[] = [];
  listLoaiHinhNx: any[] = [];
  listKieuNx: any[] = [];
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private quyetDinhPdKhBdgService: QuyetDinhPdKhBdgService,
    private thongTinDauGiaService: ThongTinDauGiaService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, thongTinDauGiaService);
    this.formData = this.fb.group(
      {
        id: [],
        maDvi: [''],
        nam: [],
        lanDauGia: [],
        maThongBao: [''],
        idQdPd: [],
        soQdPd: [''],
        idQdDc: [],
        soQdDc: [''],
        idQdPdDtl: [],
        trichYeuTbao: [''],
        tenToChuc: [''],
        sdtToChuc: ['',],
        diaChiToChuc: [''],
        taiKhoanToChuc: [''],
        soHd: [''],
        ngayKyHd: [''],
        hthucTchuc: [''],
        tgianDkyTu: [''],
        tgianDkyDen: [''],
        ghiChuTgianDky: [''],
        diaDiemDky: [''],
        dieuKienDky: [''],
        tienMuaHoSo: [],
        buocGia: [],
        ghiChuBuocGia: [''],
        tgianXemTu: [''],
        tgianXemDen: [''],
        ghiChuTgianXem: [''],
        diaDiemXem: [''],
        tgianNopTienTu: [''],
        tgianNopTienDen: [''],
        pthucTtoan: [''],
        ghiChuTgianNopTien: [''],
        donViThuHuong: [''],
        stkThuHuong: [''],
        nganHangThuHuong: [''],
        chiNhanhNganHang: [''],
        tgianDauGiaTu: [''],
        tgianDauGiaDen: [''],
        diaDiemDauGia: [''],
        hthucDgia: [''],
        pthucDgia: [''],
        dkienCthuc: [''],
        ghiChu: [''],
        ketQua: ['1'], // 0 : Trượt 1 Trúng
        soBienBan: [''],
        trichYeuBban: [''],
        ngayKyBban: [''],
        ketQuaSl: [''],
        loaiVthh: [''],
        cloaiVthh: [''],
        moTaHangHoa: [''],
        khoanTienDatTruoc: [],
        thongBaoKhongThanh: [''],
        soDviTsan: [],
        qdLcTcBdg: [''],
        ngayQdBdg: [''],
        trangThai: [STATUS.DANG_THUC_HIEN],
        tenTrangThai: ['ĐANG THỰC HIỆN'],
        canCu: [new Array<FileDinhKem>()],
        fileDinhKem: [new Array<FileDinhKem>()],
        xhQdPdKhBdgDtl: [''],
        children: [''],
      }
    );
    this.xhQdPdKhBdgDtl = this.fb.group(
      {
        id: [],
        idHdr: [],
        nam: [],
        maDvi: [],
        idQdPd: [],
        soQdPd: [''],
        idQdDc: [],
        soQdDc: [''],
        idQdPdDtl: [],
        soQdKq: [''],
        tenDvi: [''],
        tongTienDatTruoc: [],
        khoanTienDatTruoc: [],
        khoanTienDatTruocHienThi: [''],
        tgianDauGia: [''],
        tgianDauGiaTu: [''],
        tgianDauGiaDen: [''],
        tgianTtoan: [],
        tenPthucTtoan: [''],
        tgianGnhan: [],
        pthucGnhan: [''],
        tongTienDatTruocDd: [],
        tenLoaiVthh: [''],
        tenCloaiVthh: [''],
        tongSoLuong: [],
        tenLoaiHinhNx: [''],
        tenKieuNx: [''],
        trangThai: [''],
        tenTrangThai: [''],
        trangThaiNhapLieu: [''],
        tenTrangThaiNhapLieu: [''],
        donViTinh: [''],
        listTtinDg: [],
      }
    )

  }


  async ngOnInit() {
    this.spinner.show();
    try {
      await Promise.all([
         this.loadHinhThucThanhToan(),
      ])
      await this.loadDetail(this.idInput)
      await this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      await this.spinner.hide();
    } finally {
      await this.spinner.hide();
    }
  }

  async save(roles?: any, isHideMessage?: boolean, ignoreFields?: Array<string>) {
    if (!this.checkPermission(roles)) {
      return
    }
    await this.spinner.show();
    try {
      this.helperService.markFormGroupTouched(this.formData, ignoreFields);
      if (this.formData.invalid) {
        return;
      }
      let body = {
        ...this.formData.value,
        xhQdPdKhBdgDtl: this.xhQdPdKhBdgDtl.value,
        children: this.dataTable,
      }
      console.log(body)
      let res = null
      if (body.id && body.id > 0) {
        res = await this.thongTinDauGiaService.capNhatKhoiTao(body.xhQdPdKhBdgDtl);
      } else {
        res = await this.thongTinDauGiaService.khoiTaoDuLieu(body);
      }
      if (res.msg == MESSAGE.SUCCESS) {
        if (body.id && body.id > 0) {
          !isHideMessage && this.notification.success(MESSAGE.NOTIFICATION, MESSAGE.UPDATE_SUCCESS);
          return res.data;
        } else {
          this.formData.patchValue({id: res.data.id});
          !isHideMessage && this.notification.success(MESSAGE.NOTIFICATION, MESSAGE.ADD_SUCCESS);
          return res.data;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        return null;
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e);
    } finally {
      await this.spinner.hide();
    }
  }

  async hoanThanh() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn hoàn thành cập nhật?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            trangThai: this.TRANG_THAI_NHAP_LIEU.HOAN_THANH
          };
          let res = await this.thongTinDauGiaService.hoanThanhKhoiTao(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.THAO_TAC_SUCCESS);
            this.goBack();
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

  disabledTgianDangKyTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.tgianDkyDen) {
      return false;
    }
    const startDay = new Date(startValue.getFullYear(), startValue.getMonth(), startValue.getDate());
    const endDay = new Date(this.formData.value.tgianDkyDen.getFullYear(), this.formData.value.tgianDkyDen.getMonth(), this.formData.value.tgianDkyDen.getDate());
    return startDay > endDay;
  };

  disabledTgianDangKyDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.tgianDkyTu) {
      return false;
    }
    const endDay = new Date(endValue.getFullYear(), endValue.getMonth(), endValue.getDate());
    const startDay = new Date(this.formData.value.tgianDkyTu.getFullYear(), this.formData.value.tgianDkyTu.getMonth(), this.formData.value.tgianDkyTu.getDate());
    return endDay < startDay;
  };

  disabledTgianXemtaiSanTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.tgianXemDen) {
      return false;
    }
    const startDay = new Date(startValue.getFullYear(), startValue.getMonth(), startValue.getDate());
    const endDay = new Date(this.formData.value.tgianXemDen.getFullYear(), this.formData.value.tgianXemDen.getMonth(), this.formData.value.tgianXemDen.getDate());
    return startDay > endDay;
  };

  disabledTgianXemtaiSanDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.tgianXemTu) {
      return false;
    }
    const endDay = new Date(endValue.getFullYear(), endValue.getMonth(), endValue.getDate());
    const startDay = new Date(this.formData.value.tgianXemTu.getFullYear(), this.formData.value.tgianXemTu.getMonth(), this.formData.value.tgianXemTu.getDate());
    return endDay < startDay;
  };

  disabledTgianNopTienTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.tgianNopTienDen) {
      return false;
    }
    const startDay = new Date(startValue.getFullYear(), startValue.getMonth(), startValue.getDate());
    const endDay = new Date(this.formData.value.tgianNopTienDen.getFullYear(), this.formData.value.tgianNopTienDen.getMonth(), this.formData.value.tgianNopTienDen.getDate());
    return startDay > endDay;
  };

  disabledTgianNopTienDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.tgianNopTienTu) {
      return false;
    }
    const endDay = new Date(endValue.getFullYear(), endValue.getMonth(), endValue.getDate());
    const startDay = new Date(this.formData.value.tgianNopTienTu.getFullYear(), this.formData.value.tgianNopTienTu.getMonth(), this.formData.value.tgianNopTienTu.getDate());
    return endDay < startDay;
  };

  disabledTgianDauGiaTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.tgianDauGiaDen) {
      return false;
    }
    const startDay = new Date(startValue.getFullYear(), startValue.getMonth(), startValue.getDate());
    const endDay = new Date(this.formData.value.tgianDauGiaDen.getFullYear(), this.formData.value.tgianDauGiaDen.getMonth(), this.formData.value.tgianDauGiaDen.getDate());
    return startDay > endDay;
  };

  disabledTgianDauGiaDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.tgianDauGiaTu) {
      return false;
    }
    const endDay = new Date(endValue.getFullYear(), endValue.getMonth(), endValue.getDate());
    const startDay = new Date(this.formData.value.tgianDauGiaTu.getFullYear(), this.formData.value.tgianDauGiaTu.getMonth(), this.formData.value.tgianDauGiaTu.getDate());
    return endDay < startDay;
  };

  async loadDetail(idInput: number) {
    if (idInput > 0) {
      await this.quyetDinhPdKhBdgService.getDtlDetail(idInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const data = res.data;
            this.xhQdPdKhBdgDtl.patchValue(data);
            this.formData.patchValue(data.listTtinDg[0]);
            console.log(data, 'data')
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
        loaiVthh: this.loaiVthh
      });
      this.xhQdPdKhBdgDtl.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
        loaiVthh: this.loaiVthh
      });
    }

  }

  async themDiaDiem($event, data?: DanhSachPhanLo, index?: number) {
    $event.stopPropagation();
    const modalQD = this.modal.create({
      nzTitle: 'Thông tin hợp đồng',
      nzContent: DialogThemDiaDiemKhoiTaoDuLieuComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1200px',
      nzFooter: null,
      nzComponentParams: {
        loaiVthh: this.loaiVthh
      },
    });
    modalQD.afterClose.subscribe((data) => {
      if (data) {
        if (index >= 0) {
          this.dataTable[index] = data;
        } else {
          this.dataTable.push(data);
        }
        this.dataTable.forEach(item => {
          item.expandSetAll = true;
        });
      }
      console.log(this.dataTable, "this.dataTable")
      // this.calculatorTable()
    })
  }

  changeQd(soQdPd: any) {
    this.formData.patchValue({
      soQdPd: soQdPd,
    })
  }

  async loadHinhThucThanhToan() {
    this.listHinhThucThanhToan = [];
    let res = await this.danhMucService.danhMucChungGetAll('PHUONG_THUC_TT');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listHinhThucThanhToan = res.data;
    }
    let resPtGnBdg = await this.danhMucService.danhMucChungGetAll('PT_GIAO_HANG');
    if (resPtGnBdg.msg == MESSAGE.SUCCESS) {
      this.listPhuongThucGiaoNhanBDG = resPtGnBdg.data
    }
    let resNx = await this.danhMucService.danhMucChungGetAll("LOAI_HINH_NHAP_XUAT");
    if (resNx.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhNx = resNx.data.filter(item => item.apDung == "NHAP_KHAC");
    }
    this.listKieuNx = [];
    let resKieuNx = await this.danhMucService.danhMucChungGetAll("KIEU_NHAP_XUAT");
    if (resKieuNx.msg == MESSAGE.SUCCESS) {
      this.listKieuNx = resKieuNx.data;
    }
  }
  onChangeLhNx($event) {
    let dataNx = this.listLoaiHinhNx.filter(item => item.ma == $event);
    if (dataNx.length > 0) {
      this.formData.patchValue({
        kieuNx: dataNx[0].ghiChu,
        tenLoaiHinhNx: dataNx[0].giaTri
      });
    }
  }
}
