import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { convertTienTobangChu } from 'src/app/shared/commonFunction';
import { STATUS } from "../../../../../../constants/status";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { QuyetDinhNvXuatBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/quyet-dinh-nv-xuat-btt/quyet-dinh-nv-xuat-btt.service';
import { BienBanTinhKhoBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/xuat-kho-btt/bien-ban-tinh-kho-btt.service';
import { BienBanHaoDoiBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/xuat-kho-btt/bien-ban-hao-doi-btt.service';

@Component({
  selector: 'app-them-moi-bien-ban-hao-doi-btt',
  templateUrl: './them-moi-bien-ban-hao-doi-btt.component.html',
  styleUrls: ['./them-moi-bien-ban-hao-doi-btt.component.scss']
})
export class ThemMoiBienBanHaoDoiBttComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() loaiVthh: string;
  @Input() isView: boolean;
  @Input() idQdGiaoNvXh: number;

  @Output()
  showListEvent = new EventEmitter<any>();

  idPhieu: number = 0;
  isViewPhieu: boolean = false;

  idPhieuXuat: number = 0;
  isViewPhieuXuat: boolean = false;

  idBangKe: number = 0;
  isViewBangKe: boolean = false;

  listPhieuXuatKho: any[] = [];

  listTiLe: any = []
  dataTable: any[] = [];
  listDiaDiemNhap: any[] = [];

  listBbTinhKho: any[] = [];
  soQdNvXh: string;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bienBanTinhKhoBttService: BienBanTinhKhoBttService,
    private quyetDinhNvXuatBttService: QuyetDinhNvXuatBttService,
    private bienBanHaoDoiBttService: BienBanHaoDoiBttService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanHaoDoiBttService);
    this.formData = this.fb.group({
      id: [],
      namKh: [dayjs().get('year')],
      maDvi: [''],
      tenDvi: [''],
      maQhns: [''],
      soBbHaoDoi: [''],
      idQdNv: [],
      soQdNv: [''],
      ngayQdNv: [''],
      idHd: [],
      soHd: [''],
      ngayKyHd: [''],
      maDiemKho: [''],
      tenDiemKho: [''],
      maNhaKho: [''],
      tenNhaKho: [''],
      maNganKho: [''],
      tenNganKho: [''],
      maLoKho: [''],
      tenLoKho: [''],
      idBbTinhKho: [],
      soBbTinhKho: [''],
      tongSlNhap: [],
      ngayKthucNhap: [''],
      tongSlXuat: [],
      ngayBdauXuat: [''],
      ngayKthucXuat: [''],
      slHaoThucTe: [],
      tiLeHaoThucTe: [''],
      slHaoVuotMuc: [],
      tiLeHaoVuotMuc: [''],
      slHaoThanhLy: [],
      tiLeHaoThanhLy: [''],
      slHaoDuoiDinhMuc: [],
      tiLeHaoDuoiDinhMuc: [''],
      nguyenNhan: [''],
      kienNghi: [''],
      ghiChu: [''],
      idThuKho: [],
      tenThuKho: [''],
      idKtv: [],
      tenKtv: [''],
      idKeToan: [],
      tenKeToan: [''],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự Thảo'],
      ngayTao: [dayjs().format('YYYY-MM-DD')],
      lyDoTuChoi: [''],
      tenNguoiPduyet: [],
    })
  }

  async ngOnInit() {
    try {
      this.userInfo = this.userService.getUserLogin();
      if (this.id) {
        await this.loadChiTiet();
      } else {
        await this.initForm();
      }
      await Promise.all([
        this.loadSoBbTinhKho()
      ])
      await this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async initForm() {
    let id = await this.userService.getId('XH_BB_HDOI_BTT_HDR_SEQ')
    this.formData.patchValue({
      soBbHaoDoi: `${id}/${this.formData.get('namKh').value}-BBTK`,
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
      tenThuKho: this.userInfo.TEN_DAY_DU
    });
    if (this.idQdGiaoNvXh) {
      await this.bindingDataQd(this.idQdGiaoNvXh);
    }
  }

  async openDialogSoQdNvXh() {
    let dataQdNvXh = [];
    let body = {
      namKh: dayjs().get('year'),
      loaiVthh: this.loaiVthh,
      trangThai: this.STATUS.BAN_HANH,
      maChiCuc: this.userInfo.MA_DVI
    }
    let res = await this.quyetDinhNvXuatBttService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      dataQdNvXh = res.data?.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH SỐ QUYẾT ĐỊNH GIAO NHIỆM VỤ XUẤT HÀNG',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: dataQdNvXh,
        dataHeader: ['Số quyết định', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
        dataColumn: ['soQdNv', 'tenLoaiVthh', 'tenCloaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        await this.bindingDataQd(dataChose.id);
      }
    });
  };

  async bindingDataQd(id) {
    if (id > 0) {
      await this.spinner.show();
      let dataRes = await this.quyetDinhNvXuatBttService.getDetail(id)
      if (dataRes.msg == MESSAGE.SUCCESS) {
        const data = dataRes.data;
        this.formData.patchValue({
          idQdNv: data.id,
          soQdNv: data.soQdNv,
          ngayQdNv: data.ngayTao,
          idHd: data.idHd,
          soHd: data.soHd,
          ngayKyHd: data.ngayKyHd,
        });
        this.soQdNvXh = data.soQdNv
        let dataChiCuc = data.children.filter(item => item.maDvi == this.userInfo.MA_DVI);
        if (dataChiCuc) {
          dataChiCuc.forEach(e => {
            this.listDiaDiemNhap = [...this.listDiaDiemNhap, e.children];
          });
          this.listDiaDiemNhap = this.listDiaDiemNhap.flat();
        }
      } else {
        this.notification.error(MESSAGE.ERROR, dataRes.msg);
      }
      await this.spinner.hide();
    }
  }

  async loadSoBbTinhKho() {
    let body = {
      trangThai: STATUS.DA_DUYET_LDCC,
      loaiVthh: this.loaiVthh,
      maDviL: this.userInfo.MA_DVI,
      namKh: this.formData.value.namKh,
      soQdNv: this.soQdNvXh
    }
    let res = await this.bienBanTinhKhoBttService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listBbTinhKho = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  openDialogDdiemNhapHang() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách địa điểm nhập hàng',
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
        });
        this.listBbTinhKho = this.listBbTinhKho.filter(item => (item.maDiemKho == data.maDiemKho));
      }
    });
  }

  onSelectSoBbTinhKho(event: any): void {
    let bienBan = this.listBbTinhKho.find(f => f.soBbTinhKho == event);
    if (this.listBbTinhKho) {
      this.dataTable = bienBan.children
    }
    let tongSlXuat: number = 0;
    tongSlXuat = this.dataTable.reduce((prev, cur) => prev + cur.soLuongThucXuat, 0);
    this.formData.patchValue({
      idBbTinhKho: bienBan.id,
      soBbTinhKho: bienBan.soBbTinhKho,
      ngayKthucXuat: bienBan.ngayKthucXuat,
      ngayBdauXuat: bienBan.ngayBdauXuat,
      ngayKthucNhap: bienBan.ngayKthucXuat,
      tongSlNhap: bienBan.tongSlNhap,
      tongSlXuat: tongSlXuat,
      slHaoThucTe: bienBan.tongSlNhap - tongSlXuat,
    })
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

  async save(isGuiDuyet?: boolean) {
    if (this.dataTable.length == 0) {
      this.notification.error(
        MESSAGE.ERROR,
        'Hiện chưa có thông tin bảng kê cân hàng và phiếu nhập kho',
      );
      return;
    }
    let body = this.formData.value;
    body.fileDinhKems = this.fileDinhKem;
    body.children = this.dataTable;
    let data = await this.createUpdate(body);
    if (data) {
      if (isGuiDuyet) {
        this.id = data.id
        this.pheDuyet(true);
      } else {
        this.goBack();
      }
    }
  }

  async loadChiTiet() {
    let data = await this.detail(this.id);
    if (data) {
      this.dataTable = data.children
      this.fileDinhKem = data.fileDinhKems;
    }
  }

  convertTien(tien: number): string {
    return convertTienTobangChu(tien);
  }

  pheDuyet(isPheDuyet) {
    let trangThai = '';
    let msg = '';
    if (isPheDuyet) {
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
      this.approve(this.id, trangThai, msg)
    } else {
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
      this.reject(this.id, trangThai)
    }
  }


  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.CHO_DUYET_KTVBQ || trangThai == STATUS.CHO_DUYET_KT || trangThai == STATUS.CHO_DUYET_LDCC || trangThai == STATUS.DA_DUYET_LDCC) {
      return true;
    } else {
      return false;
    }
  }

  openModalPhieuKtCl(id: number) {
    this.idPhieu = id;
    this.isViewPhieu = true;
  }

  closeModalPhieuKtCl() {
    this.idPhieu = null;
    this.isViewPhieu = false;
  }

  openModalPhieuXuatKho(id: number) {
    this.idPhieuXuat = id;
    this.isViewPhieuXuat = true;
  }

  closeModalPhieuXuatKho() {
    this.idPhieuXuat = null;
    this.isViewPhieuXuat = false;
  }

  openModalBangKe(id: number) {
    this.idBangKe = id;
    this.isViewBangKe = true;
  }

  closeModalBangKe() {
    this.idBangKe = null;
    this.isViewBangKe = false;
  }
}
