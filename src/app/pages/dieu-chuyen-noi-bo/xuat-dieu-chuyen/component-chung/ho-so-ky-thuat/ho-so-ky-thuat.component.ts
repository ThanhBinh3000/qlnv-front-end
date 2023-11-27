import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Base2Component } from "src/app/components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "src/app/services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import dayjs from "dayjs";
import { MESSAGE } from "src/app/constants/message";
import { DonviService } from 'src/app/services/donvi.service';
import { NzTreeSelectComponent } from 'ng-zorro-antd/tree-select';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { HoSoKyThuatXuatDieuChuyenService } from '../services/dcnb-ho-so-ky-thuat.service';
import { PhieuKiemNghiemChatLuongDieuChuyenService } from '../services/dcnb-phieu-kiem-nghiem-chat-luong.service';

@Component({
  selector: 'app-ho-so-ky-thuat-xuat-dieu-chuyen',
  templateUrl: './ho-so-ky-thuat.component.html',
  styleUrls: ['./ho-so-ky-thuat.component.scss']
})
//hosokythuatchung
export class HoSoKyThuatXuatDieuChuyenComponent extends Base2Component implements OnInit {
  @ViewChild('NzTreeSelectComponent', { static: false }) nzTreeSelectComponent!: NzTreeSelectComponent;
  @Input() loaiVthh: string;
  @Input() loaiDc: string;
  isDetail: boolean = false;
  selectedId: number = 0;
  isViewDetail: boolean;

  listHangHoaAll: any[] = [];
  listLoaiHangHoa: any[] = [];
  listDiaDiemKho: any[] = [];
  selectedNode: any;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private phieuKiemNghiemChatLuongDieuChuyenService: PhieuKiemNghiemChatLuongDieuChuyenService,
    private hoSoKyThuatXuatDieuChuyenService: HoSoKyThuatXuatDieuChuyenService,
    private donViService: DonviService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, hoSoKyThuatXuatDieuChuyenService);
    this.formData = this.fb.group({
      id: [],
      idQdGiaoNvNh: [],
      soQdGiaoNvNh: [],
      soBbLayMau: [],
      soHd: [],
      maDvi: [],
      soHoSoKyThuat: [],
      nam: [],
      idBbLayMauXuat: [],
      kqKiemTra: [],
      loaiNhap: [],
      maDiemKho: [],
      maNhaKho: [],
      maNganKho: [],
      maLoKho: [],
      maDiaDiem: [],
      tenDiemKho: [],
      tenNhaKho: [],
      tenNganKho: [],
      tenLoKho: [],
      loaiVthh: [],
      cloaiVthh: [],
      tenLoaiVthh: [],
      tenCloaiVthh: [],
      trangThai: [],
      tenTrangThai: [],
      tenDvi: [],
      ngayTao: [],
      soBbKtNgoaiQuan: [],
      soBbKtVanHanh: [],
      soBbKtHskt: [],
      type: []
    })
  }

  async ngOnInit() {
    await this.spinner.show();
    this.formData.patchValue({
      type: 'DCNBX'
    });
    try {
      await Promise.all([
        this.search(), this.loadDsDiemKho()
      ])
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }
  async loadDsDiemKho() {
    let body = {
      maDvi: this.userInfo.MA_DVI,
    };
    let res = await this.donViService.getDonViHangTree(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDiaDiemKho = Array(res.data?.children) ? res.data.children : [];
      this.listDiaDiemKho[0].expanded = true;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }
  selectDiaDiem(node: NzTreeNodeOptions) {
    // if (node.isLeaf) {
    const current = node.origin;
    console.log("current", current.maDvi);
    const cucNode = current.maDvi.length >= 6 ? this.nzTreeSelectComponent.getTreeNodeByKey(current.maDvi.substring(0, 6)) : null;
    const chiCucNode = current.maDvi.length >= 8 ? this.nzTreeSelectComponent.getTreeNodeByKey(current.maDvi.substring(0, 8)) : null;
    const diemKhoNode = current.maDvi.length >= 10 ? this.nzTreeSelectComponent.getTreeNodeByKey(current.maDvi.substring(0, 10)) : null;
    const nhaKhoNode = current.maDvi.length >= 12 ? this.nzTreeSelectComponent.getTreeNodeByKey(current.maDvi.substring(0, 12)) : null;
    const nganKhoNode = current.maDvi.length >= 14 ? this.nzTreeSelectComponent.getTreeNodeByKey(current.maDvi.substring(0, 14)) : null;
    const loKhoNode = current.maDvi.length >= 16 ? this.nzTreeSelectComponent.getTreeNodeByKey(current.maDvi.substring(0, 16)) : null;
    const tenCuc = cucNode ? cucNode.origin.tenDvi : "";
    const tenChiCuc = chiCucNode ? chiCucNode.origin.tenDvi : ""
    const tenDiemKho = diemKhoNode ? diemKhoNode.origin.tenDvi : "";
    const tenNhaKho = nhaKhoNode ? nhaKhoNode.origin.tenDvi : "";
    const tenNganKho = nganKhoNode ? nganKhoNode.origin.tenDvi : "";
    const tenLoKho = loKhoNode ? loKhoNode.origin.tenDvi : "";
    const tenDiaDiem = (tenLoKho ? tenLoKho : "") + (tenLoKho && tenNganKho ? " - " : "") + (tenNganKho ? tenNganKho : "") + (tenNganKho && tenNhaKho ? " - " : "") + (tenNhaKho ? tenNhaKho : "") + (tenNhaKho && tenDiemKho ? " - " : "") + (tenDiemKho ? tenDiemKho : "") + (tenDiemKho && tenChiCuc ? " - " : "")
      + (tenChiCuc ? tenChiCuc : "") + (tenChiCuc && tenCuc ? " - " : "") + (tenCuc ? tenCuc : "");
    this.formData.patchValue({
      tenDiemKho,
      tenNhaKho,
      tenNganKho,
      tenLoKho,
      cloaiVthh: current.cloaiVthh,
      tenCloaiVthh: current.tenCloaiVthh,
      maDiaDiem: current.maDvi
    });
    //chon ngan
    node.title = tenDiaDiem;
    // } 
    // else {
    //   node.isSelectable = false;
    //   node.isExpanded = !node.isExpanded;
    // }
  }
  clearForm() {
    this.selectedNode = null;
    super.clearForm();
  }
  redirectToChiTiet(id: number, isView?: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }
}
