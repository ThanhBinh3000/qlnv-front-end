import {Component, OnInit} from '@angular/core';
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {chain, isEmpty} from "lodash";
import {DonviService} from "../../../../../../services/donvi.service";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {v4 as uuidv4} from "uuid";
import {MESSAGE} from "../../../../../../constants/message";
import {CHUC_NANG} from "../../../../../../constants/status";
import {
  DanhSachVttbTruocHethanLuuKhoService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/DanhSachVttbTruocHethanLuuKho.service";
import {LOAI_HH_XUAT_KHAC} from "../../../../../../constants/config";

@Component({
  selector: 'app-toan-bo-danh-sach',
  templateUrl: './toan-bo-danh-sach.component.html',
  styleUrls: ['./toan-bo-danh-sach.component.scss']
})
export class ToanBoDanhSachComponent extends Base2Component implements OnInit {
  CHUC_NANG = CHUC_NANG;
  dsDonvi: any[] = [];
  dsLoaiVthh: any[] = [];
  dsCloaiVthh: any[] = [];
  dataTableView: any = [];
  tongHop = false;
  expandSetString = new Set<string>();

  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private donviService: DonviService,
              private danhMucService: DanhMucService,
              private danhSachVttbTruocHethanLuuKhoService: DanhSachVttbTruocHethanLuuKhoService) {
    super(httpClient, storageService, notification, spinner, modal, danhSachVttbTruocHethanLuuKhoService);
    this.formData = this.fb.group({
      id: [],
      maDvi: [],
      idTongHop: [],
      maTongHop: [],
      maDiaDiem: [],
      loaiVthh: [],
      cloaiVthh: [],
      donViTinh: [],
      ngayNhapKho: [],
      ngayDeXuat: [],
      ngayDeXuatTu: [],
      ngayDeXuatDen: [],
      ngayTongHop: [],
      ngayTongHopTu: [],
      ngayTongHopDen: [],
      lyDo: [],
      trangThai: [],
      type: [LOAI_HH_XUAT_KHAC.VT_12_THANG],
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
    this.danhMucService.getDanhMucHangDvql({
      "dviQly": "0101"
    }).subscribe((hangHoa) => {
      if (hangHoa.msg == MESSAGE.SUCCESS) {
        console.log(hangHoa.data, '22222222');
        this.dsLoaiVthh = hangHoa.data?.filter((x) => ((x.ma.startsWith("02") || x.ma.startsWith("03")) && (x.cap == 1 || x.cap == 2)));
      }
    });
  }

  async changeHangHoa(event: any) {
    this.dsCloaiVthh = [];
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

  openTongHop() {
    this.tongHop = !this.tongHop;
  }


}
