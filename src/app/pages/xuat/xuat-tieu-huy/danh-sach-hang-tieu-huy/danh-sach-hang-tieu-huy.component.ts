import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Base2Component} from "../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DonviService} from "src/app/services/donvi.service";
import {CHUC_NANG} from 'src/app/constants/status';
import {MESSAGE} from "src/app/constants/message";
import {chain, isEmpty} from "lodash";
import {DanhMucService} from "src/app/services/danhmuc.service";
import {v4 as uuidv4} from "uuid";
import {XuatTieuHuyComponent} from "../xuat-tieu-huy.component";
import {DanhSachTieuHuyService} from "../../../../services/qlnv-hang/xuat-hang/xuat-tieu-huy/DanhSachTieuHuy.service";

@Component({
  selector: 'app-danh-sach-hang-tieu-huy',
  templateUrl: './danh-sach-hang-tieu-huy.component.html',
  styleUrls: ['./danh-sach-hang-tieu-huy.component.scss']
})
export class DanhSachHangTieuHuyComponent extends Base2Component implements OnInit {
  CHUC_NANG = CHUC_NANG;
  dsDonvi: any[] = [];
  dsLoaiVthh: any[] = [];
  dsCloaiVthh: any[] = [];
  dataTableView: any = [];
  expandSetString = new Set<string>();
  tongHop = false;
  @Output() tabFocus = new EventEmitter<object>();
  public vldTrangThai: XuatTieuHuyComponent;

  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private donviService: DonviService,
              private danhMucService: DanhMucService,
              private danhSachTieuHuyService: DanhSachTieuHuyService,
              private XuatTieuHuyComponent: XuatTieuHuyComponent) {
    super(httpClient, storageService, notification, spinner, modal, danhSachTieuHuyService);
    this.vldTrangThai = XuatTieuHuyComponent;
    this.formData = this.fb.group({
      id: [],
      maDvi: [],
      idTongHop: [],
      maTongHop: [],
      maDiaDiem: [],
      loaiVthh: [],
      cloaiVthh: [],
      donViTinh: [],
      slHienTai: [],
      slDeXuat: [],
      slDaDuyet: [],
      thanhTien: [],
      ngayNhapKho: [],
      ngayDeXuat: [],
      ngayDeXuatTu: [],
      ngayDeXuatDen: [],
      ngayTongHop: [],
      ngayTongHopTu: [],
      ngayTongHopDen: [],
      lyDo: [],
      trangThai: [],
      type: [],
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
      await this.timKiem();
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

  async timKiem() {
    await this.search();
    this.dataTable.forEach(s => {
      s.idVirtual = uuidv4();
      this.expandSetString.add(s.idVirtual);
    });
    this.buildTableView();
  }

  async xoaDieuKien(currentSearch?: any) {
    this.formData.reset();
    if (currentSearch) {
      this.formData.patchValue(currentSearch)
    }
    this.timKiem();
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
      this.dsLoaiVthh = res.data?.filter((x) => (x.ma.length == 2 && !x.ma.match("^01.*")) || (x.ma.length == 4 && x.ma.match("^01.*")));
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
      .groupBy("tenCuc")
      .map((value, key) => {
        let rs = chain(value)
          .groupBy("tenChiCuc")
          .map((v, k) => {
              let rowItem = v.find(s => s.tenChiCuc === k);
              let idVirtual = uuidv4();
              this.expandSetString.add(idVirtual);
              return {
                idVirtual: idVirtual,
                tenChiCuc: k,
                maDiaDiem: rowItem.maDiaDiem,
                tenCloaiVthh: rowItem.tenCloaiVthh,
                childData: v
              }
            }
          ).value();
        let rowItem = value.find(s => s.tenCuc === key);
        let idVirtual = uuidv4();
        this.expandSetString.add(idVirtual);
        return {
          idVirtual: idVirtual,
          tenCuc: key,
          childData: rs
        };
      }).value();
    console.log(this.dataTableView, 'dataTableView')
    console.log(this.expandSetString)
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
}
