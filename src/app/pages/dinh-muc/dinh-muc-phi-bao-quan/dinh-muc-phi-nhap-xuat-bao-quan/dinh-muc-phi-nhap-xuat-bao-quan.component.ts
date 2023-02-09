import {cloneDeep} from 'lodash';
import {saveAs} from 'file-saver';
import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import dayjs from 'dayjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {LOAI_HANG_DTQG, PAGE_SIZE_DEFAULT} from 'src/app/constants/config';
import {MESSAGE} from 'src/app/constants/message';
import {UserLogin} from 'src/app/models/userlogin';
import {DonviService} from 'src/app/services/donvi.service';
import {UserService} from 'src/app/services/user.service';
import {convertTrangThai} from 'src/app/shared/commonFunction';
import {Globals} from 'src/app/shared/globals';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {
  DialogDanhSachHangHoaComponent
} from "../../../../components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component";

;
import {DinhMucPhiNxBq} from "../../../../models/DinhMucPhi";
import {QlDinhMucPhiService} from "../../../../services/qlnv-kho/QlDinhMucPhi.service";
import {DanhMucDinhMucService} from "../../../../services/danh-muc-dinh-muc.service";
import {Base2Component} from "../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import {
  TongHopDeXuatKHLCNTService
} from "../../../../services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/tongHopDeXuatKHLCNT.service";

@Component({
  selector: 'app-dinh-muc-phi-nhap-xuat-bao-quan',
  templateUrl: './dinh-muc-phi-nhap-xuat-bao-quan.component.html',
  styleUrls: ['./dinh-muc-phi-nhap-xuat-bao-quan.component.scss']
})
export class DinhMucPhiNhapXuatBaoQuanComponent extends Base2Component implements OnInit {
  @Input() capDvi: number =1;
  selectedId: number = 0;
  isViewDetail: boolean;
  isDetail: boolean = false;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    qlDinhMucPhiService: QlDinhMucPhiService
  ) {
    super(httpClient, storageService, notification, spinner, modal, qlDinhMucPhiService)
    super.ngOnInit()
    this.formData = this.fb.group({
      soQd: [''],
      trangThai: [''],
      ngayKy: [''],
      ngayHieuLuc: [''],
      trichYeu: [''],
      capDvi: [1],
    });
    this.filterTable = {};
  }

  async ngOnInit() {
    this.formData.value.capDvi = this.capDvi;
    this.filter();
  }

  filter() {
    if (this.formData.value.ngayKy && this.formData.value.ngayKy.length > 0) {
      this.formData.value.ngayKyTu = dayjs(this.formData.value.ngayKy[0]).format('DD/MM/YYYY');
      this.formData.value.ngayKyDen = dayjs(this.formData.value.ngayKy[1]).format('DD/MM/YYYY');
    }
    if (this.formData.value.ngayHieuLuc && this.formData.value.ngayHieuLuc.length > 0) {
      this.formData.value.ngayHieuLucTu = dayjs(this.formData.value.ngayHieuLuc[0]).format('DD/MM/YYYY');
      this.formData.value.ngayHieuLucDen = dayjs(this.formData.value.ngayHieuLuc[1]).format('DD/MM/YYYY');
    }
    this.search();
  }

  redirectToChiTiet(id: number, isView?: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }

  checkRolesTemplate(): boolean {
    return (this.capDvi == Number(this.userInfo.CAP_DVI));
  }
}
