import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DonviService} from "../../../../../services/donvi.service";
import {DanhMucService} from "../../../../../services/danhmuc.service";
import {chain, isEmpty} from "lodash";
import {MESSAGE} from "../../../../../constants/message";
import {CHUC_NANG} from "../../../../../constants/status";
import {v4 as uuidv4} from "uuid";
import {LOAI_HH_XUAT_KHAC} from "../../../../../constants/config";
import {
  DanhSachVtTbTrongThoiGIanBaoHanh
} from "../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/DanhSachVtTbTrongThoiGianBaoHanh.service";

@Component({
  selector: 'app-toan-bo-ds-vt-tb-trong-thoi-gian-bao-hanh',
  templateUrl: './toan-bo-ds-vt-tb-trong-thoi-gian-bao-hanh.component.html',
  styleUrls: ['./toan-bo-ds-vt-tb-trong-thoi-gian-bao-hanh.component.scss']
})
export class ToanBoDsVtTbTrongThoiGianBaoHanhComponent extends Base2Component implements OnInit {
  CHUC_NANG = CHUC_NANG;
  dsDonvi: any[] = [];
  dsLoaiVthh: any[] = [];
  dsCloaiVthh: any[] = [];
  dataTableView: any = [];
  tongHop = false;
  expandSetString = new Set<string>();
  loaiHhXuatKhac = LOAI_HH_XUAT_KHAC;
  isVisibleModal = false;
  selectedItem: any;
  modalWidth: any;
  idDs: number = 0;
  openDs = false;
  @Output() tabFocus = new EventEmitter<object>();

  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private donviService: DonviService,
              private danhMucService: DanhMucService,
              private danhSachVtTbTrongThoiGIanBaoHanh: DanhSachVtTbTrongThoiGIanBaoHanh) {
    super(httpClient, storageService, notification, spinner, modal, danhSachVtTbTrongThoiGIanBaoHanh);
    this.formData = this.fb.group({
      id: [],
      maDvi: [],
      idTongHop: [],
      maTongHop: [],
      maDiaDiem: [],
      loaiVthh: [],
      cloaiVthh: [],
      moTaHangHoa: [],
      donViTinh: [],
      slTonKho: [],
      slHetHan: [],
      ngayNhapKho: [],
      ngayDeXuat: [],
      ngayDeXuatTu: [],
      ngayDeXuatDen: [],
      ngayTongHop: [],
      ngayTongHopTu: [],
      ngayTongHopDen: [],
      thoiHanLk: [],
      lyDo: [],
      trangThai: [],
      loai: [LOAI_HH_XUAT_KHAC.VT_BH],
      tenLoaiVthh: [],
      tenCloaiVthh: [],
      tenTrangThai: [],
      tenCuc: [],
      tenChiCuc: [],
      tenDiemKho: [],
      tenNhaKho: [],
      tenNganKho: [],
      tenLoKho: [],
    })
  }

  async ngOnInit(): Promise<void> {
    try {
      await this.spinner.show();
      await Promise.all([
        this.loadDsDonVi(),
        this.loadDsVthh()
      ]);
      await this.search();
    } catch (e) {
      console.log('error: ', e)
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  disabledNgayDeXuatTu = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayDeXuatDen) {
      return startValue.getTime() > this.formData.value.ngayDeXuatDen.getTime();
    } else {
      return false;
    }
  };

  disabledNgayDeXuatDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayDeXuatTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayDeXuatTu.getTime();
  };

  disabledNgayTongHopTu = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayTongHopDen) {
      return startValue.getTime() > this.formData.value.ngayTongHopDen.getTime();
    }
    return false;
  };

  disabledNgayTongHopDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayTongHopTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayTongHopTu.getTime();
  };

  async search() {
    await super.search();
    this.dataTable.forEach(s => {
      s.idVirtual = uuidv4();
      this.expandSetString.add(s.idVirtual);
    });
    this.buildTableView();
  }

  async loadDsDonVi() {
    const dsTong = await this.donviService.layDonViCon();
    if (!isEmpty(dsTong)) {
      this.dsDonvi = dsTong.data.filter(s => s.type === 'DV');
    }
  }

  async loadDsVthh() {
    let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsLoaiVthh = res.data?.filter((x) => (x.key.length == 4 && x.key.match("^01.*")));
    }
  }

  async changeHangHoa(event: any) {
    this.formData.patchValue({cloaiVthh: null})
    if (event) {
      let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha({str: event});
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.dsCloaiVthh = res.data;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  buildTableView() {
    this.dataTableView = chain(this.dataTable)
      .groupBy("tenChiCuc")
      .map((value, key) => {
        let idVirtual = uuidv4();
        this.expandSetString.add(idVirtual);
        return {
          idVirtual: idVirtual,
          tenChiCuc: key,
          childData: value
        };
      }).value();
  }

  onExpandStringChange(id: string, checked: boolean) {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }

  emitTab(tab) {
    this.tabFocus.emit(tab);
  }

  openTongHop() {
    this.tongHop = !this.tongHop;
    this.emitTab(1);
  }

  openDsModal(id: number) {
    this.idDs = id;
    this.openDs = true;
  }

  closeDsModal() {
    this.idDs = null;
    this.openDs = false;
  }

}
