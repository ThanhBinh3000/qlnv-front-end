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
import { DanhSachXuatBanTrucTiep } from 'src/app/models/KeHoachBanDauGia';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { DeXuatKhBanTrucTiepService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/de-xuat-kh-ban-truc-tiep.service';
import { DialogThemMoiXuatBanTrucTiepComponent } from 'src/app/components/dialog/dialog-them-moi-xuat-ban-truc-tiep/dialog-them-moi-xuat-ban-truc-tiep.component';
import { chain } from 'lodash'
@Component({
  selector: 'app-them-moi-de-xuat-kh-ban-truc-tiep',
  templateUrl: './them-moi-de-xuat-kh-ban-truc-tiep.component.html',
  styleUrls: ['./them-moi-de-xuat-kh-ban-truc-tiep.component.scss']
})
export class ThemMoiDeXuatKhBanTrucTiepComponent extends Base2Component implements OnInit, OnChanges {
  @Input()
  loaiVthhInput: string;

  tabVthh: any[] = [];
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
      tenDvi: [''],
      loaiHinhNx: [''],
      kieuNx: [''],
      diaChi: [''],
      namKh: [dayjs().get('year')],
      soDxuat: [''],
      trichYeu: [''],
      ngayTao: [dayjs().format('YYYY-MM-DD')],
      ngayPduyet: [''],
      soQdCtieu: [''],
      loaiVthh: ['', [Validators.required]],
      tenLoaiVthh: ['', [Validators.required]],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      tchuanCluong: [''],
      thoiGianDuKien: [''],
      tgianDkienTu: [''],
      tgianDkienDen: [,],
      tgianTtoan: [''],
      tgianTtoanGhiChu: [''],
      pthucTtoan: [''],
      tgianGnhan: [''],
      tgianGnhanGhiChu: [null],
      pthucGnhan: [''],
      thongBaoKh: [''],
      tongSoLuong: [],
      ghiChu: [''],
      soQdPd: [''],
      ngayKyQd: [''],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự Thảo'],
      lyDoTuChoi: [''],
      donGiaVat: [],
      tongDonGia: [],
      slDviTsan: [],
      typeVthh: [''],
      dviTinh: [''],
      idSoQdCtieu: [''],
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
        this.calculatorTable();
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
            // dviTinh: data.maDviTinh,
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
    if (!this.formData.get('loaiVthh').value || !this.formData.get('cloaiVthh').value) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng chọn loại hàng hóa và chủng loại hàng hóa');
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
        tenCloaiVthh: this.formData.get('tenCloaiVthh').value,
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
      this.notification.error(MESSAGE.ERROR, data[0].tenDvi + " đã tồn tại. Vui lòng thêm chi cục khác");
      return false;
    }
    return true;
  }

  calculatorTable() {
    let tongSoLuong: number = 0;
    let tongDonGia: number = 0;
    let soLuongDviTsan: number = 0;
    this.dataTable.forEach((item) => {
      let dataGroup = chain(item.children).groupBy('maDviTsan').map((value, key) => ({
        maDviTsan: key,
        children: value
      })).value();
      item.dataDviTsan = dataGroup;
      soLuongDviTsan += item.dataDviTsan.length;
      tongSoLuong += item.soLuongChiCuc;
      item.children.forEach(child => {
        tongDonGia += child.donGiaDeXuat;
      })
    });
    this.formData.patchValue({
      tongSoLuong: tongSoLuong,
      tongDonGia: tongDonGia,
      slDviTsan: soLuongDviTsan,
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
        this.quayLai()
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
      if (this.dataChiTieu) {
        this.formData.patchValue({
          soQdCtieu: res2.data.soQuyetDinh,
          idSoQdCtieu: res2.data.id
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
    if (this.dataTable.length == 0) {
      this.notification.error(
        MESSAGE.ERROR,
        'Danh mục đơn vị tài sản bán trực tiếp không được để trống',
      );
      return;
    }
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

  isDisable(): boolean {
    if (this.formData.value.trangThai == STATUS.DU_THAO || this.formData.value.trangThai == STATUS.TU_CHOI_TP ||
      this.formData.value.trangThai == STATUS.TU_CHOI_LDC) {
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
      this.formData.controls["thoiGianDuKien"].setValidators([Validators.required]);
      // this.formData.controls["tgianDkienTu"].setValidators([Validators.required]);
      // this.formData.controls["tgianDkienDen"].setValidators([Validators.required]);
      this.formData.controls["tgianTtoan"].setValidators([Validators.required]);
      this.formData.controls["pthucTtoan"].setValidators([Validators.required]);
      this.formData.controls["tgianGnhan"].setValidators([Validators.required]);
      this.formData.controls["pthucGnhan"].setValidators([Validators.required]);
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
      this.formData.controls["thoiGianDuKien"].clearValidators();
      // this.formData.controls["tgianDkienTu"].clearValidators();
      // this.formData.controls["tgianDkienDen"].clearValidators();
      this.formData.controls["tgianTtoan"].clearValidators();
      this.formData.controls["pthucTtoan"].clearValidators();
      this.formData.controls["tgianGnhan"].clearValidators();
      this.formData.controls["pthucGnhan"].clearValidators();

    }
  }
}
