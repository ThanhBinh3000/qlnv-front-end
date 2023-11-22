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
import {
  QuyetDinhGiaoNvCuuTroService
} from 'src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhGiaoNvCuuTro.service';
import { convertTienTobangChu } from 'src/app/shared/commonFunction';
import { BienBanTinhKhoService } from 'src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/BienBanTinhKho.service';
import { BienBanHaoDoiService } from 'src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/BienBanHaoDoi.service';
import { Validators } from '@angular/forms';
import { PhieuKiemNghiemChatLuongService } from 'src/app/services/qlnv-hang/xuat-hang/chung/kiem-tra-chat-luong/PhieuKiemNghiemChatLuong.service';
import { BienBanLayMauService } from 'src/app/services/qlnv-hang/xuat-hang/chung/xuat-kho/PhieuXuatKho.service';
import { MangLuoiKhoService } from 'src/app/services/qlnv-kho/mangLuoiKho.service';

@Component({
  selector: 'app-them-moi-bien-ban-hao-doi',
  templateUrl: './them-moi-bien-ban-hao-doi.component.html',
  styleUrls: ['./them-moi-bien-ban-hao-doi.component.scss']
})
export class ThemMoiBienBanHaoDoiComponent extends Base2Component implements OnInit {
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
  listBbTinhKho: any[] = [];
  fileDinhKems: any[] = [];
  listDiemKho: any[] = [];
  maBb: string;
  checked: boolean = false;
  listFileDinhKem: any = [];
  listTiLe: any = [];
  tongSoLuongXk: number
  idPhieuKnCl: number = 0;
  openPhieuKnCl = false;
  idPhieuXk: number = 0;
  openPhieuXk = false;
  idBangKe: number = 0;
  openBangKe = false;
  templateName = "Biên bản hao dôi";
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    // private quyetDinhGiaoNvCuuTroService: QuyetDinhGiaoNvCuuTroService,
    private bienBanHaoDoiService: BienBanHaoDoiService,
    private bienBanTinhKhoService: BienBanTinhKhoService,
    private mangLuoiKhoService: MangLuoiKhoService,
    public phieuKiemNghiemChatLuongService: PhieuKiemNghiemChatLuongService,
    public quyetDinhGiaoNvCuuTroService: QuyetDinhGiaoNvCuuTroService,
    public bienBanLayMauService: BienBanLayMauService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanHaoDoiService);

    this.formData = this.fb.group(
      {
        id: [0],
        nam: [dayjs().get("year")],
        maDvi: [],
        maQhNs: [],
        soBbHaoDoi: [],
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
        idBbTinhKho: [],
        soBbTinhKho: ['', [Validators.required]],
        ngayBatDauXuat: [],
        ngayKetThucXuat: [],
        tongSlNhap: [],
        ngayKtNhap: [],
        tongSlXuat: [],
        slHaoThucTe: [],
        tiLeHaoThucTe: [],
        slHaoThanhLy: [],
        tiLeHaoThanhLy: [],
        slHaoVuotDm: [],
        tiLeHaoVuotDm: [],
        slHaoDuoiDm: [],
        tiLeHaoDuoiDm: [],
        dinhMucHaoHut: [],
        sLHaoHutTheoDm: [],
        nguyenNhan: [],
        kienNghi: [],
        ghiChu: [],
        thuKho: [],
        ktvBaoQuan: [],
        keToan: [],
        ldChiCuc: [],
        trangThai: [STATUS.DU_THAO],
        lyDoTuChoi: [],
        type: [],
        diaChiDvi: [],
        tenDvi: [],
        tenCloaiVthh: [],
        tenLoaiVthh: [],
        tenTrangThai: ['Dự Thảo'],
        tenNhaKho: ['', [Validators.required]],
        tenDiemKho: ['', [Validators.required]],
        tenLoKho: [],
        tenNganKho: ['', [Validators.required]],
        tenNganLoKho: [],
        listPhieuXuatKho: [new Array()],
        fileDinhKems: [new Array<FileDinhKem>()],
        donViTinh: [],
        ngayKetThucNhap: [],
        soPhieuKnCl: [],
        idPhieuKnCl: [],
        soThangBqHang: [],
      }
    );
    this.maBb = '-BBHD';
    // this.setTitle();
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      await Promise.all([
        this.loadSoQuyetDinh(),
        this.loadSoBbTinhKho()
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


  async loadDetail(idInput: number) {
    if (idInput > 0) {
      try {
        const res = await this.bienBanHaoDoiService.getDetail(idInput);
        if (res.msg == MESSAGE.SUCCESS) {
          this.formData.patchValue({ ...res.data, tenNganLoKho: res.data.tenLoKho ? `${res.data.tenLoKho} - ${res.data.tenNganKho}` : res.data.tenNganKho });
          const data = res.data;
          this.fileDinhKems = data.fileDinhKems;
          this.dataTable = data.listPhieuXuatKho;
        }
      } catch (e) {
        console.log('error: ', e);
        await this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    } else {
      let id = await this.userService.getId('XH_CTVT_BB_HAO_DOI_HDR_SEQ')
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
        maQhNs: this.userInfo.DON_VI.maQhns,
        soBbHaoDoi: `${id}/${this.formData.get('nam').value}${this.maBb}`,
        ngayTaoBb: dayjs().format('YYYY-MM-DD'),
        thuKho: this.userInfo.TEN_DAY_DU,
        type: this.loaiXuat,
        // loaiVThh:this.loaiVthh

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

  async loadSoBbTinhKho() {
    let body = {
      trangThai: STATUS.DA_DUYET_LDCC,
      type: this.loaiXuat,
      loaiVthh: this.loaiVthh,
    }
    let res = await this.bienBanTinhKhoService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listBbTinhKho = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
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
        this.resetField()
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
    this.listBbTinhKho = this.listBbTinhKho.filter(f => f.soQdGiaoNvXh === this.formData.value.soQdGiaoNvXh);
    // let dataChiCuc = data.dataDtl.filter(item => item.tenChiCuc == this.userInfo.TEN_DVI && item.trangThai === STATUS.DA_HOAN_THANH);
    // if (dataChiCuc) {
    //   this.listDiaDiemNhap = dataChiCuc;
    // }
    await this.spinner.hide();
  }

  resetField() {
    this.formData.patchValue({
      ngayKetThucXuat: '',
      ngayBatDauXuat: '',
      tongSlXuat: '',
      sLHaoHutTheoDm: '',

      maDiemKho: '',
      tenDiemKho: '',
      maNhaKho: '',
      tenNhaKho: '',
      maNganKho: '',
      tenNganKho: '',
      maLoKho: '',
      tenLoKho: '',
      idPhieuKnCl: '',
      soPhieuKnCl: '',
      loaiVthh: '',
      cloaiVthh: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      moTaHangHoa: '',
      tenNganLoKho: '',
      donViTinh: ''
    })
  }
  // openDialogDdiemNhapHang() {
  //   const modalQD = this.modal.create({
  //     nzTitle: 'Danh sách địa điểm xuất hàng',
  //     nzContent: DialogTableSelectionComponent,
  //     nzMaskClosable: false,
  //     nzClosable: false,
  //     nzWidth: '900px',
  //     nzFooter: null,
  //     nzComponentParams: {
  //       dataTable: this.listDiaDiemNhap,
  //       dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho'],
  //       dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho']
  //     },
  //   });
  //   modalQD.afterClose.subscribe(async (data) => {
  //     this.bindingDataDdNhap(data);
  //   });
  // }

  // async bindingDataDdNhap(data) {
  //   if (data) {
  //     this.formData.patchValue({
  // maDiemKho: data.maDiemKho,
  // tenDiemKho: data.tenDiemKho,
  // maNhaKho: data.maNhaKho,
  // tenNhaKho: data.tenNhaKho,
  // maNganKho: data.maNganKho,
  // tenNganKho: data.tenNganKho,
  // maLoKho: data.maLoKho,
  // tenLoKho: data.tenLoKho,
  // soPhieuKnCl: data.soPhieu,
  // loaiVthh: data.loaiVthh,
  // cloaiVthh: data.cloaiVthh,
  // tenLoaiVthh: data.tenLoaiVthh,
  // tenCloaiVthh: data.tenCloaiVthh,
  // moTaHangHoa: data.moTaHangHoa,
  // tenNganLoKho: data.tenLoKho ? `${data.tenLoKho} - ${data.tenNganKho}` : data.tenNganKho
  //     })
  //     this.listBbTinhKho = this.listBbTinhKho.filter(item => (item.maLoKho == data.maLoKho && item.maNganKho === data.maNganKho));
  //   }
  // }
  async onSelectSoBbTinhKho(event: any): Promise<void> {
    console.log(event, "event")
    if (!event) return;
    let idBbTinhKho = this.listBbTinhKho.find(f => f.soBbTinhKho == event)?.id;
    if (!idBbTinhKho) return;
    const res = await this.bienBanTinhKhoService.getDetail(idBbTinhKho);
    if (res.msg !== MESSAGE.SUCCESS) return;
    const bienBan = res.data;
    let ngayKetThucNhap = "";
    if (bienBan.maLoKho || bienBan.maNganKho) {
      const res = await this.mangLuoiKhoService.getDetailByMa({ maDvi: bienBan.maLoKho || bienBan.maNganKho });
      if (res.data?.object?.ngayNhapDay) {
        ngayKetThucNhap = res.data?.object?.ngayNhapDay;
      }
    };
    const soThangBqHang = bienBan.ngayBatDauXuat && ngayKetThucNhap ? dayjs(dayjs(bienBan.ngayBatDauXuat, "DD/MM/YYYY").format("YYYY-MM-DD")).diff(dayjs(ngayKetThucNhap, "DD/MM/YYYY").format("YYYY-MM-DD"), 'month', true).toFixed(1) : "";
    console.log("soThangBqHang", soThangBqHang)
    //TODO: call api danh muc dinh muc hao hut
    if (this.listBbTinhKho) {
      this.dataTable = bienBan.listPhieuXuatKho
    }
    // this.tongSoLuongXk = this.dataTable.reduce((prev, cur) => prev + cur.slXuat, 0);
    const sLHaoHutTheoDm = bienBan.tongSlNhap * this.formData.value.dinhMucHaoHut / 100;
    const slHaoThucTe = bienBan.slConLai - bienBan.slThucTeCon;
    const tiLeHaoThucTe = bienBan.tongSlXuat ? slHaoThucTe * 100 / bienBan.tongSlXuat : '';
    const slHaoThanhLy = sLHaoHutTheoDm;
    const tiLeHaoThanhLy = bienBan.tongSlXuat ? slHaoThanhLy * 100 / bienBan.tongSlXuat : '';
    const slHaoVuotDm = slHaoThucTe - sLHaoHutTheoDm > 0 ? slHaoThucTe - sLHaoHutTheoDm : '';
    const tiLeHaoVuotDm = bienBan.tongSlXuat && slHaoVuotDm ? slHaoVuotDm * 100 / bienBan.tongSlXuat : '';
    const slHaoDuoiDm = sLHaoHutTheoDm - slHaoThucTe > 0 ? sLHaoHutTheoDm - slHaoThucTe : '';
    const tiLeHaoDuoiDm = bienBan.tongSlXuat && slHaoDuoiDm ? slHaoDuoiDm * 100 / bienBan.tongSlXuat : '';
    this.formData.patchValue({
      // ngayKetThucXuat: this.dataTable[0].ngayXuatKho,
      // ngayBatDauXuat: this.dataTable[this.dataTable.length - 1].ngayXuatKho,
      ngayBatDauXuat: bienBan.ngayBatDauXuat,
      ngayKetThucXuat: bienBan.ngayKetThucXuat,
      ngayKetThucNhap,
      soThangBqHang,
      tongSlNhap: bienBan.tongSlNhap,
      tongSlXuat: bienBan.tongSlXuat,
      // tongSlXuat: this.tongSoLuongXk,
      sLHaoHutTheoDm,
      //Thanh lý
      slHaoThanhLy,
      tiLeHaoThanhLy,
      //Thực tế
      slHaoThucTe,
      tiLeHaoThucTe,
      //Vượt định mức
      slHaoVuotDm,
      tiLeHaoVuotDm,
      //Dưới định mức
      slHaoDuoiDm,
      tiLeHaoDuoiDm,

      maDiemKho: bienBan.maDiemKho,
      tenDiemKho: bienBan.tenDiemKho,
      maNhaKho: bienBan.maNhaKho,
      tenNhaKho: bienBan.tenNhaKho,
      maNganKho: bienBan.maNganKho,
      tenNganKho: bienBan.tenNganKho,
      maLoKho: bienBan.maLoKho,
      tenLoKho: bienBan.tenLoKho,
      // soPhieuKnCl: bienBan.soPhieuKnCl,
      // idPhieuKnCl: bienBan.idPhieuKnCl,
      soPhieuKnCl: bienBan.listPhieuXuatKho[0]?.soPhieuKnCl,
      idPhieuKnCl: bienBan.listPhieuXuatKho[0]?.idPhieuKnCl,
      loaiVthh: bienBan.loaiVthh,
      cloaiVthh: bienBan.cloaiVthh,
      tenLoaiVthh: bienBan.tenLoaiVthh,
      tenCloaiVthh: bienBan.tenCloaiVthh,
      moTaHangHoa: bienBan.moTaHangHoa,
      tenNganLoKho: bienBan.tenLoKho ? `${bienBan.tenLoKho} - ${bienBan.tenNganKho}` : bienBan.tenNganKho,
      donViTinh: bienBan.donViTinh,
    })
  }


  async save() {
    this.helperService.ignoreRequiredForm(this.formData);
    this.formData.controls['soBbHaoDoi'].setValidators(Validators.required);
    let body = this.formData.value;
    body.fileDinhKems = this.fileDinhKems;
    body.listPhieuXuatKho = this.dataTable;
    await this.createUpdate(body);
    this.helperService.restoreRequiredForm(this.formData)
  }

  pheDuyet() {
    let trangThai = '';
    let msg = '';
    let MSG = '';
    switch (this.formData.value.trangThai) {
      case STATUS.TU_CHOI_LDCC:
      case STATUS.TU_CHOI_KTVBQ:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_KTVBQ;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        MSG = MESSAGE.GUI_DUYET_SUCCESS;
        break;
      }
      case STATUS.CHO_DUYET_KTVBQ: {
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

  convertTien(tien: number): string {
    return convertTienTobangChu(tien);
  }

  openPhieuKnClModal(id: number) {
    console.log(id, "id")
    this.idPhieuKnCl = id;
    this.openPhieuKnCl = true;
  }

  closePhieuKnClModal() {
    this.idPhieuKnCl = null;
    this.openPhieuKnCl = false;
  }

  openPhieuXkModal(id: number) {
    console.log(id, "id")
    this.idPhieuXk = id;
    this.openPhieuXk = true;
  }

  closePhieuXkModal() {
    this.idPhieuXk = null;
    this.openPhieuXk = false;
  }

  openBangKeModal(id: number) {
    console.log(id, "id")
    this.idBangKe = id;
    this.openBangKe = true;
  }

  closeBangKeModal() {
    this.idBangKe = null;
    this.openBangKe = false;
  }
  checkRolePreview() {
    return this.userService.isAccessPermisson('XHDTQG_XCTVTXC_CTVT_XK_LT_BBHD_IN')
  }
}
