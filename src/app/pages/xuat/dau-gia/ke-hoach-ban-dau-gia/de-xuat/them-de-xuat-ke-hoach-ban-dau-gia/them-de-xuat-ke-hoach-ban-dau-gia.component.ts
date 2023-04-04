import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges } from '@angular/core';
import { Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import * as dayjs from 'dayjs';
import { API_STATUS_CODE, LOAI_HANG_DTQG } from 'src/app/constants/config';
import {
  DialogDanhSachHangHoaComponent
} from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { ChiTieuKeHoachNamCapTongCucService } from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import { DanhMucTieuChuanService } from 'src/app/services/quantri-danhmuc/danhMucTieuChuan.service';
import { STATUS } from "../../../../../../constants/status";
import { QuyetDinhGiaTCDTNNService } from 'src/app/services/ke-hoach/phuong-an-gia/quyetDinhGiaTCDTNN.service';
import { DanhSachPhanLo } from 'src/app/models/KeHoachBanDauGia';
import { DeXuatKhBanDauGiaService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/deXuatKhBanDauGia.service';
import {
  DialogThemDiaDiemPhanLoComponent
} from 'src/app/components/dialog/dialog-them-dia-diem-phan-lo/dialog-them-dia-diem-phan-lo.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { DatePipe } from '@angular/common';

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
  @Input() isViewOnModal: boolean;
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
      tenDvi: [''],
      loaiHinhNx: [''],
      kieuNx: [''],
      diaChi: [],
      namKh: [dayjs().get('year')],
      soDxuat: [''],
      trichYeu: [''],
      ngayTao: [dayjs().format('YYYY-MM-DD')],
      ngayPduyet: [''],
      idSoQdCtieu: [],
      soQdCtieu: [''],
      loaiVthh: ['', [Validators.required]],
      tenLoaiVthh: ['', [Validators.required]],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      tchuanCluong: [''],
      thoiGianDuKien: [''],
      tgianDkienTu: [''],
      tgianDkienDen: [''],
      tgianTtoan: [],
      tgianTtoanGhiChu: [''],
      pthucTtoan: [''],
      tgianGnhan: [],
      tgianGnhanGhiChu: [''],
      pthucGnhan: [''],
      thongBao: [''],
      khoanTienDatTruoc: [],
      tongSoLuong: [],
      tongTienKdiem: [],
      tongTienKdienDonGia: [],
      tongTienDatTruoc: [],
      tongTienDatTruocDonGia: [],
      ghiChu: [''],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự Thảo'],
      lyDoTuChoi: [''],
      donGiaVat: [],
      tongDonGia: [],
      dviTinh: [''],
      typeVthh: [''],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    this.formData.patchValue({
      typeVthh: this.loaiVthhInput,
    })
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
      }
    }
  }

  initForm() {
    if (this.loaiVthhInput.startsWith(LOAI_HANG_DTQG.VAT_TU)) {
      this.formData.patchValue({
        tenDvi: this.userInfo.TEN_DVI,
        maDvi: this.userInfo.MA_DVI,
        diaChi: this.userInfo.DON_VI.diaChi,
      })
    } else {
      this.formData.patchValue({
        tenDvi: this.userInfo.TEN_DVI,
        maDvi: this.userInfo.MA_DVI,
        diaChi: this.userInfo.DON_VI.diaChi,
        loaiVthh: this.loaiVthhInput,
      })
      this.loadDanhMucHang()
    }
  }

  async loadDanhMucHang() {
    let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.length > 0) {
        res.data.forEach((element) => {
          if (element.ma == this.loaiVthhInput) {
            this.formData.patchValue({
              tenLoaiVthh: element.giaTri,
            })
          }
        });
      }
    }
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
        if (this.loaiVthhInput.startsWith(LOAI_HANG_DTQG.THOC)) {
          this.formData.patchValue({
            dviTinh: 'Kg',
          });
        } else {
          this.formData.patchValue({
            dviTinh: data.maDviTinh,
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
        }
        if (res.statusCode == API_STATUS_CODE.SUCCESS) {
          this.formData.patchValue({
            tchuanCluong: res.data ? res.data.tenQchuan : null,
          });
        }
      }
    });
  }

  themMoiBangPhanLoTaiSan($event, data?: DanhSachPhanLo, index?: number) {
    $event.stopPropagation();
    if (!this.formData.get('loaiVthh').value || !this.formData.get('cloaiVthh').value) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng chọn loại hàng hóa và chủng loại hàng hóa');
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
        donGiaVat: this.formData.get('donGiaVat').value,
        dviTinh: this.formData.get('dviTinh').value,
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
    let tongTienKdiem: number = 0;
    let tongTienKdienDonGia: number = 0;
    let tongDonGia: number = 0;
    this.dataTable.forEach((item) => {
      item.children.forEach(child => {
        item.tienDtruocDxChiCuc += child.soLuong * child.donGiaDeXuat;
        item.tienDtruocDdChiCuc += child.soLuong * child.donGiaVat;
        tongDonGia += child.donGiaDeXuat;
      })
      tongSoLuong += item.soLuongChiCuc;
      tongTienKdiem += item.tienDtruocDxChiCuc;
      tongTienKdienDonGia += item.tienDtruocDdChiCuc;
    });
    this.formData.patchValue({
      tongSoLuong: tongSoLuong,
      tongTienKdiem: tongTienKdiem,
      tongTienKdienDonGia: tongTienKdienDonGia,
      tongTienDatTruoc: tongTienKdiem * this.formData.value.khoanTienDatTruoc / 100,
      tongTienDatTruocDonGia: tongTienKdienDonGia * this.formData.value.khoanTienDatTruoc / 100,
      tongDonGia: tongDonGia,
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
    if (this.validateNgay()) {
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
          this.idInput = res.id;
          this.guiDuyet();
        } else {
          // this.quayLai()
        }
      }
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
        soQdCtieu: res2.data.soQuyetDinh,
        idSoQdCtieu: res2.data.id
      });
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
    if (this.dataTable.length == 0) {
      this.notification.error(
        MESSAGE.ERROR,
        'Danh sách danh mục tài sản bán đấu giá không được để trống',
      );
      return;
    }
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

  validateNgay() {
    let pipe = new DatePipe('en-US');
    let ngayTao = new Date(pipe.transform(this.formData.value.ngayTao, 'yyyy-MM-dd'));
    let ngayPduyet = new Date(pipe.transform(this.formData.value.ngayPduyet, 'yyyy-MM-dd'));
    if (this.formData.value.ngayPduyet) {
      if (ngayTao >= ngayPduyet) {
        this.notification.error(MESSAGE.ERROR, "Ngày tạo không được vượt quá ngày phê duyệt");
        return false
      }
    }
    return true;
  }

  setValidator(isGuiDuyet) {
    if (isGuiDuyet) {
      this.formData.controls["tenDvi"].setValidators([Validators.required]);
      this.formData.controls["maDvi"].setValidators([Validators.required]);
      this.formData.controls["loaiHinhNx"].setValidators([Validators.required]);
      this.formData.controls["diaChi"].setValidators([Validators.required]);
      this.formData.controls["namKh"].setValidators([Validators.required]);
      this.formData.controls["soDxuat"].setValidators([Validators.required]);
      this.formData.controls["trichYeu"].setValidators([Validators.required]);
      this.formData.controls["ngayTao"].setValidators([Validators.required]);
      this.formData.controls["soQdCtieu"].setValidators([Validators.required]);
      this.formData.controls["cloaiVthh"].setValidators([Validators.required]);
      this.formData.controls["tenCloaiVthh"].setValidators([Validators.required]);
      // this.formData.controls["moTaHangHoa"].setValidators([Validators.required]);
      this.formData.controls["thoiGianDuKien"].setValidators([Validators.required]);
      // this.formData.controls["tgianDkienTu"].setValidators([Validators.required]);
      // this.formData.controls["tgianDkienDen"].setValidators([Validators.required]);
      this.formData.controls["tgianTtoan"].setValidators([Validators.required]);
      this.formData.controls["pthucTtoan"].setValidators([Validators.required]);
      this.formData.controls["tgianGnhan"].setValidators([Validators.required]);
      this.formData.controls["pthucGnhan"].setValidators([Validators.required]);
      this.formData.controls["khoanTienDatTruoc"].setValidators([Validators.required]);
    } else {
      this.formData.controls["tenDvi"].clearValidators();
      this.formData.controls["maDvi"].clearValidators();
      this.formData.controls["loaiHinhNx"].clearValidators();
      this.formData.controls["diaChi"].clearValidators();
      this.formData.controls["namKh"].clearValidators();
      this.formData.controls["soDxuat"].clearValidators();
      this.formData.controls["trichYeu"].clearValidators();
      this.formData.controls["ngayTao"].clearValidators();
      this.formData.controls["soQdCtieu"].clearValidators();
      this.formData.controls["cloaiVthh"].clearValidators();
      this.formData.controls["tenCloaiVthh"].clearValidators();
      // this.formData.controls["moTaHangHoa"].clearValidators();
      this.formData.controls["thoiGianDuKien"].clearValidators();
      // this.formData.controls["tgianDkienTu"].clearValidators();
      // this.formData.controls["tgianDkienDen"].clearValidators();
      this.formData.controls["tgianTtoan"].clearValidators();
      this.formData.controls["pthucTtoan"].clearValidators();
      this.formData.controls["tgianGnhan"].clearValidators();
      this.formData.controls["pthucGnhan"].clearValidators();
      this.formData.controls["khoanTienDatTruoc"].clearValidators();
    }
  }
}
