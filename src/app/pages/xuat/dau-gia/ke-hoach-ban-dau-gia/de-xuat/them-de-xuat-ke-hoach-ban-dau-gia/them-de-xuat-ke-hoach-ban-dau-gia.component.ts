import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges } from '@angular/core';
import { Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import * as dayjs from 'dayjs';
import { API_STATUS_CODE } from 'src/app/constants/config';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import {
  DialogDanhSachHangHoaComponent
} from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { ChiTieuKeHoachNamCapTongCucService } from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import {
  DialogThemMoiGoiThauComponent
} from 'src/app/components/dialog/dialog-them-moi-goi-thau/dialog-them-moi-goi-thau.component';
import { DanhMucTieuChuanService } from 'src/app/services/quantri-danhmuc/danhMucTieuChuan.service';
import { STATUS } from "../../../../../../constants/status";
import { DatePipe } from "@angular/common";
import { QuyetDinhGiaTCDTNNService } from 'src/app/services/ke-hoach/phuong-an-gia/quyetDinhGiaTCDTNN.service';
import { DanhSachPhanLo } from 'src/app/models/KeHoachBanDauGia';
import { DeXuatKhBanDauGiaService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/deXuatKhBanDauGia.service';
import {
  DialogThemDiaDiemPhanLoComponent
} from 'src/app/components/dialog/dialog-them-dia-diem-phan-lo/dialog-them-dia-diem-phan-lo.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';

@Component({
  selector: 'app-them-de-xuat-ke-hoach-ban-dau-gia',
  templateUrl: './them-de-xuat-ke-hoach-ban-dau-gia.component.html',
  styleUrls: ['./them-de-xuat-ke-hoach-ban-dau-gia.component.scss']
})
export class ThemDeXuatKeHoachBanDauGiaComponent extends Base2Component implements OnInit, OnChanges {
  @Input()
  loaiVthhInput: string;
  @Input()
  idInput: number;
  @Input()
  showFromTH: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();

  listLoaiHinhNx: any[] = [];
  listKieuNx: any[] = [];
  listPhuongThucThanhToan: any[] = [];
  dataChiTieu: any;
  maTrinh: string = '';


  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private deXuatKhBanDauGiaService: DeXuatKhBanDauGiaService,
    private chiTieuKeHoachNamCapTongCucService: ChiTieuKeHoachNamCapTongCucService,
    private dmTieuChuanService: DanhMucTieuChuanService,
    private quyetDinhGiaTCDTNNService: QuyetDinhGiaTCDTNNService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, deXuatKhBanDauGiaService);
    this.formData = this.fb.group({
      id: [],
      maDvi: [''],
      tenDvi: ['', [Validators.required]],
      loaiHinhNx: ['', [Validators.required]],
      kieuNx: [''],
      diaChi: [],
      namKh: [dayjs().get('year'), [Validators.required]],
      soDxuat: ['', [Validators.required]],
      trichYeu: [, [Validators.required]],
      ngayTao: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
      ngayPduyet: [],
      soQdCtieu: [, [Validators.required]],
      loaiVthh: [,],
      tenLoaiVthh: [, [Validators.required]],
      cloaiVthh: [,],
      tenCloaiVthh: [, [Validators.required]],
      moTaHangHoa: [, [Validators.required]],
      tchuanCluong: [null],
      thoiGianDuKien: [, [Validators.required]],
      tgianDkienTu: [,],
      tgianDkienDen: [,],
      tgianTtoan: [, [Validators.required]],
      tgianTtoanGhiChu: [null],
      pthucTtoan: [, [Validators.required]],
      tgianGnhan: [, [Validators.required]],
      tgianGnhanGhiChu: [null],
      pthucGnhan: [, [Validators.required]],
      thongBaoKh: [, [Validators.required]],
      khoanTienDatTruoc: [, [Validators.required]],
      tongSoLuong: [null],
      tongTienKdiem: [null],
      tongTienKdienDonGia: [null],
      tongTienDatTruocDonGia: [null],
      tongTienDatTruoc: [null],
      ghiChu: [null],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự Thảo'],
      trangThaiTh: [STATUS.CHUA_TONG_HOP],
      tenTrangThaiTh: ['Chưa tổng hợp'],
      maThop: [null],
      soQdPd: [null],
      ngayGduyet: [null],
      nguoiGduyetId: [null],
      nguoiPduyetId: [null],
      soDviTsan: [null],
      slHdDaKy: [null],
      ldoTuChoi: [null],
      ngayKy: [null],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    this.maTrinh = '/KH-CDTVP';
    if (this.idInput > 0) {
      // await this.getDetail(this.idInput);
    } else {
      this.initForm();
    }
    await Promise.all([
      this.loadDataComboBox(),
      this.getDataChiTieu()
    ]);
    await this.spinner.hide();
  }

  async loadDataComboBox() {
    // loại hình nhập xuất
    this.listLoaiHinhNx = [];
    let resNx = await this.danhMucService.danhMucChungGetAll('LOAI_HINH_NHAP_XUAT');
    if (resNx.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhNx = resNx.data.filter(item => item.phanLoai == 'X');
    }
    // kiểu nhập xuất
    this.listKieuNx = [];
    let resKieuNx = await this.danhMucService.danhMucChungGetAll('KIEU_NHAP_XUAT');
    if (resKieuNx.msg == MESSAGE.SUCCESS) {
      this.listKieuNx = resKieuNx.data
    }
    this.listPhuongThucThanhToan = [
      {
        ma: '1',
        giaTri: 'Tiền mặt',
      },
      {
        ma: '2',
        giaTri: 'Chuyển khoản',
      },
    ];
  }

  onChangeLhNx($event) {
    let dataNx = this.listLoaiHinhNx.filter(item => item.ma == $event);
    if (dataNx.length > 0) {
      this.formData.patchValue({
        kieuNx: dataNx[0].ghiChu
      })
    }
  }

  async getDetail(id: number) {
    if (id) {
      await this.deXuatKhBanDauGiaService
        .getDetail(id)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const dataDetail = res.data;
            if (dataDetail) {
              this.helperService.bidingDataInFormGroup(this.formData, dataDetail);
              this.formData.patchValue({
                soDxuat: dataDetail.soDxuat?.split('/')[0],
                thoiGianDuKien: dataDetail.tgianDkienTu && dataDetail.tgianDkienDen ? [dataDetail.tgianDkienTu, dataDetail.tgianDkienDen] : null
              })
              this.fileDinhKem = dataDetail.fileDinhKems;
            }
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
  }

  initForm() {
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maDvi: this.userInfo.MA_DVI,
      diaChi: this.userInfo.DON_VI.diaChi,
    })
  }

  selectHangHoa() {
    let data = this.loaiVthhInput;
    let bodyParamVatTu = {
      data,
      isCaseSpecial: true,
      onlyVatTu: true
    }
    let bodyParamLT = {
      onlyLuongThuc: true
    }
    const modalTuChoi = this.modal.create({
      nzTitle: 'Danh sách hàng hóa',
      nzContent: DialogDanhSachHangHoaComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: this.userService.isTongCuc() ? bodyParamLT : bodyParamVatTu
    });
    modalTuChoi.afterClose.subscribe(async (data) => {
      if (data) {
        if (this.userService.isCuc()) {
          this.formData.patchValue({
            cloaiVthh: data.ma,
            tenCloaiVthh: data.ten,
            loaiVthh: data.parent.ma,
            tenLoaiVthh: data.parent.ten,
          });
          let res = await this.dmTieuChuanService.getDetailByMaHh(
            this.formData.get('cloaiVthh').value,
          );
          let bodyPag = {
            namKeHoach: this.formData.value.namKh,
            loaiVthh: this.formData.value.loaiVthh,
            cloaiVthh: this.formData.value.cloaiVthh,
            trangThai: STATUS.BAN_HANH,
            maDvi: this.formData.value.maDvi
          }
          let pag = await this.quyetDinhGiaTCDTNNService.getPag(bodyPag)
          if (pag.msg == MESSAGE.SUCCESS) {
            const data = pag.data;
          }
          if (res.statusCode == API_STATUS_CODE.SUCCESS) {
            this.formData.patchValue({
              tchuanCluong: res.data ? res.data.tenQchuan : null,
            });
          }
        } else {
          this.formData.patchValue({
            loaiVthh: data.ma,
            tenLoaiVthh: data.ten
          });
        }
      }
    });
  }

  themMoiBangPhanLoTaiSan(data?: DanhSachPhanLo, index?: number) {
    if (!this.formData.get('loaiVthh').value) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng chọn loại hàng hóa');
      return;
    }
    if (!this.formData.get('khoanTienDatTruoc').value) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng chọn khoản tiền đặt trước');
      return;
    }
    const modalGT = this.modal.create({
      nzTitle: 'Thêm địa điểm giao nhận hàng',
      nzContent: DialogThemDiaDiemPhanLoComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '2500px',
      nzFooter: null,
      nzComponentParams: {
        dataEdit: data,
        dataChiTieu: this.dataChiTieu,
        loaiVthh: this.formData.get('loaiVthh').value,
        khoanTienDatTruoc: this.formData.get('khoanTienDatTruoc').value,
        namKh: this.formData.get('namKh').value,
        // donGiaVat: this.donGiaVat,
      },
    });
    modalGT.afterClose.subscribe((res) => {
      if (!res) {
        return;
      }
      if (index >= 0) {
        this.dataTable[index] = res.value;
      } else {
        this.dataTable = [...this.dataTable, res.value];
      }
      let tongSoLuong: number = 0;
      let tongTienKdiem: number = 0;
      let tongTienKdienDonGia: number = 0;
      let tongTienDatTruoc: number = 0;
      let tongTienDatTruocDonGia: number = 0;
      this.dataTable.forEach((item) => {
        tongSoLuong = (tongSoLuong + item.soLuong) / 1000;
        tongTienKdiem = tongTienKdiem + item.giaKhoiDiem;
        tongTienKdienDonGia = tongTienKdienDonGia + item.giaKhoiDiemDduyet;
        tongTienDatTruoc = tongTienDatTruoc + item.tienDatTruoc;
        tongTienDatTruocDonGia = tongTienDatTruocDonGia + item.tienDatTruocDduyet;
      });
      this.formData.patchValue({
        tongSoLuong: tongSoLuong,
        tongTienKdiem: tongTienKdiem,
        tongTienKdienDonGia: tongTienKdienDonGia,
        tongTienDatTruoc: tongTienDatTruoc,
        tongTienDatTruocDonGia: tongTienDatTruocDonGia,
      });
    });
  }

  deleteRow(i: number) {
    // this.modal.confirm({
    //   nzClosable: false,
    //   nzTitle: 'Xác nhận',
    //   nzContent: 'Bạn có chắc chắn muốn xóa?',
    //   nzOkText: 'Đồng ý',
    //   nzCancelText: 'Không',
    //   nzOkDanger: true,
    //   nzWidth: 400,
    //   nzOnOk: async () => {
    //     try {
    //       this.dataTable = this.dataTable.filter((d, index) => index !== i);
    //       this.helperService.setIndexArray(this.dataTable);
    //     } catch (e) {
    //       console.log('error', e);
    //     }
    //   },
    // });
  }

  async save(isGuiDuyet?) {
    this.setValidator(isGuiDuyet);
    if (this.dataTable.length == 0) {
      this.notification.error(
        MESSAGE.ERROR,
        'Danh sách kế hoạch không được để trống',
      );
      return;
    }
    let body = this.formData.value;
    if (this.formData.get('soDxuat').value) {
      body.soDxuat = this.formData.get('soDxuat').value + this.maTrinh;
    }
    if (this.formData.get('thoiGianDuKien').value) {
      body.tgianDkienTu = dayjs(this.formData.get('thoiGianDuKien').value[0]).format('YYYY-MM-DD');
      body.tgianDkienDen = dayjs(this.formData.get('thoiGianDuKien').value[1]).format('YYYY-MM-DD')
    }
    body.fileDinhKemReq = this.fileDinhKem;
    body.chilren = this.dataTable;
    let res = await this.createUpdate(body);
    if (res) {
      if (isGuiDuyet) {
        this.guiDuyet();
      } else {
        this.quayLai()
      }
    }
  }

  setValidator(isGuiDuyet) {
    if (isGuiDuyet) {
      this.formData.controls["soDxuat"].setValidators([Validators.required]);
    } else {
      this.formData.controls["soDxuat"].clearValidators();
    }
  }

  async getDataChiTieu() {
    let res2 =
      await this.chiTieuKeHoachNamCapTongCucService.loadThongTinChiTieuKeHoachCucNam(
        +this.formData.get('namKh').value,
      );
    if (res2.msg == MESSAGE.SUCCESS) {
      this.dataChiTieu = res2.data;
      this.formData.patchValue({
        soQdCtieu: res2.data.soQuyetDinh
      });
    }
  }

  quayLai() {
    this.showListEvent.emit();
  }

  async guiDuyet() {
    let trangThai = '';
    let msg = '';
    switch (this.formData.get('trangThai').value) {
      case STATUS.TU_CHOI_LDC:
      case STATUS.TU_CHOI_TP:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_TP;
        msg = MESSAGE.GUI_DUYET_CONFIRM
        break;
      }
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.CHO_DUYET_LDC;
        msg = MESSAGE.PHE_DUYET_CONFIRM
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.DA_DUYET_LDC;
        msg = MESSAGE.PHE_DUYET_CONFIRM
        break;
      }
    }
    this.approve(this.idInput, trangThai, msg);
  }


  tuChoi() {
    let trangThai = '';
    switch (this.formData.get('trangThai').value) {
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.TU_CHOI_TP;
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.TU_CHOI_LDC;
        break;
      }
    };
    this.reject(this.idInput, trangThai);
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      await this.getDetail(this.idInput);
    };
  }

  isDisbleForm(): boolean {
    if (this.formData.value.trangThai == STATUS.DU_THAO || this.formData.value.trangThai == STATUS.TU_CHOI_TP || this.formData.value.trangThai == STATUS.TU_CHOI_LDC) {
      return false
    } else {
      return true
    }
  }

  isDisable(): boolean {
    return false;
  }

  calcTongSoLuong() {
    if (this.dataTable) {
      const sum = this.dataTable.reduce((prev, cur) => {
        prev += cur.tongSoLuong;
        return prev;
      }, 0);
      return sum;
    }
  }
}
