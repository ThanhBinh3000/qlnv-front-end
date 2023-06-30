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
import { PassDataBienBanTinhKho } from '../bien-ban-tinh-kho.component';

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
  @Output()
  showListEvent = new EventEmitter<any>();
  listSoQuyetDinh: any[] = []
  listDiaDiemNhap: any[] = [];
  listPhieuXuatKho: any[] = [];
  fileDinhKems: any[] = [];
  listDiemKho: any[] = [];
  maBb: string;
  checked: boolean = false;
  listFileDinhKem: any = [];
  tongSlXuat: number;
  //View modal ifor
  isViewModalPhieuKNCL: boolean;
  idPhieuKNCL: number;
  isViewModalPhieuXuatKho: boolean;
  idPhieuXuatKho: number;
  isViewModalBKCH: boolean;
  idBKCH: number;

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
        nam: [dayjs().get("year")],
        maDvi: [],
        maQhNs: [],
        soBbTinhKho: [],
        ngayTaoBb: [],
        qdinhDccId: [],
        soQdinhDcc: ['', [Validators.required]],
        ngayKyQdDcc: [],
        maDiemKho: ['', [Validators.required]],
        maNhaKho: [],
        maNganKho: [],
        maLoKho: [],
        loaiVthh: [],
        cloaiVthh: [],
        moTaHangHoa: [],
        ngayBatDauXuat: [],
        ngayKetThucXuat: [],
        tonKhoBanDau: [],
        tongSlXuatTheoQd: [],
        tongSlXuatTheoTt: [],
        slConLaiTheoSs: [],
        slConLaiTheoTt: [],
        chenhLechSlConLai: [],
        slThua: [],
        slThieu: [],
        nguyenNhan: ['', [Validators.required]],
        kienNghi: ['', [Validators.required]],
        ghiChu: ['', [Validators.required]],
        thuKho: [],
        ktvBaoQuan: [],
        keToan: [],
        ldChiCuc: [],
        trangThai: [STATUS.DU_THAO],
        lyDoTuChoi: [],
        diaChiDvi: [],
        tenDvi: [],
        tenCloaiVthh: [],
        tenLoaiVthh: [],
        tenTrangThai: ['Dự Thảo'],
        tenNhaKho: [],
        tenDiemKho: [],
        tenLoKho: [],
        tenNganKho: [],
        listPhieuXuatKho: [new Array()],
        fileDinhKems: [new Array<FileDinhKem>()],
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
          if (res.msg == MESSAGE.SUCCESS) {
            this.formData.patchValue(res.data);
            this.formData.patchValue({ soBbTinhKho: res.data.soBbTinhKho ? res.data.soBbTinhKho : this.genSoBienBanTinhKho(res.data.id) });
            const data = res.data;
            this.fileDinhKems = data.fileDinhKems;
            this.dataTable = data.listPhieuXuatKho;
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
        maQhNs: this.userInfo.DON_VI.maQhns,
        // soBbTinhKho: `${id}/${this.formData.get('nam').value}/${this.maBb}`,
        ngayTaoBb: dayjs().format('YYYY-MM-DD'),
        ngayKetThucXuat: dayjs().format('YYYY-MM-DD'),
        thuKho: this.userInfo.TEN_DAY_DU,
        ...this.passData
      });
      if (this.passData.qdinhDccId) {
        await this.bindingDataQd(this.passData.qdinhDccId, true);
        console.log("listDiDiam", this.listDiaDiemNhap)
        // this.bindingDataDdNhap(this.passData)
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
        loaiDc: this.loaiDc, isVatTu: this.isVatTu, thayDoiThuKho: this.thayDoiThuKho,
        trangThai: STATUS.BAN_HANH,
      }
      let res = await this.quyetDinhDieuChuyenCucService.getDsSoQuyetDinhDieuChuyenChiCuc(body);
      if (res.msg == MESSAGE.SUCCESS) {
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
        dataHeader: ['Số quyết định', 'Ngày quyết định', 'Loại hàng hóa'],
        dataColumn: ['soQdinh', 'ngayKyQdinh', 'tenLoaiVthh'],
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
        ngayKyQdDcc: data.ngayKyQdinh,
        // soHdong: data.soHd,
        // idHdong: data.idHd,
        // ngayKyHd: data.ngayKyHd,

      });
      if (dataRes.msg == MESSAGE.SUCCESS) {
        const data = dataRes.data;
        this.formData.patchValue({
          qddcId: data.id,
          soQddc: data.soQdinh,
          ngayKyQddc: data.ngayKyQdinh,
        });
        this.listDiaDiemNhap = [];
        let dataChiCuc = [];

        if (data.maDvi == this.userInfo.MA_DVI && Array.isArray(data?.danhSachQuyetDinh)) {
          data.danhSachQuyetDinh.forEach(element => {
            if (Array.isArray(element.danhSachKeHoach)) {
              element.danhSachKeHoach.forEach(item => {
                if (dataChiCuc.findIndex(f => ((!f.maLoKho && !item.maLoKho && item.maNganKho && f.maNganKho == item.maNganKho) || (f.maLoKho && f.maLoKho == item.maLoKho))) < 0) {
                  dataChiCuc.push(item)
                }
              });
            }
          });
        }
        this.listDiaDiemNhap = cloneDeep(dataChiCuc);
      }
    } catch (error) {
      console.log("e", error);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR)
    } finally {
      await this.spinner.hide();
    }
  }



  openDialogDdiemNhapHang() {
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
      console.log(data, 123321);
      this.formData.patchValue({
        maDiemKho: data.maDiemKho,
        tenDiemKho: data.tenDiemKho,
        maNhaKho: data.maNhaKho,
        tenNhaKho: data.tenNhaKho,
        maNganKho: data.maNganKho,
        tenNganKho: data.tenNganKho,
        maLoKho: data.maLoKho,
        tenLoKho: data.tenLoKho,

        loaiVthh: data.loaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        moTaHangHoa: data.moTaHangHoa,

        tongSlXuatTheoQd: data.soLuongDc || 0,
        tonKhoBanDau: data.tonKho || 0,
        slConLaiTheoSs: data.tonKho - data.soLuongDc

      })
      let body = {
        loaiDc: this.loaiDc,
        isVatTu: this.isVatTu,
        thayDoiThuKho: this.thayDoiThuKho,
        type: this.type,
        trangThai: STATUS.DA_DUYET_LDCC,
      }
      let res = await this.phieuXuatKhoDieuChuyenService.getThongTinChungPhieuXuatKho(body)
      const list = res.data;
      this.dataTable = [];
      this.listPhieuXuatKho = list.filter(item => ((this.formData.value.maLoKho && this.formData.value.maLoKho == item.maloKho) ||
        (!this.formData.value.maLoKho && this.formData.value.maNganKho && this.formData.value.maNganKho == item.maNganKho)));
      this.dataTable = this.listPhieuXuatKho.map(f => ({
        bangKeCanHangHdrId: f.bkcanHangId,
        hdrId: null,
        id: null,
        ngayXuatKho: f.ngayXuatKho,
        phieuKtChatLuongHdrId: f.phieuKiemNghiemId,
        phieuXuatKhoHdrId: f.id,
        soPhieuKtChatLuong: f.soPhieuKiemNghiemCl,
        soPhieuXuatKho: f.soPhieuXuatKho,
        soBangKeCanHang: f.soBKCanHang,
        soLuongXuat: f.soLuong
      }));
      this.tongSlXuat = this.dataTable.reduce((sum, cur) => sum += cur.soLuongXuat, 0)

      console.log("dataTable", this.dataTable)
      if (this.dataTable && this.dataTable.length > 0) {
        // const lastItem = this.dataTable[this.dataTable.length - 1];
        const maxDate = new Date(Math.min.apply(null, this.dataTable.map(function (e) {
          return new Date(e.ngayXuatKho);
        })));
        const minDateString = maxDate.toISOString().slice(0, 10);
        this.formData.patchValue({
          ngayBatDauXuat: minDateString
          // ngayBatDauXuat: lastItem.ngayXuatKho,
          // soPhieuKnCl: lastItem.soPhieu,
        })
      }
    }
  }
  makePositive(num: number) {
    return Math.abs(num)
  }
  slChenhLech() {
    if (this.formData.value.slThucTeCon > 0 && this.formData.value.slConLai > 0) {
      // if (this.formData.value.slThucTeCon - this.formData.value.slConLai > 0) {
      //   this.formData.patchValue({
      //     slThua: Math.abs(this.formData.value.slThucTeCon - this.formData.value.slConLai),
      //     slThieu: null
      //   })
      // } else {
      //   this.formData.patchValue({
      //     slThieu: Math.abs(this.formData.value.slThucTeCon - this.formData.value.slConLai),
      //     slThua: null
      //   })
      // }
      this.formData.patchValue({
        chenhLechSlConLai: this.formData.value.slConLaiTheoSs - this.formData.value.slConLaiTheoTt
      })
    }
  }

  async save(isGuiDuyet?) {
    let body = this.formData.value;
    body.fileDinhKems = this.fileDinhKems;
    body.listPhieuXuatKho = this.dataTable;
    let data = await this.createUpdate(body);
    if (data) {
      this.formData.patchValue({ soBbTinhKho: data.soBbTinhKho ? data.soBbTinhKho : this.genSoBienBanTinhKho(data.id) })
      if (isGuiDuyet) {
        this.pheDuyet();
      } else {
        this.goBack()
      }
    }
  }

  pheDuyet() {
    let trangThai = '';
    let msg = '';
    switch (this.formData.value.trangThai) {
      case STATUS.TU_CHOI_LDCC:
      case STATUS.TU_CHOI_KT:
      case STATUS.TU_CHOI_KTVBQ:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_KTVBQ;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
      case STATUS.CHO_DUYET_KTVBQ: {
        trangThai = STATUS.CHO_DUYET_KT;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
      case STATUS.CHO_DUYET_KT: {
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
      case STATUS.CHO_DUYET_KT: {
        trangThai = STATUS.TU_CHOI_KT;
        break;
      }
      case STATUS.CHO_DUYET_KTVBQ: {
        trangThai = STATUS.TU_CHOI_KTVBQ;
        break;
      }
    }
    this.reject(this.idInput, trangThai)
  }

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.CHO_DUYET_LDCC || trangThai == STATUS.CHO_DUYET_KT || trangThai == STATUS.CHO_DUYET_KTVBQ) {
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
  closeModal() {
    this.isViewModalPhieuKNCL = false;
    this.idPhieuKNCL = null;
    this.isViewModalPhieuXuatKho = false;
    this.idPhieuXuatKho = null;
    this.isViewModalBKCH = false;
    this.idBKCH = null;
  }
}
