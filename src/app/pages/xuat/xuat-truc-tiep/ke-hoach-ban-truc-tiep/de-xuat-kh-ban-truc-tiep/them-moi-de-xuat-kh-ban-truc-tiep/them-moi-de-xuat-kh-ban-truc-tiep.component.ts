import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges } from '@angular/core';
import { Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import * as dayjs from 'dayjs';
import { API_STATUS_CODE } from 'src/app/constants/config';
import {
  DialogDanhSachHangHoaComponent
} from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { ChiTieuKeHoachNamCapTongCucService } from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import { DanhMucTieuChuanService } from 'src/app/services/quantri-danhmuc/danhMucTieuChuan.service';
import { STATUS } from "../../../../../../constants/status";
import { QuyetDinhGiaTCDTNNService } from 'src/app/services/ke-hoach/phuong-an-gia/quyetDinhGiaTCDTNN.service';
import { DanhSachXuatBanTrucTiep } from 'src/app/models/KeHoachBanDauGia';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { DeXuatKhBanTrucTiepService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/de-xuat-kh-ban-truc-tiep.service';
import { DialogThemMoiXuatBanTrucTiepComponent } from 'src/app/components/dialog/dialog-them-moi-xuat-ban-truc-tiep/dialog-them-moi-xuat-ban-truc-tiep.component';

@Component({
  selector: 'app-them-moi-de-xuat-kh-ban-truc-tiep',
  templateUrl: './them-moi-de-xuat-kh-ban-truc-tiep.component.html',
  styleUrls: ['./them-moi-de-xuat-kh-ban-truc-tiep.component.scss']
})
export class ThemMoiDeXuatKhBanTrucTiepComponent extends Base2Component implements OnInit, OnChanges {
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
    private deXuatKhBanTrucTiepService: DeXuatKhBanTrucTiepService,
    private chiTieuKeHoachNamCapTongCucService: ChiTieuKeHoachNamCapTongCucService,
    private dmTieuChuanService: DanhMucTieuChuanService,
    private quyetDinhGiaTCDTNNService: QuyetDinhGiaTCDTNNService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, deXuatKhBanTrucTiepService);
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
      tongSoLuong: [null],
      ghiChu: [null],
      soQdPd: [''],
      ngayKyQd: [''],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự Thảo'],
      lyDoTuChoi: [null],
      donGiaVat: [],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    this.maTrinh = '/' + this.userInfo.MA_TR;
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
      let data = await this.detail(id);
      if (data) {
        this.formData.patchValue({
          soDxuat: data.soDxuat?.split('/')[0],
          thoiGianDuKien: (data.tgianDkienTu && data.tgianDkienDen) ? [data.tgianDkienTu, data.tgianDkienDen] : null
        })
        this.dataTable = data.children;
        this.fileDinhKem = data.fileDinhKems;
        this.calculatorTable();
      }
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
    const modalTuChoi = this.modal.create({
      nzTitle: 'Danh sách hàng hóa',
      nzContent: DialogDanhSachHangHoaComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        data: this.loaiVthhInput
      }
    });
    modalTuChoi.afterClose.subscribe(async (data) => {
      if (data) {
        if (data.ma.startsWith('04')) {
          this.formData.patchValue({
            cloaiVthh: data.ma,
            tenCloaiVthh: data.ten,
            loaiVthh: data.parent.ma,
            tenLoaiVthh: data.parent.ten
          });
        } else {
          this.formData.patchValue({
            cloaiVthh: data.cap == 3 ? data.ma : null,
            tenCloaiVthh: data.cap == 3 ? data.ten : null,
            loaiVthh: data.cap == 3 ? data.parent.ma : data.ma,
            tenLoaiVthh: data.cap == 3 ? data.parent.ten : data.ten,
          });
        }
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
          this.formData.patchValue({
            donGiaVat: data.giaQdVat
          })
          // if (!data.giaQdVat) {
          //   this.notification.error(MESSAGE.ERROR, "Chủng loại hàng hóa đang chưa có giá, xin vui lòng thêm phương án giá!")
          // }
        }
        if (res.statusCode == API_STATUS_CODE.SUCCESS) {
          this.formData.patchValue({
            tchuanCluong: res.data ? res.data.tenQchuan : null,
          });
        }
      }
    });
  }

  themMoiBangPhanLoTaiSan($event, data?: DanhSachXuatBanTrucTiep, index?: number) {
    $event.stopPropagation();
    if (!this.formData.get('loaiVthh').value) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng chọn loại hàng hóa');
      return;
    }
    const modalGT = this.modal.create({
      nzTitle: 'Thêm địa điểm giao nhận hàng',
      nzContent: DialogThemMoiXuatBanTrucTiepComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '2500px',
      nzFooter: null,
      nzComponentParams: {
        dataEdit: data,
        dataChiTieu: this.dataChiTieu,
        loaiVthh: this.formData.get('loaiVthh').value,
        namKh: this.formData.get('namKh').value,
        donGiaVat: this.formData.value.donGiaVat
      },
    });
    modalGT.afterClose.subscribe((data) => {
      if (!data) {
        return;
      }
      if (index >= 0) {
        this.dataTable[index] = data;
      } else {
        if (!this.validateAddDiaDiem(data)) {
          return
        }
        this.dataTable.push(data);
      }
      this.calculatorTable();
    });
  };

  validateAddDiaDiem(dataAdd): boolean {
    let data = this.dataTable.filter(item => item.maDvi == dataAdd.maDvi);
    if (data.length > 0) {
      this.notification.error(MESSAGE.ERROR, "Chi cục " + data[0].tenDvi + " đã tồn tại. Vui lòng thêm chi cục khác");
      return false;
    }
    return true;
  }

  calculatorTable() {
    let tongSoLuong: number = 0;
    this.dataTable.forEach((item) => {
      let soLuongChiCuc = 0;
      item.children.forEach(child => {
        soLuongChiCuc += child.soLuong;
        tongSoLuong += child.soLuong / 1000;
      })
      item.soLuong = soLuongChiCuc;
    });
    this.formData.patchValue({
      tongSoLuong: tongSoLuong,
    });
  }

  deleteRow(i: number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          this.dataTable = this.dataTable.filter((item, index) => index != i);
        } catch (e) {
          console.log('error', e);
        }
      },
    });
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
    body.fileDinhKems = this.fileDinhKem;
    body.children = this.dataTable;
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
    console.log(res2, 99)
    if (res2.msg == MESSAGE.SUCCESS) {
      this.dataChiTieu = res2.data;
      if (this.dataChiTieu) {
        this.formData.patchValue({
          soQdCtieu: res2.data.soQuyetDinh
        });
      }
    } else {
      this.formData.patchValue({
        soQdCtieu: 189
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
      case STATUS.TU_CHOI_CBV:
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
      case STATUS.DA_DUYET_LDC: {
        trangThai = STATUS.DA_DUYET_CBV;
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
      case STATUS.DA_DUYET_LDC: {
        trangThai = STATUS.TU_CHOI_CBV;
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

  isDisable(): boolean {
    if (this.formData.value.trangThai == STATUS.DU_THAO || this.formData.value.trangThai == STATUS.TU_CHOI_TP ||
      this.formData.value.trangThai == STATUS.TU_CHOI_LDC || this.formData.value.trangThai == STATUS.TU_CHOI_CBV) {
      return false
    } else {
      return true
    }
  }

  calcTong(columnName) {
    if (this.dataTable) {
      const sum = this.dataTable.reduce((prev, cur) => {
        prev += cur[columnName];
        return prev;
      }, 0);
      return sum;
    }
  }
}
