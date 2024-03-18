import {Component, Input, OnInit} from '@angular/core';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {NzModalService} from 'ng-zorro-antd/modal';
import {UserLogin} from 'src/app/models/userlogin';
import {MESSAGE} from 'src/app/constants/message';
import {v4 as uuidv4} from "uuid";
import {CHUC_NANG} from 'src/app/constants/status';

import {LOAI_HH_XUAT_KHAC} from "../../../../../constants/config";
import {
  BaoCaoKqKdLuongThucHangDTQGService
} from "../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatlt/BaoCaoKqKdLuongThucHangDTQG.service";

@Component({
  selector: 'app-bao-cao-ket-qua-kiem-dinh-mau',
  templateUrl: './bao-cao-ket-qua-kiem-dinh-mau.component.html',
  styleUrls: ['./bao-cao-ket-qua-kiem-dinh-mau.component.scss']
})
export class BaoCaoKetQuaKiemDinhMauComponent extends Base2Component implements OnInit {

  @Input()
  loaiVthh: string;
  @Input()
  loaiVthhCache: string;
  CHUC_NANG = CHUC_NANG;
  loaiHhXuatKhac = LOAI_HH_XUAT_KHAC;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private baoCaoKqKdLuongThucHangDTQGService: BaoCaoKqKdLuongThucHangDTQGService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, baoCaoKqKdLuongThucHangDTQGService);
    this.formData = this.fb.group({
      nam: null,
      soBaoCao: null,
      tenBaoCao: null,
      ngayBaoCao: null,
      maDvi: null,
      ngayBaoCaoTu: null,
      ngayBaoCaoDen: null,
      maDanhSach: null,
      loaiVthh: null,
    })

  }


  userInfo: UserLogin;
  userdetail: any = {};
  selectedId: number;
  idTongHop: number;
  isView = false;
  children: any = [];
  expandSetString = new Set<string>();
  idDs: number = 0;
  openDs = false;

  ngOnInit(): void {
    try {
      console.log(this.userService.getUserLogin().MA_PHONG_BAN, 8888)
      this.initData()
      this.timKiem();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  disabledStartNgayBaoCao = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayBaoCaoDen) {
      return startValue.getTime() > this.formData.value.ngayBaoCaoDen.getTime();
    }
    return false;
  };

  disabledEndNgayBaoCao = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayBaoCaoTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayBaoCaoDen.getTime();
  };

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
    this.formData.patchValue({
      loai: this.loaiHhXuatKhac.LT_6_THANG,
    });
    await this.search();
    this.dataTable.forEach(s => {
      s.idVirtual = uuidv4();
      this.expandSetString.add(s.idVirtual);
    });
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


  redirectDetail(id,idTongHop, b: boolean) {
    this.selectedId = id;
    this.idTongHop = idTongHop;
    this.isDetail = true;
    this.isView = b;
    // this.isViewDetail = isView ?? false;
  }

  openQdGnvModal(id: number) {
    this.idDs = id;
    this.openDs = true;
  }

  closeQdGnvModal() {
    this.idDs = null;
    this.openDs = false;
  }

}
