import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Base2Component } from 'src/app/components/base2/base2.component';
import dayjs from 'dayjs';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import { MESSAGE } from 'src/app/constants/message';
import { STATUS } from 'src/app/constants/status';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { PhieuKiemNghiemChatLuongService } from 'src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/PhieuKiemNghiemChatLuong.service';
import { convertTienTobangChu } from 'src/app/shared/commonFunction';
import { Validators } from '@angular/forms';
import { BienBanTinhKhoService } from './../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/xuat-kho/BienBanTinhKho.service';
import { PhieuXuatKhoService } from './../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/xuat-kho/PhieuXuatKho.service';
import { QuyetDinhGiaoNvXuatHangService } from './../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/quyetdinh-nhiemvu-xuathang/quyet-dinh-giao-nv-xuat-hang.service';
import { BienBanTinhKhoDieuChuyenService } from '../../services/dcnb-bien-ban-tinh-kho.service';
import { QuyetDinhDieuChuyenCucService } from 'src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-c.service';
import { PhieuXuatKhoDieuChuyenService } from '../../services/dcnb-xuat-kho.service';
import { MA_QUYEN_BBTK, PassDataBienBanTinhKho } from '../bien-ban-tinh-kho.component';
import { PREVIEW } from 'src/app/constants/fileType';

export const LIST_TRANG_THAI_BBTK = {
  [STATUS.DU_THAO]: "Dự thảo",
  [STATUS.CHO_DUYET_KTVBQ]: "Chờ duyệt - kỹ thuật viên bảo quản",
  [STATUS.TU_CHOI_KTVBQ]: "Từ chối kỹ - thuật viên bảo quản",
  [STATUS.CHO_DUYET_KT]: "Chờ duyệt - kế toán",
  [STATUS.TU_CHOI_KT]: "Từ chối - kế toán",
  [STATUS.CHO_DUYET_LDCC]: "Chờ duyệt - lãnh đạo chi cục",
  [STATUS.TU_CHOI_LDCC]: "Từ chối - lãnh đạo chi cục",
  [STATUS.DA_DUYET_LDCC]: "Đã duyệt - lãnh đạo chi cục"
}
@Component({
  selector: 'app-xuat-dcnb-them-moi-bien-ban-tinh-kho',
  templateUrl: './them-moi-bien-ban-tinh-kho.component.html',
  styleUrls: ['./them-moi-bien-ban-tinh-kho.component.scss']
})
export class ThemMoiBienBanTinhKhoDieuChuyenComponent extends Base2Component implements OnInit {
  @Input() loaiDc: string;
  @Input() thayDoiThuKho: boolean;
  @Input() isVatTu: boolean;
  @Input() type: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() passData: PassDataBienBanTinhKho;
  @Input() isViewOnModal: boolean;
  @Input() MA_QUYEN: MA_QUYEN_BBTK;
  @Output()
  showListEvent = new EventEmitter<any>();
  listSoQuyetDinh: any[] = []
  listDiaDiemNhap: any[] = [];
  listDiemKho: any[] = [];
  maBb: string;
  checked: boolean = false;
  //View modal ifor
  isViewModalPhieuKNCL: boolean;
  idPhieuKNCL: number;
  isViewModalPhieuXuatKho: boolean;
  idPhieuXuatKho: number;
  isViewModalBKCH: boolean;
  idBKCH: number;
  isViewModalBKXVT: boolean;
  idBKXVT: number;
  fileBbTinhKhoDaKy: FileDinhKem[] = [];

  LIST_TRANG_THAI = LIST_TRANG_THAI_BBTK;
  previewName: string = "bien_ban_tinh_kho_lt_xuat_dieu_chuyen";

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private quyetDinhDieuChuyenCucService: QuyetDinhDieuChuyenCucService,
    private phieuXuatKhoDieuChuyenService: PhieuXuatKhoDieuChuyenService,
    private bienBanTinhKhoDieuChuyenService: BienBanTinhKhoDieuChuyenService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanTinhKhoDieuChuyenService);

    this.formData = this.fb.group(
      {
        id: [],
        nam: [dayjs().get("year"), [Validators.required]],
        maDvi: [, [Validators.required]],
        maQhns: [, [Validators.required]],
        soBbTinhKho: [],
        ngayLap: [, [Validators.required]],
        qdinhDccId: [, [Validators.required]],
        soQdinhDcc: ['', [Validators.required]],
        ngayKyQdDcc: ['', [Validators.required]],
        maDiemKho: ['', [Validators.required]],
        maNhaKho: ['', [Validators.required]],
        maNganKho: ['', [Validators.required]],
        maLoKho: [],
        loaiVthh: [, [Validators.required]],
        cloaiVthh: [, [Validators.required]],
        moTaHangHoa: [],
        ngayBatDauXuat: [, [Validators.required]],
        ngayKetThucXuat: [, [Validators.required]],
        tonKhoBanDau: [0],
        tongSlXuatTheoQd: [0],
        tongSlXuatTheoTt: [0],
        slConLaiTheoSs: [0],
        slConLaiTheoTt: [0],
        chenhLechSlConLai: [],
        slThua: [0],
        slThieu: [0],
        nguyenNhan: ['', [Validators.required]],
        kienNghi: ['', [Validators.required]],
        ghiChu: ['', [Validators.required]],
        thuKho: ['', [Validators.required]],
        ktvBaoQuan: [],
        ktvBaoQuanId: [],
        keToan: [],
        keToanId: [],
        lanhDaoChiCuc: [],
        lanhDaoChiCucId: [],
        trangThai: [STATUS.DU_THAO],
        lyDoTuChoi: [],
        diaChiDvi: [],
        tenDvi: [, [Validators.required]],
        tenCloaiVthh: [, [Validators.required]],
        tenLoaiVthh: [, [Validators.required]],
        tenTrangThai: ['Dự Thảo', [Validators.required]],
        tenNhaKho: ['', [Validators.required]],
        tenDiemKho: ['', [Validators.required]],
        tenLoKho: [],
        tenNganKho: [],
        tenNganLoKho: ['', [Validators.required]],
        dcnbBienBanTinhKhoDtl: [new Array(), [Validators.required, Validators.minLength(1)]],
        donViTinh: ['', [Validators.required]],
        soPhieuKnChatLuong: ['', [Validators.required]],
        phieuKnChatLuongHdrId: ['', [Validators.required]],
        keHoachDcDtlId: [, [Validators.required]]
      }
    );
    this.maBb = '-BBTK';
    // this.setTitle();
  }

  async ngOnInit() {
    try {
      this.spinner.show();
      if (this.isViewOnModal) {
        this.isView = true;
      }
      this.setValidate();
      await this.loadDetail(this.idInput)
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
    } finally {
      this.spinner.hide();
    }
  }


  async loadDetail(idInput: number) {
    if (idInput > 0) {
      await this.bienBanTinhKhoDieuChuyenService.getDetail(idInput)
        .then((res) => {
          if (res.msg === MESSAGE.SUCCESS) {
            this.formData.patchValue(res.data);
            this.formData.patchValue({ soBbTinhKho: res.data.soBbTinhKho ? res.data.soBbTinhKho : this.genSoBienBanTinhKho(res.data.id), tenNganLoKho: res.data.tenLoKho ? `${res.data.tenLoKho} - ${res.data.tenNganKho}` : res.data.tenNganKho });
            const data = res.data;
            this.fileBbTinhKhoDaKy = data.fileBbTinhKhoDaKy;
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      // let id = await this.userService.getId('XH_CTVT_PHIEU_XUAT_KHO_SEQ')
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
        maQhns: this.userInfo.DON_VI.maQhns,
        // soBbTinhKho: `${id}/${this.formData.get('nam').value}/${this.maBb}`,
        ngayLap: dayjs().format('YYYY-MM-DD'),
        ngayKetThucXuat: dayjs().format('YYYY-MM-DD'),
        thuKho: this.userInfo.TEN_DAY_DU,
        ...this.passData,
        tenNganLoKho: this.passData.tenLoKho ? `${this.passData.tenLoKho} - ${this.passData.tenNganKho}` : this.passData.tenNganKho
      });
      if (this.passData.qdinhDccId) {
        await this.bindingDataQd(this.passData.qdinhDccId, true);
        const dataDiaDiemNhap = this.listDiaDiemNhap.find(f => ((f.maLoKho && f.maLoKho === this.passData.maLoKho) || (!f.maLoKho && !this.passData.maLoKho && f.maNganKho && f.maNganKho === this.passData.maNganKho)))
        this.bindingDataDdNhap(dataDiaDiemNhap)
      }
    }

  }
  genSoBienBanTinhKho(id: number) {
    if (id) {
      return `${id}/${this.formData.value.nam}${this.maBb}`
    }
  }
  quayLai() {
    this.showListEvent.emit();
  }
  async loadSoQuyetDinh() {
    this.spinner.show();
    try {

      let body = {
        loaiDc: this.loaiDc, isVatTu: this.isVatTu, thayDoiThuKho: this.thayDoiThuKho, type: "00",
        trangThai: STATUS.BAN_HANH,
      }
      let res = await this.quyetDinhDieuChuyenCucService.getDsSoQuyetDinhDieuChuyenChiCuc(body);
      if (res.msg === MESSAGE.SUCCESS) {
        this.listSoQuyetDinh = res.data;
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    } catch (error) {
      console.log('e', error);
      this.notification.error(MESSAGE.ERROR, "Có lỗi xảy ra.")
    }
    finally {
      this.spinner.hide();
    }
  }
  async openDialogSoQd() {
    await this.loadSoQuyetDinh();
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định kế hoạch giao nhiệm vụ xuất hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoQuyetDinh,
        dataHeader: ['Số quyết định', 'Ngày quyết định'],
        dataColumn: ['soQdinh', 'ngayKyQdinh'],
      },
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.resetData();
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
        ngayKyQdDcc: data.ngayKyQdinh,
        // soHdong: data.soHd,
        // idHdong: data.idHd,
        // ngayKyHd: data.ngayKyHd,

      });
      if (dataRes.msg === MESSAGE.SUCCESS) {
        const data = dataRes.data;
        this.formData.patchValue({
          qddcId: data.id,
          soQddc: data.soQdinh,
          ngayKyQddc: data.ngayKyQdinh,
        });
        this.listDiaDiemNhap = [];
        let dataChiCuc = [];

        if (data.maDvi === this.userInfo.MA_DVI && Array.isArray(data?.danhSachQuyetDinh)) {
          data.danhSachQuyetDinh.forEach(element => {
            if (Array.isArray(element?.dcnbKeHoachDcHdr?.danhSachHangHoa)) {
              element.dcnbKeHoachDcHdr.danhSachHangHoa.forEach(item => {
                // if (dataChiCuc.findIndex(f => ((!f.maLoKho && !item.maLoKho && item.maNganKho && f.maNganKho === item.maNganKho) || (f.maLoKho && f.maLoKho === item.maLoKho))) < 0) {
                // }
                // dataChiCuc.push(item)
                if (item.thayDoiThuKho === this.thayDoiThuKho) {
                  dataChiCuc.push(item)
                }
              });
            }
          });
        }
        this.listDiaDiemNhap = dataChiCuc.map(f => ({ ...f, noiNhan: `${f.tenDiemKhoNhan || ""} - ${f.tenNhaKhoNhan || ""} - ${f.tenNganKhoNhan || ""} - ${f.tenLoKhoNhan || ""}` }));
      }
    } catch (error) {
      console.log("e", error);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR)
    } finally {
      await this.spinner.hide();
    }
  }



  openDialogDdiemXuatHang() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách địa điểm xuất hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1200px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDiaDiemNhap,
        dataHeader: ['Điểm kho xuất', 'Nhà kho xuất', 'Ngăn kho xuất', 'Lô kho xuất', "Nơi nhận"],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho', 'noiNhan']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.resetData();
        this.bindingDataDdNhap(data);
      }
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
        tenNganLoKho: data.tenLoKho ? `${data.tenLoKho} - ${data.tenNganKho}` : data.tenNganKho,

        loaiVthh: data.loaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        moTaHangHoa: data.moTaHangHoa,

        keHoachDcDtlId: data.id,

        tongSlXuatTheoQd: data.soLuongDc || 0,
        tonKhoBanDau: data.tonKho || 0,
        slConLaiTheoSs: data.tonKho - data.soLuongDc,
        donViTinh: data.donViTinh

      })
      let body = {
        loaiDc: this.loaiDc,
        isVatTu: this.isVatTu,
        thayDoiThuKho: this.thayDoiThuKho,
        type: this.type,
        trangThai: STATUS.DA_DUYET_LDCC,
        qdinhDccId: this.formData.value.qdinhDccId,
        maLoKho: this.formData.value.maLoKho,
        maNganKho: this.formData.value.maNganKho
      }
      let res = await this.phieuXuatKhoDieuChuyenService.getThongTinChungPhieuXuatKho(body);
      if (res.msg === MESSAGE.SUCCESS) {
        const list = res.data;
        // this.listPhieuXuatKho = list.filter(item => ((this.formData.value.maLoKho && this.formData.value.maLoKho === item.maloKho) ||
        //   (!this.formData.value.maLoKho && this.formData.value.maNganKho && this.formData.value.maNganKho === item.maNganKho)));
        const dataTable = Array.isArray(list) ? list.map(f => ({
          bangKeCanHangHdrId: this.isVatTu ? f.bangKeXuatVtId : f.bangKeCanHangId,
          hdrId: null,
          id: null,
          ngayXuatKho: f.ngayXuatKho,
          phieuXuatKhoHdrId: f.id,
          soPhieuXuatKho: f.soPhieuXuatKho,
          soBangKeCanHang: this.isVatTu ? f.soBangKeXuatVt : f.soBangKeCanHang,
          soLuongXuat: f.soLuong
        })) : [];
        const tongSlXuat = dataTable.reduce((sum, cur) => sum += cur.soLuongXuat, 0);
        this.formData.patchValue({ tongSlXuatTheoTt: tongSlXuat, dcnbBienBanTinhKhoDtl: dataTable, soPhieuKnChatLuong: list[0]?.soPhieuKiemNghiemCl, phieuKnChatLuongHdrId: list[0]?.phieuKiemNghiemClId })

        if (this.formData.value.dcnbBienBanTinhKhoDtl && this.formData.value.dcnbBienBanTinhKhoDtl.length > 0) {
          const maxDate = new Date(Math.min.apply(null, this.formData.value.dcnbBienBanTinhKhoDtl.map(function (e) {
            return new Date(e.ngayXuatKho);
          })));
          const minDateString = maxDate.toISOString().slice(0, 10);
          this.formData.patchValue({
            ngayBatDauXuat: minDateString
          })
        }
      }
    }
  }
  resetData() {
    this.formData.patchValue({
      maDiemKho: '',
      tenDiemKho: '',
      maNhaKho: '',
      tenNhaKho: '',
      maNganKho: '',
      tenNganKho: '',
      maLoKho: '',
      tenLoKho: '',
      tenNganLoKho: '',

      loaiVthh: '',
      cloaiVthh: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      moTaHangHoa: '',

      tongSlXuatTheoQd: 0,
      tonKhoBanDau: 0,
      slConLaiTheoSs: 0,
      tongSlXuatTheoTt: 0,
      dcnbBienBanTinhKhoDtl: [],
      ngayBatDauXuat: '',
      keHoachDcDtlId: ''

    })
  }
  makePositive(num: number) {
    return Math.abs(num)
  }
  slChenhLech() {
    // if (this.formData.value.slThucTeCon > 0 && this.formData.value.slConLai > 0) {
    //   if (this.formData.value.slThucTeCon - this.formData.value.slConLai > 0) {
    //     this.formData.patchValue({
    //       slThua: Math.abs(this.formData.value.slThucTeCon - this.formData.value.slConLai),
    //       slThieu: null
    //     })
    //   } else {
    //     this.formData.patchValue({
    //       slThieu: Math.abs(this.formData.value.slThucTeCon - this.formData.value.slConLai),
    //       slThua: null
    //     })
    //   }
    // }
    this.formData.patchValue({
      chenhLechSlConLai: this.formData.value.slConLaiTheoTt - this.formData.value.slConLaiTheoSs
    })
  }

  async save(isGuiDuyet?) {
    let body = this.formData.value;
    body.ngayKetThucXuat = this.formData.value.ngayLap;
    body.fileBbTinhKhoDaKy = this.fileBbTinhKhoDaKy;
    body.loaiDc = this.loaiDc;
    body.isVatTu = this.isVatTu;
    body.thayDoiThuKho = this.thayDoiThuKho;
    body.type = this.type;
    body.loaiQding = this.loaiDc === "CUC" ? "XUAT" : undefined;
    // if (this.formData.value.tongSlXuatTheoQd > this.formData.value.tongSlXuatTheoTt) {
    //   return this.notification.error(MESSAGE.ERROR, "Số lượng xuất thực tế nhỏ hơn số lượng xuất theo quyết định")
    // }
    let data = await this.createUpdate(body, null, isGuiDuyet);
    if (data) {
      this.formData.patchValue({ id: data.id, trangThai: data.trangThai, soBbTinhKho: data.soBbTinhKho ? data.soBbTinhKho : this.genSoBienBanTinhKho(data.id) })
      if (isGuiDuyet) {
        this.pheDuyet();
      }
    }
  }

  pheDuyet() {
    let trangThai = '';
    let msg = '';
    let MSG = '';
    switch (this.formData.value.trangThai) {
      case STATUS.TU_CHOI_LDCC:
      case STATUS.TU_CHOI_KT:
      case STATUS.TU_CHOI_KTVBQ:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_KTVBQ;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        MSG = MESSAGE.GUI_DUYET_SUCCESS;
        break;
      }
      case STATUS.CHO_DUYET_KTVBQ: {
        trangThai = STATUS.CHO_DUYET_KT;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        MSG = MESSAGE.DUYET_SUCCESS
        break;
      }
      case STATUS.CHO_DUYET_KT: {
        trangThai = STATUS.CHO_DUYET_LDCC;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        MSG = MESSAGE.DUYET_SUCCESS;
        break;
      }
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.DA_DUYET_LDCC;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        MSG = MESSAGE.PHE_DUYET_SUCCESS
        break;
      }
    }
    this.approve(this.formData.value.id, trangThai, msg, null, MSG);
  }

  tuChoi() {
    let trangThai = '';
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.TU_CHOI_LDCC;
        break;
      }
      case STATUS.CHO_DUYET_KT: {
        trangThai = STATUS.TU_CHOI_KT;
        break;
      }
      case STATUS.CHO_DUYET_KTVBQ: {
        trangThai = STATUS.TU_CHOI_KTVBQ;
        break;
      }
    }
    this.reject(this.formData.value.id, trangThai)
  }

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai === STATUS.CHO_DUYET_LDCC || trangThai === STATUS.CHO_DUYET_KT || trangThai === STATUS.CHO_DUYET_KTVBQ) {
      return true
    }
    return false;
  }
  clearItemRow(id) {

    this.formData.patchValue({
      maSo: null,
      theoChungTu: null,
      thucXuat: null,
    })
  }

  calcTong() {
    if (this.dataTable) {
      const sum = this.dataTable.reduce((prev, cur) => {
        prev += cur.slXuat;
        return prev;
      }, 0);
      return sum;
    }
  }

  convertTien(tien: number): string {
    return convertTienTobangChu(tien);
  }
  //View Modal
  openPhieuKNCLModal(id: number) {
    this.isViewModalPhieuKNCL = true;
    this.idPhieuKNCL = id
  }
  openPhieuKXModal(id: number) {
    this.isViewModalPhieuXuatKho = true;
    this.idPhieuXuatKho = id;
  }
  openBKCHModal(id: number) {
    this.isViewModalBKCH = true;
    this.idBKCH = id
  }
  openBKXVTModal(id: number) {
    this.isViewModalBKXVT = true;
    this.idBKXVT = id
  }
  closeModal() {
    this.isViewModalPhieuKNCL = false;
    this.idPhieuKNCL = null;
    this.isViewModalPhieuXuatKho = false;
    this.idPhieuXuatKho = null;
    this.isViewModalBKCH = false;
    this.idBKCH = null;
    this.isViewModalBKXVT = false;
    this.idBKXVT = null
  }
  setValidate() {
    if (!this.thayDoiThuKho) {
      this.formData.controls["soPhieuKnChatLuong"].clearValidators();
      this.formData.controls["phieuKnChatLuongHdrId"].clearValidators();
    }
  }
  checkRoleDuyet(trangThai: STATUS): boolean {
    return (STATUS.CHO_DUYET_KTVBQ === trangThai && this.userService.isAccessPermisson(this.MA_QUYEN.DUYET_KTVBQ) || STATUS.CHO_DUYET_KT === trangThai && this.userService.isAccessPermisson(this.MA_QUYEN.DUYET_KT)
      || STATUS.CHO_DUYET_LDCC === trangThai && this.userService.isAccessPermisson(this.MA_QUYEN.DUYET_LDCCUC)) && this.userService.isChiCuc();
  }
}
