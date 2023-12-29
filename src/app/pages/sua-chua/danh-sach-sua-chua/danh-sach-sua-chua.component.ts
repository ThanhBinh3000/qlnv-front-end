import { Component, OnInit } from '@angular/core';
import { XuatThanhLyComponent } from "src/app/pages/xuat/xuat-thanh-ly/xuat-thanh-ly.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "src/app/services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { DonviService } from "src/app/services/donvi.service";
import { DanhMucService } from "src/app/services/danhmuc.service";
import { MESSAGE } from "src/app/constants/message";
import { CHUC_NANG } from 'src/app/constants/status';
import { v4 as uuidv4 } from "uuid";
import { Base2Component } from "src/app/components/base2/base2.component";
import { DanhSachSuaChuaService } from "src/app/services/sua-chua/DanhSachSuaChua.service";
import { chain, isEmpty } from "lodash";
import { SuaChuaComponent } from "src/app/pages/sua-chua/sua-chua.component";
import { Base3Component } from 'src/app/components/base3/base3.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ChiTietDanhSachSuaChuaComponent } from './chi-tiet-danh-sach-sua-chua/chi-tiet-danh-sach-sua-chua.component';

@Component({
  selector: 'app-danh-sach-sua-chua',
  templateUrl: './danh-sach-sua-chua.component.html',
  styleUrls: ['./danh-sach-sua-chua.component.scss']
})
export class DanhSachSuaChuaComponent extends Base3Component implements OnInit {
  CHUC_NANG = CHUC_NANG;
  dsDonvi: any[] = [];
  dsLoaiVthh: any[] = [];
  dsCloaiVthh: any[] = [];
  expandSetString = new Set<string>();

  public vldTrangThai: SuaChuaComponent;

  constructor(httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private donviService: DonviService,
    private danhMucService: DanhMucService,
    private danhSachSuaChuaService: DanhSachSuaChuaService,
    private suaChuaComponent: SuaChuaComponent) {
    super(httpClient, storageService, notification, spinner, modal, route, router, danhSachSuaChuaService);
    this.vldTrangThai = suaChuaComponent;
    this.formData = this.fb.group({
      id: [],
      maDvi: [],
      idTongHop: [],
      maTongHop: [],
      maDiaDiem: [],
      loaiVthh: [],
      cloaiVthh: [],
      namNhap: [],
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
    this.formData.patchValue({ cloaiVthh: null })
    if (event) {
      let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha({ str: event });
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

  showDetail(data) {
    if (data) {
      const modalGT = this.modal.create({
        nzTitle: 'Thông tin hàng DTQG cần sửa chữa',
        nzContent: ChiTietDanhSachSuaChuaComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          data: data
        },
      });
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.ACCESS_DENIED);
    }
  }

}

