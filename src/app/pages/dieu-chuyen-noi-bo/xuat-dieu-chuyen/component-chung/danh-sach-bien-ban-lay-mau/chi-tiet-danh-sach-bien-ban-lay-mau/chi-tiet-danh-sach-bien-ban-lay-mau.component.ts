import { BienBanLayMauDieuChuyenService } from './../../services/dcnb-bien-ban-lay-mau.service';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BienBanLayMauBanGiaoMauService } from 'src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/BienBanLayMauBanGiaoMau.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import dayjs from 'dayjs';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import { MESSAGE } from 'src/app/constants/message';
import { STATUS } from 'src/app/constants/status';
import { QuyetDinhGiaoNvCuuTroService } from 'src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhGiaoNvCuuTro.service';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { isEmpty } from 'lodash';
import { PhuongPhapLayMau } from 'src/app/models/PhuongPhapLayMau';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { ItemDaiDien } from 'src/app/pages/nhap/dau-thau/kiem-tra-chat-luong/quan-ly-bien-ban-lay-mau/them-moi-bien-ban-lay-mau/thanhphan-laymau/thanhphan-laymau.component';
import { Validators } from '@angular/forms';
import { ChiTietList } from 'src/app/models/QdPheDuyetKHBanDauGia';
import { QuyetDinhDieuChuyenCucService } from 'src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-c.service';
import { cloneDeep } from 'lodash';
import { PassData } from '../danh-sach-bien-ban-lay-mau.component';

@Component({
  selector: 'app-chi-tiet-danh-sach-bien-ban-lay-mau',
  templateUrl: './chi-tiet-danh-sach-bien-ban-lay-mau.component.html',
  styleUrls: ['./chi-tiet-danh-sach-bien-ban-lay-mau.component.scss']
})
export class ChiTietDanhSachBienBanLayMau extends Base2Component implements OnInit {
  @Input() loaiVthh: string[];
  @Input() idInput: number;
  @Input() isView: boolean;

  @Input() isEdit: boolean;
  // @Input() isViewDetail: boolean;
  @Input() isAddNew: boolean;
  @Input() isViewOnModal: boolean;
  @Input() passData: PassData
  @Output()
  showListEvent = new EventEmitter<any>();

  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  listSoQuyetDinh: any[] = [];
  listDiaDiemNhap: any[] = [];
  phuongPhapLayMaus: Array<PhuongPhapLayMau>;
  daiDienCuc: string;
  listDaiDienChiCuc: any[] = [];
  daiDienChiCuc: string;
  listDaiDienCuc: any[] = [];
  maBb: string;
  radioValue: any;
  checked: boolean = false;
  canCu: any = [];
  bienBanLayMauDinhKem: any = [];
  fileDinhKemChupMauNiemPhong: any = [];
  bienBan: any[] = [];
  dcnbBienBanLayMauDtl: any[] = [];
  LIST_TRANG_THAI: { [key: string]: string } = {
    [STATUS.DU_THAO]: "Dự thảo",
    [STATUS.CHO_DUYET_LDCC]: "Chờ duyệt LĐ Chi Cục",
    [STATUS.TU_CHOI_LDCC]: "Từ chối LĐ Chi Cục",
    [STATUS.DA_DUYET_LDCC]: "Đã duyệt LĐ Chi Cục"
  }
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private quyetDinhDieuChuyenCucService: QuyetDinhDieuChuyenCucService,
    private bienBanLayMauBanGiaoMauService: BienBanLayMauBanGiaoMauService,
    private bienBanLayMauDieuChuyenService: BienBanLayMauDieuChuyenService
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanLayMauDieuChuyenService);

    this.formData = this.fb.group(
      {
        id: [],
        nam: [dayjs().get("year")],
        maDvi: [],
        loaiBienBan: ['ALL'],
        maQhns: [],
        qdinhDccId: [, [Validators.required]],
        soQdinhDcc: [, [Validators.required]],
        ngayQdDc: [],
        ktvBaoQuan: [],
        soBbLayMau: [],
        ngayLayMau: [,],
        dviKiemNghiem: [],
        diaDiemLayMau: [],
        loaiVthh: [, [Validators.required]],
        cloaiVthh: [, [Validators.required]],
        moTaHangHoa: [],
        maDiemKho: [],
        maNhaKho: [],
        maNganKho: [],
        maLoKho: [],
        soLuongMau: [],
        pplayMau: [],
        chiTieuKiemTra: [],
        ketQuaNiemPhong: [],
        trangThai: [STATUS.DU_THAO],
        lyDoTuChoi: [],
        soBbHaoDoi: [],
        soBbTinhKho: [],
        ngayXuatDocKho: [],
        type: [],
        tenDvi: [''],
        tenLoaiVthh: [''],
        tenCloaiVthh: [''],
        tenTrangThai: ['Dự Thảo'],
        diaChiDvi: [],
        tenDiemKho: [, [Validators.required]],
        tenNhaKho: [],
        tenNganKho: [],
        tenLoKho: [],
        nguoiLienQuan: [new Array()],
        bienBanLayMauDinhKem: [new Array<FileDinhKem>()],
        canCu: [new Array<FileDinhKem>()],
        fileDinhKemChupMauNiemPhong: [new Array<FileDinhKem>()],

        doiThuKho: [true],
        checked: [true],
        soBienBanBaoQuanLanDau: ['']
      }
    );
    this.maBb = 'BBLM-' + this.userInfo.DON_VI.tenVietTat;

    // this.setTitle();
  }

  async ngOnInit() {
    try {
      this.spinner.show();
      await Promise.all([
        this.loadDetail(this.idInput),
        this.loadPhuongPhapLayMau(),
      ])
      if (!this.idInput) {
        this.formData.patchValue({ ...this.passData });
      }
      this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      this.spinner.hide();
      console.log("error", e)
    } finally {
      this.spinner.hide();
    }
  }
  async loadDetail(idInput: number) {
    if (idInput > 0) {
      await this.bienBanLayMauDieuChuyenService.getDetail(idInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.formData.patchValue(res.data);
            const data = res.data;
            this.dcnbBienBanLayMauDtl = cloneDeep(data.dcnbBienBanLayMauDtl),
              this.checked = data.ketQuaNiemPhong;
            // this.daiDienChiCuc = data.nguoiLienQuan;
            this.bienBanLayMauDinhKem = cloneDeep(data.bienBanLayMauDinhKem);
            this.canCu = data.canCu;
            this.fileDinhKemChupMauNiemPhong = cloneDeep(data.fileDinhKemChupMauNiemPhong);
            const obj = Array.isArray(data.dcnbBienBanLayMauDtl) ? data.dcnbBienBanLayMauDtl.reduce((obj, cur) => {
              if (cur.loaiDaiDien == "00") {
                obj.listDaiDienCuc.push({ ...cur, daiDien: cur.tenDaiDien })
              } else if (cur.loaiDaiDien == "01") {
                obj.listDaiDienChiCuc.push({ ...cur, daiDien: cur.tenDaiDien })
              };
              return obj
            }, { listDaiDienCuc: [], listDaiDienChiCuc: [] }) : { listDaiDienCuc: [], listDaiDienChiCuc: [] };
            this.listDaiDienCuc = cloneDeep(obj.listDaiDienCuc);
            this.listDaiDienChiCuc = cloneDeep(obj.listDaiDienChiCuc);
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      let id = await this.userService.getId('DCNB_BIEN_BAN_LAY_MAU_HDR_SEQ')
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
        maQhns: this.userInfo.DON_VI.maQhns,
        ktvBaoQuan: this.userInfo.TEN_DAY_DU,
        soBbLayMau: `${id}/${this.formData.get('nam').value}/${this.maBb}`,
        id: id

      });
    }

  }

  quayLai() {
    this.showListEvent.emit();
  }

  async loadSoQuyetDinh() {
    let body = {
      trangThai: STATUS.BAN_HANH,
      loaiVthh: this.loaiVthh,
      loaiDc: "DCNB",
      maDvi: this.userInfo.MA_DVI
      // listTrangThaiXh: [STATUS.CHUA_THUC_HIEN, STATUS.DANG_THUC_HIEN],
    }
    try {
      let res = await this.quyetDinhDieuChuyenCucService.getDsSoQuyetDinhDieuChuyenChiCuc(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.listSoQuyetDinh = Array.isArray(data) ? data.reduce((arr, cur) => {
          if (arr.findIndex(f => f.soQdinh == cur.soQdinh) < 0) {
            arr.push(cur)
          }
          return arr
        }, []) : [];
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    } catch (error) {
      console.log("error", error)
    }
  }

  async openDialogSoQd(event: MouseEvent, disabled?: boolean) {
    const elm = event.target as HTMLInputElement;
    if (disabled || elm?.localName == "input") return;
    await this.loadSoQuyetDinh();
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định xuất điều chuyển',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoQuyetDinh,
        // dataHeader: ['Số quyết định', 'Ngày quyết định', 'Loại hàng hóa'],
        // dataColumn: ['soQdinh', 'ngayKyQdinh', 'tenLoaiVthh'],
        dataHeader: ['Số quyết định', 'Ngày quyết định'],
        dataColumn: ['soQdinh', 'ngayKyQdinh'],
      },
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.bindingDataQd(data.id, true);
      }
    });
  };

  async bindingDataQd(id, isSetTc?) {
    try {
      await this.spinner.show();
      let dataRes = await this.quyetDinhDieuChuyenCucService.getDetail(id)
      const data = dataRes.data;
      this.formData.patchValue({
        soQdinhDcc: data.soQdinh,
        qdinhDccId: data.id,
        ngayQdDc: data.ngayKyQdinh,
        // loaiVthh: data.loaiVthh,
        // tenLoaiVthh: data.tenLoaiVthh,

        maLoKho: '',
        tenLoKho: '',
        maNganKho: '',
        tenNganKho: '',
        maNhaKho: '',
        tenNhaKho: '',
        maDiemKho: '',
        tenDiemKho: '',
        loaiVthh: '',
        tenLoaiVthh: '',
        cloaiVthh: '',
        tenCloaiVthh: ''
      });
      // let dataChiCuc = data.arrDataQuyetDinh.find(item =>
      //     item.maDviChiCuc == this.userInfo.MA_DVI
      // );
      this.listDiaDiemNhap = [];
      let dataChiCuc = [];
      if (Array.isArray(data?.danhSachQuyetDinh)) {
        data.danhSachQuyetDinh.forEach(element => {
          if (Array.isArray(element.danhSachKeHoach)) {
            element.danhSachKeHoach.forEach(item => {
              if (item.maChiCucNhan == this.userInfo.MA_DVI && dataChiCuc.findIndex(f => f.maChiCucNhan == item.maChiCucNhan) < 0 && dataChiCuc.findIndex(f => f.maLoKho == item.maLoKho) < 0) {
                dataChiCuc.push(item)
              }
            });
          }
        });
      }
      if (dataChiCuc) {
        this.listDiaDiemNhap = cloneDeep(dataChiCuc);
      }
    } catch (error) {
      console.log("error", error);

    } finally {
      await this.spinner.hide();

    }
  }

  openDialogDdiemNhapHang(event: MouseEvent, disabled?: boolean) {
    const elm = event.target as HTMLInputElement;
    if (disabled || elm?.localName == "input") return;
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách địa điểm xuất hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDiaDiemNhap,
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      this.bindingDataDdNhap(data);
    });
  }

  async bindingDataDdNhap(data) {
    if (data) {
      this.formData.patchValue({
        maDiemKho: data.maDiemKho,
        tenDiemKho: data.tenDiemKho,
        maNhaKho: data.maNhaKho,
        tenNhaKho: data.tenNhaKho,
        maNganKho: data.maNganKho,
        tenNganKho: data.tenNganKho,
        maLoKho: data.maLoKho,
        tenLoKho: data.tenLoKho,
        tenLoaiVthh: data.tenLoaiVthh,
        loaiVthh: data.loaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        cloaiVthh: data.cloaiVthh,
      })
    }
  }

  async save(isGuiDuyet?) {
    // this.setValidator(isGuiDuyet);
    if (!isGuiDuyet) {
      this.setValidator(false);
      this.helperService.markFormGroupTouched(this.formData);
    }
    let body = this.formData.value;
    // if (this.formData.value.soQdinhDcc) {
    //     body.soQdinhDcc = this.formData.value.soQdinhDcc + "/" + this.maBb;
    // }
    body.bienBanLayMauDinhKem = this.bienBanLayMauDinhKem;
    body.canCu = this.canCu;
    // body.id = this.idInput;
    body.fileDinhKemChupMauNiemPhong = this.fileDinhKemChupMauNiemPhong;
    body.dcnbBienBanLayMauDtl = this.listDaiDienCuc.map(f => ({ ...f, loaiDaiDien: '00', tenDaiDien: f.daiDien })).concat(this.listDaiDienChiCuc.map(f => ({ ...f, loaiDaiDien: '01', tenDaiDien: f.daiDien })))
    let data = await this.createUpdate(body);
    if (data) {
      if (isGuiDuyet) {
        this.idInput = data.id;
        this.pheDuyet();
      } else {
        this.goBack()
      }
    }
  }
  async createUpdate(body, roles?: any) {
    if (!this.checkPermission(roles)) {
      return
    }
    await this.spinner.show();
    try {
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        return;
      }
      let res = null;
      if (this.idInput && this.idInput > 0) {
        res = await this.bienBanLayMauDieuChuyenService.update(body);
      } else {
        res = await this.bienBanLayMauDieuChuyenService.create(body);
      }
      if (res.msg == MESSAGE.SUCCESS) {
        if (this.idInput && this.idInput > 0) {
          this.notification.success(MESSAGE.NOTIFICATION, MESSAGE.UPDATE_SUCCESS);
          return res.data;
        } else {
          this.notification.success(MESSAGE.NOTIFICATION, MESSAGE.ADD_SUCCESS);
          return res.data;
        }
        this.formData.patchValue({ id: res.data.id });
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

  pheDuyet() {
    let trangThai = '';
    let msg = '';
    switch (this.formData.value.trangThai) {
      case STATUS.TU_CHOI_LDCC:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_LDCC;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.DA_DUYET_LDCC;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
    }
    this.approve(this.idInput, trangThai, msg);
  }

  tuChoi() {
    let trangThai = '';
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.TU_CHOI_LDCC;
        break;
      }
    }
    this.reject(this.idInput, trangThai)
  }

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.CHO_DUYET_LDCC) {
      return true
    }
    return false;
  }
  async loadPhuongPhapLayMau() {
    this.danhMucService.danhMucChungGetAll("PP_LAY_MAU").then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.phuongPhapLayMaus = res.data;
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }).catch(err => {
      this.notification.error(MESSAGE.ERROR, err.msg);
    })
  }
  async saveAndSend(): Promise<void> {
    this.setValidator(true);
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.valid) {
      this.save(true)
    }
  }
  setValidator(isGuiDuyet) {
    if (isGuiDuyet) {
      this.formData.controls['maDvi'].setValidators([Validators.required]);
      this.formData.controls['soBbLayMau'].setValidators([Validators.required]);
      this.formData.controls['dviKiemNghiem'].setValidators([Validators.required]);
      this.formData.controls['diaDiemLayMau'].setValidators([Validators.required]);
      this.formData.controls['soLuongMau'].setValidators([Validators.required]);
      this.formData.controls['pplayMau'].setValidators([Validators.required]);
      this.formData.controls['chiTieuKiemTra'].setValidators([Validators.required]);
    } else {
      this.formData.controls['maDvi'].clearValidators();
      this.formData.controls['soBbLayMau'].clearValidators();
      this.formData.controls['dviKiemNghiem'].clearValidators();
      this.formData.controls['diaDiemLayMau'].clearValidators();
      this.formData.controls['soLuongMau'].clearValidators();
      this.formData.controls['pplayMau'].clearValidators();
      this.formData.controls['chiTieuKiemTra'].clearValidators();
    }
  }

}
;
