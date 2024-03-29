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
import {
  DialogTableSelectionComponent
} from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { convertTienTobangChu } from 'src/app/shared/commonFunction';
import { PhieuXuatKhoService } from 'src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/PhieuXuatKho.service';
import { BienBanTinhKhoService } from 'src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/BienBanTinhKho.service';
import { Validators } from '@angular/forms';
import { PhieuKiemNghiemChatLuongService } from 'src/app/services/qlnv-hang/xuat-hang/chung/kiem-tra-chat-luong/PhieuKiemNghiemChatLuong.service';
import { QuyetDinhGiaoNvCuuTroService } from 'src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhGiaoNvCuuTro.service';
import { BienBanLayMauService } from 'src/app/services/qlnv-hang/xuat-hang/chung/xuat-kho/PhieuXuatKho.service';
import { AMOUNT_ONE_DECIMAL, AMOUNT_TWO_DECIMAL } from 'src/app/Utility/utils';

@Component({
  selector: 'app-them-moi-bien-ban-tinh-kho',
  templateUrl: './them-moi-bien-ban-tinh-kho.component.html',
  styleUrls: ['./them-moi-bien-ban-tinh-kho.component.scss']
})
export class ThemMoiBienBanTinhKhoComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() isViewOnModal: boolean;
  @Input() loaiXuat: string;
  @Output()
  showListEvent = new EventEmitter<any>();
  listSoQuyetDinh: any[] = []
  listDiaDiemNhap: any[] = [];
  listPhieuXuatKho: any[] = [];
  bbTinhKho: any[] = [];
  bbTinhKhoDtl: any[] = [];
  fileDinhKems: any[] = [];
  listDiemKho: any[] = [];
  maBb: string;
  checked: boolean = false;
  listFileDinhKem: any = [];
  tongSoLuongXk: number
  idPhieuKnCl: number = 0;
  openPhieuKnCl = false;
  idPhieuXk: number = 0;
  openPhieuXk = false;
  idBangKe: number = 0;
  openBangKe = false;
  templateName = "Biên bản tịnh kho";
  amount1Left = { ...AMOUNT_TWO_DECIMAL, align: "left" }
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private phieuXuatKhoService: PhieuXuatKhoService,
    private bienBanTinhKhoService: BienBanTinhKhoService,

    public phieuKiemNghiemChatLuongService: PhieuKiemNghiemChatLuongService,
    public quyetDinhGiaoNvCuuTroService: QuyetDinhGiaoNvCuuTroService,
    public bienBanLayMauService: BienBanLayMauService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanTinhKhoService);

    this.formData = this.fb.group(
      {
        id: [0],
        nam: [dayjs().get("year")],
        maDvi: [],
        maQhNs: [],
        soBbTinhKho: [],
        ngayTaoBb: [],
        idQdGiaoNvXh: [],
        soQdGiaoNvXh: ['', [Validators.required]],
        ngayQdGiaoNvXh: [],
        maDiemKho: ['', [Validators.required]],
        maNhaKho: [],
        maNganKho: [],
        maLoKho: [],
        loaiVthh: [],
        cloaiVthh: [],
        moTaHangHoa: [],
        ngayBatDauXuat: [],
        ngayKetThucXuat: [],
        tongSlNhap: [],
        tongSlXuat: [],
        slConLai: [],
        slThucTeCon: ['', [Validators.required]],
        slThua: [],
        slThieu: [],
        nguyenNhan: [],
        kienNghi: [],
        ghiChu: [],
        thuKho: [],
        ktvBaoQuan: [],
        keToan: [],
        ldChiCuc: [],
        trangThai: [STATUS.DU_THAO],
        type: [],
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
        tenNganLoKho: [],
        listPhieuXuatKho: [new Array()],
        fileDinhKems: [new Array<FileDinhKem>()],
        donViTinh: [],
        soPhieuKnCl: [],
        idPhieuKnCl: [],
        ngayKn: []
      }
    );
    this.maBb = '-BBTK';
    this.formData.controls['ngayTaoBb'].valueChanges.subscribe((value) => {
      this.formData.controls['ngayKetThucXuat'].setValue(value, { emitEvent: false })
    })
    // this.setTitle();
  }

  async ngOnInit() {
    try {
      this.spinner.show();

      await Promise.all([
        this.loadSoQuyetDinh()
      ])
      await this.loadDetail(this.idInput)
      this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }


  async loadDetail(idInput: number) {
    if (idInput > 0) {
      await this.bienBanTinhKhoService.getDetail(idInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const data = res.data;
            this.formData.patchValue({
              ...data,
              donViTinh: data.dviTinh,
              tenNganLoKho: data.tenLoKho ? `${data.tenLoKho} - ${data.tenNganKho}` : data.tenNganKho,
              soPhieuKnCl: data.soPhieuKnCl ? data.soPhieuKnCl : data.listPhieuXuatKho[0]?.soPhieuKnCl,
              idPhieuKnCl: data.idPhieuKnCl ? data.idPhieuKnCl : data.listPhieuXuatKho[0]?.idPhieuKnCl
            });
            this.fileDinhKems = data.fileDinhKems;
            this.dataTable = data.listPhieuXuatKho;
            this.tongSoLuongXk = this.dataTable.reduce((prev, cur) => prev + cur.slXuat, 0);
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      let id = await this.userService.getId('XH_CTVT_PHIEU_XUAT_KHO_SEQ')
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
        maQhNs: this.userInfo.DON_VI.maQhns,
        soBbTinhKho: `${id}/${this.formData.get('nam').value}/${this.maBb}`,
        ngayTaoBb: dayjs().format('YYYY-MM-DD'),
        ngayKetThucXuat: dayjs().format('YYYY-MM-DD'),
        thuKho: this.userInfo.TEN_DAY_DU,
        type: this.loaiXuat,
        tongSlNhap: "",
        // loaiVthh: this.loaiVthh
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
      // listTrangThaiXh: [STATUS.CHUA_THUC_HIEN, STATUS.DANG_THUC_HIEN],
      // listTrangThaiXh: [STATUS.DA_HOAN_THANH],
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0
      }
    }
    let res = await this.quyetDinhGiaoNvCuuTroService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      // this.listSoQuyetDinh = data.content;
      this.listSoQuyetDinh = data.content.filter(f => f.dataDtl.some(f => f.trangThai === STATUS.DA_HOAN_THANH));
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }
  async getDetailPhieuKnCl() {
    if (this.formData.value.idPhieuKnCl) {
      const res = await this.phieuKiemNghiemChatLuongService.getDetail(this.formData.value.idPhieuKnCl);
      if (res.msg == MESSAGE.SUCCESS) {
        const slHangBaoQuan = res.data.slHangBaoQuan ? res.data.slHangBaoQuan : '';
        // const slHangBaoQuan = Array.isArray(res.data.xhPhieuKnclDtl) && res.data.xhPhieuKnclDtl.find(f => f.type === 'SO_LUONG_HANG_BAO_QUAN') ? res.data.xhPhieuKnclDtl.find(f => f.type === 'SO_LUONG_HANG_BAO_QUAN').soLuong : '';
        this.formData.patchValue({ tongSlNhap: slHangBaoQuan });
      }
    }
  }
  async openDialogSoQd() {
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
        dataColumn: ['soBbQd', 'ngayKy', 'tenVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.bindingDataQd(data.id, true);
      }
    });
  };

  async bindingDataQd(id, isSetTc?) {
    await this.spinner.show();
    let dataRes = await this.quyetDinhGiaoNvCuuTroService.getDetail(id)
    const data = dataRes.data;
    this.formData.patchValue({
      soQdGiaoNvXh: data.soBbQd,
      idQdGiaoNvXh: data.id,
      ngayQdGiaoNvXh: data.ngayKy,
    });
    data.dataDtl.forEach(s => {
      s.maDiemKho = s.maDvi.length >= 10 ? s.maDvi.substring(0, 10) : null;
      s.maNhaKho = s.maDvi.length >= 12 ? s.maDvi.substring(0, 12) : null;
      s.maNganKho = s.maDvi.length >= 14 ? s.maDvi.substring(0, 14) : null;
      s.maLoKho = s.maDvi.length >= 16 ? s.maDvi.substring(0, 16) : null;
    });
    let dataChiCuc = data.dataDtl.filter(item => item.tenChiCuc == this.userInfo.TEN_DVI && item.trangThai === STATUS.DA_HOAN_THANH);
    if (dataChiCuc) {
      this.listDiaDiemNhap = dataChiCuc;
    }
    this.phieuXuatKho(data.soBbQd);
    await this.spinner.hide();
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
  async phieuXuatKho(soQd) {
    let body = {
      soQdGiaoNvXh: soQd,
    }
    let res = await this.bienBanTinhKhoService.search(body)
    if (res.msg == MESSAGE.SUCCESS) {
      this.bbTinhKho = res.data.content;
      let phieuXk = [
        ...this.listDiaDiemNhap.filter((e) => {
          return !this.bbTinhKho.some((bb) => {
            if (bb.maLoKho.length > 0 && e.maLoKho.length > 0) {
              return bb.maLoKho === e.maLoKho;
            } else {
              return bb.maNganKho === e.maNganKho;
            }
          })
        })
      ];
      this.listDiaDiemNhap = phieuXk;
    }
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
        // soPhieuKnCl: data.soPhieu,
        loaiVthh: data.loaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        moTaHangHoa: data.moTaHangHoa,
        donViTinh: data.donViTinh,
      })
      let body = {
        trangThai: STATUS.DA_DUYET_LDCC,
        type: this.loaiXuat,
        loaiVthh: this.loaiVthh
      }
      let res = await this.phieuXuatKhoService.search(body)
      const list = res.data.content;
      this.listPhieuXuatKho = list.filter(item => ((item.maLoKho === data.maLoKho && item.maNganKho === data.maNganKho) && item.soBangKeCh !== null));
      this.dataTable = this.listPhieuXuatKho;
      this.formData.patchValue({
        ngayBatDauXuat: this.dataTable[this.dataTable.length - 1]?.ngayXuatKho,
        soPhieuKnCl: this.listPhieuXuatKho[0]?.soPhieuKnCl,
        idPhieuKnCl: this.listPhieuXuatKho[0]?.idPhieuKnCl,
        ngayKn: this.listPhieuXuatKho[0]?.ngayKn
      })
      this.dataTable.forEach(s => {
        s.slXuat = s.thucXuat;
        s.soBkCanHang = s.soBangKeCh;
        s.idBkCanHang = s.idBangKeCh;
        s.idPhieuXuatKho = s.id;
      }
      )
      this.tongSoLuongXk = this.dataTable.reduce((prev, cur) => prev + cur.slXuat, 0);
      await this.getDetailPhieuKnCl()
    }
  }

  async save() {
    this.helperService.ignoreRequiredForm(this.formData);
    this.formData.controls['soBbTinhKho'].setValidators(Validators.required)
    let body = this.formData.value;
    body.fileDinhKems = this.fileDinhKems;
    body.listPhieuXuatKho = this.dataTable;
    this.listPhieuXuatKho.forEach(s => {
      s.id = null;
    })
    await this.createUpdate(body);
    this.helperService.restoreRequiredForm(this.formData)
  }
  async saveAndSend(data, status, warningMessage, successMessage) {
    if ((Array.isArray(this.listPhieuXuatKho) && this.listPhieuXuatKho.length > 0)) {
      this.listPhieuXuatKho.forEach(s => {
        s.id = null;
      })
      data.listPhieuXuatKho = cloneDeep(this.listPhieuXuatKho);
      super.saveAndSend(data, status, warningMessage, successMessage);
    } else {
      this.notification.warning(MESSAGE.WARNING, 'Phiếu xuất kho đang để trống');
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
        MSG = MESSAGE.GUI_DUYET_SUCCESS
        break;
      }
      case STATUS.CHO_DUYET_KTVBQ: {
        trangThai = STATUS.CHO_DUYET_KT;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        MSG = MESSAGE.GUI_DUYET_SUCCESS
        break;
      }
      case STATUS.CHO_DUYET_KT: {
        trangThai = STATUS.CHO_DUYET_LDCC;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        MSG = MESSAGE.GUI_DUYET_SUCCESS
        break;
      }
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.DA_DUYET_LDCC;
        msg = MESSAGE.PHE_DUYET_CONFIRM;
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
      this.formData.patchValue({
        tongSlXuat: sum,
        slConLai: this.formData.value.tongSlNhap - sum,
      })
      return sum ? sum : '';

    }
  }

  slChenhLech() {
    if (this.formData.value.slThucTeCon >= 0 && this.formData.value.slConLai >= 0) {
      if (this.formData.value.slThucTeCon - this.formData.value.slConLai > 0) {
        this.formData.patchValue({
          slThua: Math.abs(this.formData.value.slThucTeCon - this.formData.value.slConLai),
          slThieu: null
        })
      } else {
        this.formData.patchValue({
          slThieu: Math.abs(this.formData.value.slThucTeCon - this.formData.value.slConLai),
          slThua: null
        })
      }
    }
  }

  convertTien(tien: number): string {
    return convertTienTobangChu(tien);
  }


  openPhieuKnClModal(id: number) {
    this.idPhieuKnCl = id;
    this.openPhieuKnCl = true;
  }

  closePhieuKnClModal() {
    this.idPhieuKnCl = null;
    this.openPhieuKnCl = false;
  }

  openPhieuXkModal(id: number) {
    this.idPhieuXk = id;
    this.openPhieuXk = true;
  }

  closePhieuXkModal() {
    this.idPhieuXk = null;
    this.openPhieuXk = false;
  }

  openBangKeModal(id: number) {
    this.idBangKe = id;
    this.openBangKe = true;
  }

  closeBangKeModal() {
    this.idBangKe = null;
    this.openBangKe = false;
  }

  // loadDsNganLoChuaTaoBbTinhKhoTheoQd(){
  //   const {maLoKho, maNganKho}=this.formData.value;

  // }
  checkRolePreview() {
    return this.userService.isAccessPermisson('XHDTQG_XCTVTXC_CTVT_XK_LT_BBHD_IN')
  }
}
