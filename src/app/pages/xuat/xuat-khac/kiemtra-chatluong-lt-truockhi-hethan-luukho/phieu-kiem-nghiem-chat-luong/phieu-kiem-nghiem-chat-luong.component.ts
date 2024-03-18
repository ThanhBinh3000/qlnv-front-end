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
  TongHopDanhSachHangDTQGService
} from "../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatlt/TongHopDanhSachHangDTQG.service";
import {
  BienBanLayMauLuongThucHangDTQGService
} from "../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatlt/BienBanLayMauLuongThucHangDTQG.service";
import {
  PhieuKiemNgiemClLuongThucHangDTQGService
} from "../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatlt/PhieuKiemNgiemClLuongThucHangDTQG.service";

@Component({
  selector: 'app-xk-phieu-kiem-nghiem-chat-luong',
  templateUrl: './phieu-kiem-nghiem-chat-luong.component.html',
  styleUrls: ['./phieu-kiem-nghiem-chat-luong.component.scss']
})
export class PhieuKiemNghiemChatLuongComponent extends Base2Component implements OnInit {

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
    private tongHopDanhSachHangDTQGService: TongHopDanhSachHangDTQGService,
    private bienBanLayMauLuongThucHangDTQGService: BienBanLayMauLuongThucHangDTQGService,
    private phieuKiemNgiemClLuongThucHangDTQGService: PhieuKiemNgiemClLuongThucHangDTQGService
  ) {
    super(httpClient, storageService, notification, spinner, modal, tongHopDanhSachHangDTQGService);
    this.formData = this.fb.group({
      nam: null,
      soBienBan: null,
      maDanhSach: null,
      soPhieu: null,
      tenDvi: null,
      maDvi: null,
      ngayKnMau: null,
      ngayKnMauTu: null,
      ngayKnMauDen: null,
      loai: null,
      loaiVthh: null,
    })
    this.filterTable = {
      maDanhSach: '',
      nam: '',
      soBienBan: '',
      ngayKnMau: '',
      tenDiemKho: '',
      tenNhaKho: '',
      tenNganKho: '',
      tenLoKho: '',
      tenTrangThai: '',
    };
  }


  userInfo: UserLogin;
  userdetail: any = {};
  selectedId: number = 0;
  isVatTu: boolean = false;
  isView = false;
  children: any = [];
  item: any = [];
  expandSetString = new Set<string>();
  idQdGnv: number = 0;
  openQdGnv = false;

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

  disabledStartNgayKnMau = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayKnMauDen) {
      return startValue.getTime() > this.formData.value.ngayKnMauDen.getTime();
    }
    return false;
  };

  disabledEndNgayKnMau = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayKnMauTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayKnMauDen.getTime();
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

  showList() {
    this.isDetail = false;
    this.timKiem();
    this.showListEvent.emit();
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


  redirectDetail(id, b: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = b;
    // this.isViewDetail = isView ?? false;
  }

  openQdGnvModal(id: number) {
    this.idQdGnv = id;
    this.openQdGnv = true;
  }

  closeQdGnvModal() {
    this.idQdGnv = null;
    this.openQdGnv = false;
  }

  delete(item: any, roles?) {
    if (!this.checkPermission(roles)) {
      return
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.spinner.show();
        try {
          let body = {
            id: item.idPhieuKnCl
          };
          this.phieuKiemNgiemClLuongThucHangDTQGService.delete(body).then(async () => {
            await this.timKiem();
            this.spinner.hide();
          });
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

}
