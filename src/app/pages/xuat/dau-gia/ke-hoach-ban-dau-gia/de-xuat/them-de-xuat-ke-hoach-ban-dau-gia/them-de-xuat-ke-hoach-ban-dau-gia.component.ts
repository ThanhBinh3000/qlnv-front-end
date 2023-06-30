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
import { PREVIEW } from "../../../../../../constants/fileType";
import { saveAs } from 'file-saver';

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
  donGiaDuocDuyet: number = 0;
  maTrinh: string = '';
  giaToiDa: any;
  showDlgPreview = false;
  pdfBlob: any;
  pdfSrc: any;
  wordSrc: any;

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
      namKh: [dayjs().get('year'),],
      soDxuat: [''],
      trichYeu: [''],
      idSoQdCtieu: [],
      soQdCtieu: [''],
      ngayTao: [dayjs().format('YYYY-MM-DD')],
      ngayPduyet: [''],
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
      tongTienGiaKhoiDiemDx: [],
      tongTienGiaKdTheoDgiaDd: [],
      tongKhoanTienDatTruocDx: [],
      tongKhoanTienDtTheoDgiaDd: [],
      ghiChu: [''],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự Thảo'],
      lyDoTuChoi: [''],
      tongDonGiaDx: [],
      donViTinh: [''],
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
      this.listLoaiHinhNx = resNx.data.filter(item => item.apDung == 'XUAT_DG');
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
        this.getGiaToiThieu();
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
    this.dataTable = [];
    this.formData.patchValue({
      tongSoLuong: null,
      tongTienGiaKhoiDiemDx: null,
      tongTienGiaKdTheoDgiaDd: null,
      tongKhoanTienDatTruocDx: null,
      tongKhoanTienDtTheoDgiaDd: null,
    });
    const modalTuChoi = this.modal.create({
      nzTitle: 'DANH SÁCH HÀNG HÓA',
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
            donViTinh: 'Kg',
          });
        } else {
          this.formData.patchValue({
            donViTinh: data.maDviTinh,
          });
        }
        this.getGiaToiThieu();
      }
    });
  }

  async getGiaToiThieu() {
    if (this.formData.value.cloaiVthh && this.formData.value.namKh) {
      let res = await this.deXuatKhBanDauGiaService.getGiaBanToiThieu(this.formData.get('cloaiVthh').value, this.userInfo.MA_DVI, this.formData.get('namKh').value);
      if (res.msg === MESSAGE.SUCCESS) {
        this.giaToiDa = res.data;
      }
      if (this.formData.value.loaiVthh) {
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
          this.donGiaDuocDuyet = data.giaQd
        }
      }
      let resTC = await this.dmTieuChuanService.getDetailByMaHh(
        this.formData.get('cloaiVthh').value,
      );
      if (resTC.statusCode == API_STATUS_CODE.SUCCESS) {
        this.formData.patchValue({
          tchuanCluong: resTC.data ? resTC.data.tenQchuan : null,
        });
      }
    }
  }

  themMoiBangPhanLoTaiSan($event, data?: DanhSachPhanLo, index?: number) {
    $event.stopPropagation();
    if (this.loaiVthhInput.startsWith(LOAI_HANG_DTQG.VAT_TU)) {
      if (!this.formData.get('loaiVthh').value) {
        this.notification.error(MESSAGE.ERROR, 'Vui lòng chọn loại hàng hóa');
        return;
      }
    } else {
      if (!this.formData.get('loaiVthh').value || !this.formData.get('cloaiVthh').value) {
        this.notification.error(MESSAGE.ERROR, 'Vui lòng chọn loại hàng hóa và chủng loại hàng hóa');
        return;
      }
    }
    if (!this.formData.get('khoanTienDatTruoc').value) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng chọn khoản tiền đặt trước');
      return;
    }
    if (this.validateGiaGiaToiDa()) {
      const modalGT = this.modal.create({
        nzTitle: 'THÊM ĐỊA ĐIỂM GIAO NHẬN HÀNG',
        nzContent: DialogThemDiaDiemPhanLoComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '2500px',
        nzFooter: null,
        nzComponentParams: {
          dataEdit: data,
          dataChiTieu: this.dataChiTieu,
          loaiVthh: this.formData.get('loaiVthh').value,
          cloaiVthh: this.formData.get('cloaiVthh').value,
          tenCloaiVthh: this.formData.get('tenCloaiVthh').value,
          khoanTienDatTruoc: this.formData.get('khoanTienDatTruoc').value,
          namKh: this.formData.get('namKh').value,
          donViTinh: this.formData.get('donViTinh').value,
          donGiaDuocDuyet: this.donGiaDuocDuyet,
          giaToiDa: this.giaToiDa,
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
    }
  };

  validateGiaGiaToiDa() {
    if (this.giaToiDa == null) {
      this.notification.error(MESSAGE.ERROR, 'Bạn cần lập và trình duyệt phương án giá mua tối đa, giá bán tối thiểu trước. Chỉ sau khi có giá bán tối thiểu bạn mới thêm được danh mục đơn vị tài sản BDG vì giá bán đề xuất ở đây nhập vào phải >= giá bán tối thiểu');
      return false;
    } else {
      return true;
    }
  }

  validateAddDiaDiem(dataAdd): boolean {
    let data = this.dataTable.filter(item => item.maDvi == dataAdd.maDvi);
    if (data.length > 0) {
      this.notification.error(MESSAGE.ERROR, "Chi cục " + data[0].tenDvi + " đã tồn tại. Vui lòng thêm chi cục khác");
      return false;
    }
    return true;
  }

  calculatorTable() {
    let tongTienGiaKhoiDiemDx: number = 0;
    let tongTienGiaKdTheoDgiaDd: number = 0;
    this.dataTable.forEach((item) => {
      item.soTienDtruocDxChiCuc = 0;
      item.soTienDtruocDdChiCuc = 0;
      item.children.forEach((child) => {
        child.giaKhoiDiemDx = child.soLuongDeXuat * child.donGiaDeXuat;
        child.giaKhoiDiemDd = child.soLuongDeXuat * child.donGiaDuocDuyet;
        child.soTienDtruocDx = child.soLuongDeXuat * child.donGiaDeXuat * this.formData.value.khoanTienDatTruoc / 100;
        child.soTienDtruocDd = child.soLuongDeXuat * child.donGiaDuocDuyet * this.formData.value.khoanTienDatTruoc / 100;
        item.soTienDtruocDxChiCuc += child.soTienDtruocDx;
        item.soTienDtruocDdChiCuc += child.soTienDtruocDd;
        tongTienGiaKhoiDiemDx += child.giaKhoiDiemDx;
        tongTienGiaKdTheoDgiaDd += child.giaKhoiDiemDd;
      })
    });
    this.formData.patchValue({
      tongSoLuong: this.dataTable.reduce((prev, cur) => prev + cur.soLuongChiCuc, 0),
      tongTienGiaKhoiDiemDx: tongTienGiaKhoiDiemDx,
      tongTienGiaKdTheoDgiaDd: tongTienGiaKdTheoDgiaDd,
      tongKhoanTienDatTruocDx: this.dataTable.reduce((prev, cur) => prev + cur.soTienDtruocDxChiCuc, 0),
      tongKhoanTienDtTheoDgiaDd: this.dataTable.reduce((prev, cur) => prev + cur.soTienDtruocDdChiCuc, 0),
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
          this.idInput = res.id;
          this.getDetail(res.id)
        }
      }
    }
  }

  async getDataChiTieu() {
    let res2 = null;
    res2 = await this.chiTieuKeHoachNamCapTongCucService.loadThongTinChiTieuKeHoachCucNam(
      +this.formData.get('namKh').value,
    );
    if (res2.msg == MESSAGE.SUCCESS) {
      this.dataChiTieu = res2.data;
      this.formData.patchValue({
        soQdCtieu: res2.data.soQuyetDinh,
        idSoQdCtieu: res2.data.id
      });
    } else {
      this.dataChiTieu = null;
      this.formData.patchValue({
        soQdCtieu: null,
        idSoQdCtieu: null
      });
    }
  }

  async guiDuyet() {
    if (this.dataTable.length == 0) {
      this.notification.error(
        MESSAGE.ERROR,
        'Danh sách danh mục tài sản bán đấu giá không được để trống',
      );
      return;
    }
    if (this.validatemaDviTsan()) {
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

  validatemaDviTsan(): boolean {
    if (this.dataTable && this.dataTable.length > 0) {
      let data = this.dataTable.flatMap(s => s.children)
      const checkMaDviTsan = {};
      data.forEach((item) => {
        const maDviTsan = item.maDviTsan;
        if (checkMaDviTsan[maDviTsan]) {
          checkMaDviTsan[maDviTsan]++;
        } else {
          checkMaDviTsan[maDviTsan] = 1;
        }
      });
      let result = '';
      for (let prop in checkMaDviTsan) {
        if (checkMaDviTsan[prop] > 1) {
          result += `${prop} ( hiện đang bị lặp lại ${checkMaDviTsan[prop]} lần), `;
        }
      }
      let rs = Object.values(checkMaDviTsan).some(value => +value > 1);
      if (rs == true) {
        this.notification.error(MESSAGE.ERROR, "Mã đơn vị tài sản " + result.slice(0, -2) + " vui lòng nhập lại");
        return false;
      }
    }
    return true;
  }

  async onChangeNamKh() {
    if (this.userService.isCuc()) {
      await this.getDataChiTieu();
    } else {
      if (this.idInput == null) {
        await this.getDataChiTieu();
      }
    }
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      await this.getDetail(this.idInput);
    };
  }

  validateNgay() {
    let pipe = new DatePipe('en-US');
    let ngayTao = new Date(pipe.transform(this.formData.value.ngayTao, 'yyyy-MM-dd'));
    let ngayPduyet = new Date(pipe.transform(this.formData.value.ngayPduyet, 'yyyy-MM-dd'));
    if (this.formData.value.ngayPduyet) {
      if (ngayTao > ngayPduyet) {
        this.notification.error(MESSAGE.ERROR, "Ngày tạo không được vượt quá ngày phê duyệt");
        return false
      }
    }
    return true;
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
      this.formData.controls["thoiGianDuKien"].clearValidators();
      this.formData.controls["tgianTtoan"].clearValidators();
      this.formData.controls["pthucTtoan"].clearValidators();
      this.formData.controls["tgianGnhan"].clearValidators();
      this.formData.controls["pthucGnhan"].clearValidators();
      this.formData.controls["khoanTienDatTruoc"].clearValidators();
    }
  }

  async preview(id) {
    await this.deXuatKhBanDauGiaService.preview({
      "tenBaoCao": "de-xuat-ke-hoach-ban-dau-gia",
      "id": id
    }).then(async res => {
      if (res.data) {
        this.pdfSrc = PREVIEW.PATH_PDF + res.data.pdfSrc;
        this.wordSrc = PREVIEW.PATH_WORD + res.data.wordSrc;
        this.showDlgPreview = true;
      } else {
        this.notification.error(MESSAGE.ERROR, "Lỗi trong quá trình tải file.");
      }
    });
  }

  downloadPdf() {
    saveAs(this.pdfSrc, "De-xuat-ke-hoach-ban-dau-gia.pdf");
  }

  downloadWord() {
    saveAs(this.wordSrc, "De-xuat-ke-hoach-ban-dau-gia.docx");
  }

  closeDlg() {
    this.showDlgPreview = false;
  }
}
