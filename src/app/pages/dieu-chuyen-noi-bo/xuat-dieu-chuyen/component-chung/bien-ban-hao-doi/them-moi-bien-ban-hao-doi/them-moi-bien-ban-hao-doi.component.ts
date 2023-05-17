import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import { Validators } from '@angular/forms';
import {
  QuyetDinhGiaoNvXuatHangService
} from "src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/quyetdinh-nhiemvu-xuathang/quyet-dinh-giao-nv-xuat-hang.service";
import {
  BienBanHaoDoiService
} from "src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/xuat-kho/BienBanHaoDoi.service";
import {
  BienBanTinhKhoService
} from "src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/xuat-kho/BienBanTinhKho.service";


@Component({
  selector: 'app-xuat-dcnb-them-moi-bien-ban-hao-doi',
  templateUrl: './them-moi-bien-ban-hao-doi.component.html',
  styleUrls: ['./them-moi-bien-ban-hao-doi.component.scss']
})
export class ThemMoiBienBanHaoDoiDieuChuyenComponent extends Base2Component implements OnInit {
  @Input() loaiVthhInput: string;
  @Input() idInput: number;
  @Input() isView: boolean;
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
  listTiLe: any = []

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private quyetDinhGiaoNvXuatHangService: QuyetDinhGiaoNvXuatHangService,
    private bienBanHaoDoiService: BienBanHaoDoiService,
    private bienBanTinhKhoService: BienBanTinhKhoService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanHaoDoiService);

    this.formData = this.fb.group(
      {
        id: [],
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
        ngayKtXuat: [],
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
        nguyenNhan: ['', [Validators.required]],
        kienNghi: ['', [Validators.required]],
        ghiChu: ['', [Validators.required]],
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
        tenNhaKho: [],
        tenDiemKho: [],
        tenLoKho: [],
        tenNganKho: [],
        listPhieuXuatKho: [new Array()],
        fileDinhKems: [new Array<FileDinhKem>()],
        soHdong: [],
        ngayKyHd: []
      }
    );
    this.maBb = '-BBHD';
    // this.setTitle();
  }

  async ngOnInit() {
    try {
      this.spinner.show();
      await Promise.all([
        this.loadSoQuyetDinh(),
        this.loadSoBbTinhKho()
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
      try {
        const res = await this.bienBanHaoDoiService.getDetail(idInput);
        if (res.msg == MESSAGE.SUCCESS) {
          this.formData.patchValue(res.data);
          const data = res.data;
          this.fileDinhKems = data.fileDinhKems;
          this.dataTable = data.listPhieuXuatKho;
        }
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    } else {
      let id = await this.userService.getId('XH_CTVT_BB_HAO_DOI_HDR_SEQ')
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
        maQhNs: this.userInfo.DON_VI.maQhns,
        soBbHaoDoi: `${id}/${this.formData.get('nam').value}/${this.maBb}`,
        ngayTaoBb: dayjs().format('YYYY-MM-DD'),
        thuKho: this.userInfo.TEN_DAY_DU,
        type: "XUAT_CAP",

      });
    }

  }

  quayLai() {
    this.showListEvent.emit();
  }

  async loadSoQuyetDinh() {
    let body = {
      trangThai: STATUS.BAN_HANH,
    }
    let res = await this.quyetDinhGiaoNvXuatHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }


  async loadSoBbTinhKho() {
    let body = {
      trangThai: STATUS.DA_DUYET_LDCC,
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
        dataColumn: ['soQd', 'ngayKy', 'tenLoaiVthh'],
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
    let dataRes = await this.quyetDinhGiaoNvXuatHangService.getDetail(id)
    const data = dataRes.data;
    this.formData.patchValue({
      soQdGiaoNvXh: data.soQd,
      idQdGiaoNvXh: data.id,
      ngayQdGiaoNvXh: data.ngayKy,
      soHd: data.soHd,
      ngayKyHd: data.ngayKyHd,

    });
    console.log(data)
    /*let dataChiCuc = data.noiDungCuuTro.filter(item => item.maDviChiCuc == this.userInfo.MA_DVI);
    if (dataChiCuc) {
      this.listDiaDiemNhap = dataChiCuc
    }*/
    let dataChiCuc = data.children.filter(item => item.maDvi == this.userInfo.MA_DVI);
    if (dataChiCuc) {
      dataChiCuc.forEach(e => {
        this.listDiaDiemNhap = [...this.listDiaDiemNhap, e.children]
      });
    }
    this.listDiaDiemNhap = this.listDiaDiemNhap.flat();
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
        soPhieuKnCl: data.soPhieu,
        loaiVthh: data.loaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        moTaHangHoa: data.moTaHangHoa,
      })
      this.listBbTinhKho = this.listBbTinhKho.filter(item => (item.maDiemKho == data.maDiemKho));
    }
  }

  onSelectSoBbTinhKho(selectedValue: any): void {
    this.listBbTinhKho.forEach(f => {
      this.dataTable = f.listPhieuXuatKho;
      this.formData.patchValue({
        ngayBatDauXuat: f.ngayKetThucXuat,
        ngayKetThucXuat: f.ngayKetThucXuat
      })
    });
  }


  async save(isGuiDuyet?) {
    let body = this.formData.value;
    body.fileDinhKems = this.fileDinhKems;
    body.listPhieuXuatKho = this.dataTable;
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
      // case STATUS.CHO_DUYET_KT: {
      //   trangThai = STATUS.CHO_DUYET_KT;
      //   msg = MESSAGE.GUI_DUYET_CONFIRM;
      //   break;
      // }
      case STATUS.CHO_DUYET_KTVBQ: {
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

  flattenTree(tree) {
    return tree.flatMap((item) => {
      return item.childData ? this.flattenTree(item.childData) : item;
    });
  }
}
