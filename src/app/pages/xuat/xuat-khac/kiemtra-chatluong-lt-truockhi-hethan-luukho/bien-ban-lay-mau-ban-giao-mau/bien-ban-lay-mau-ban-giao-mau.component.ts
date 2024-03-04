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
import {chain, cloneDeep} from "lodash";
@Component({
  selector: 'app-xk-bien-ban-lay-mau-ban-giao-mau',
  templateUrl: './bien-ban-lay-mau-ban-giao-mau.component.html',
  styleUrls: ['./bien-ban-lay-mau-ban-giao-mau.component.scss']
})
export class BienBanLayMauBanGiaoMauComponent extends Base2Component implements OnInit {

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
    private bienBanLayMauLuongThucHangDTQGService: BienBanLayMauLuongThucHangDTQGService
  ) {
    super(httpClient, storageService, notification, spinner, modal, tongHopDanhSachHangDTQGService);
    this.formData = this.fb.group({
      nam: null,
      soBienBan: null,
      maDanhSach: null,
      dviKiemNghiem: null,
      tenDvi: null,
      maDvi: null,
      ngayLayMau: null,
      ngayLayMauTu: null,
      ngayLayMauDen: null,
      loai: null,
      loaiVthh: null,
      maChiCuc: null,
    })
    this.filterTable = {
      maDanhSach: '',
      nam: '',
      soBienBan: '',
      ngayLayMau: '',
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
      this.initData()
      this.timKiem();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  disabledStartNgayLayMau = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayLayMauDen) {
      return startValue.getTime() > this.formData.value.ngayLayMauDen.getTime();
    }
    return false;
  };

  disabledEndNgayLayMau = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayLayMauTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayLayMauDen.getTime();
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
    let data= cloneDeep(this.dataTable)
    this.dataTable = [];
    data.forEach(item => {
      const filteredHdr = { ...item }; // Tạo một bản sao của hdr để tránh thay đổi gián tiếp đến dữ liệu gốc
      filteredHdr.tongHopDtl = item.tongHopDtl.filter(tongHopDtlItem => tongHopDtlItem.maDiaDiem.startsWith(this.userInfo.MA_DVI));
      if (filteredHdr.tongHopDtl.length > 0) {
        this.dataTable.push(filteredHdr);
      }
    });
    console.log(this.dataTable,"5")
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
            id: item.idBienBan
          };
          this.bienBanLayMauLuongThucHangDTQGService.delete(body).then(async () => {
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
