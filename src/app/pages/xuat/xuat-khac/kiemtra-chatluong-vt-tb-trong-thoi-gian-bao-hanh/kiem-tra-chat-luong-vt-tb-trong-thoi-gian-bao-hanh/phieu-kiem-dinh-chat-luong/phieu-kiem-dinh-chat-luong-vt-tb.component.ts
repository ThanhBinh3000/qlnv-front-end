import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {chain} from 'lodash';
import * as uuid from "uuid";
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {CHUC_NANG} from "../../../../../../constants/status";
import {UserLogin} from "../../../../../../models/userlogin";
import {MESSAGE} from "../../../../../../constants/message";
import dayjs from "dayjs";
import {
  PhieuKdclVtTbTrongThoiGianBaoHanhService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/PhieuKdclVtTbTrongThoiGianBaoHanh.service";

@Component({
  selector: 'app-phieu-kiem-dinh-chat-luong-vt-tb',
  templateUrl: './phieu-kiem-dinh-chat-luong-vt-tb.component.html',
  styleUrls: ['./phieu-kiem-dinh-chat-luong-vt-tb.component.scss']
})
export class XkVtPhieuKiemDinhChatLuongVtTbComponent extends Base2Component implements OnInit {
  CHUC_NANG = CHUC_NANG;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private phieuKdclVtTbTrongThoiGianBaoHanhService: PhieuKdclVtTbTrongThoiGianBaoHanhService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuKdclVtTbTrongThoiGianBaoHanhService);
    this.formData = this.fb.group({
      tenDvi: [],
      maDvi: [],
      nam: [],
      soBbLayMau: [],
      soQdGiaoNvXh: [],
      soPhieu: [],
      ngayKiemDinhTu: [],
      ngayKiemDinhDen: [],
    })
  }

  userInfo: UserLogin;
  userdetail: any = {};
  selectedId: number = 0;
  soQdGiaoNvXhSelected: string;
  isVatTu: boolean = false;
  isView = false;
  children: any = [];
  expandSetString = new Set<string>();
  idPhieuKnCl: number = 0;
  openPhieuKnCl = false;
  baoCao = false;
  @Output() tabFocus = new EventEmitter<object>();
  disabledStartNgayLayMau = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayKiemDinhDen) {
      return startValue.getTime() >= this.formData.value.ngayKiemDinhDen.getTime();
    }
    return false;
  };

  disabledEndNgayLayMau = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayKiemDinhTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayKiemDinhTu.getTime();
  };

  ngOnInit(): void {
    try {
      this.initData()
      this.timKiem();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async search(roles?): Promise<void> {
    await super.search(roles);
    this.buildTableView();
  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.userdetail.maDvi = this.userInfo.MA_DVI;
    this.userdetail.tenDvi = this.userInfo.TEN_DVI;
  }


  isOwner(maDvi: any) {
    return this.userInfo.MA_PHONG_BAN == maDvi;
  }

  isBelong(maDvi: any) {
    return this.userInfo.MA_DVI == maDvi;
  }

  async timKiem() {
    await this.spinner.show();
    try {
      if (this.formData.value.ngayXuatKho) {
        this.formData.value.ngayXuatKhoTu = dayjs(this.formData.value.ngayXuatKho[0]).format('YYYY-MM-DD')
        this.formData.value.ngayXuatKhoDen = dayjs(this.formData.value.ngayXuatKho[1]).format('YYYY-MM-DD')
      }
      await this.search();
    } catch (e) {
      console.log(e)
    }
    await this.spinner.hide();
  }

  buildTableView() {
    let dataView = chain(this.dataTable)
      .groupBy("soQdGiaoNvXh")
      .map((value, key) => {
        let parent = value.find(f => f.soQdGiaoNvXh === key)
        let rs = chain(value)
          .groupBy("tenDiemKho")
          .map((v, k) => {
              let rs1 = chain(v)
                .groupBy("tenLoKho")
                .map((v1, k1) => {
                  let tenNganKho = v1.find(s => s.tenLoKho === k1)
                    return {
                      idVirtual: uuid.v4(),
                      tenLoKho: k1 != "null" ? k1 : '',
                      tenNganKho: tenNganKho ? tenNganKho.tenNganKho : null,
                      childData: v1,
                    };
                  }
                ).value();
              // let bb = v.find(s => s.tenDiemKho === k)
              return {
                idVirtual: uuid.v4(),
                tenDiemKho: k != "null" ? k : '',
                childData: rs1,
              };
            }
          ).value();
        return {
          idVirtual: uuid.v4(),
          soQdGiaoNvXh: key != "null" ? key : '',
          nam: parent ? parent.nam : null,
          ngayXuatLayMau: parent ? parent.ngayXuatLayMau : null,
          childData: rs
        };
      }).value();
    this.children = dataView
    console.log(this.children,"this")
    this.expandAll()
  }

  expandAll() {
    this.children.forEach(s => {
      this.expandSetString.add(s.idVirtual);
    })
  }

  onExpandStringChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }


  redirectDetail(id, b: boolean, soQdGiaoNvXh?) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = b;
    this.soQdGiaoNvXhSelected = soQdGiaoNvXh;
    // this.isViewDetail = isView ?? false;
  }

  openPhieuKnClModal(id: number) {
    this.idPhieuKnCl = id;
    this.openPhieuKnCl = true;
  }

  closePhieuKnClModal() {
    this.idPhieuKnCl = null;
    this.openPhieuKnCl = false;
  }

  async showList() {
    this.isDetail = false;
    await this.search();
  }
  emitTab(tab) {
    this.tabFocus.emit(tab);
  }

  openBaoCao($event) {
    this.baoCao = !this.baoCao;
    this.emitTab(2);
  }
}
