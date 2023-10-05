import {Component, OnInit, Input} from '@angular/core';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {NzModalService} from 'ng-zorro-antd/modal';
import dayjs from 'dayjs';
import {UserLogin} from 'src/app/models/userlogin';
import {MESSAGE} from 'src/app/constants/message';
import {chain} from 'lodash';
import * as uuid from "uuid";
import {PhieuXuatKhoService} from 'src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/PhieuXuatKho.service';
import {CHUC_NANG} from 'src/app/constants/status';
import {CuuTroVienTroComponent} from '../../cuu-tro-vien-tro.component';

@Component({
  selector: 'app-phieu-xuat-kho',
  templateUrl: './phieu-xuat-kho.component.html',
  styleUrls: ['./phieu-xuat-kho.component.scss']
})
export class PhieuXuatKhoComponent extends Base2Component implements OnInit {

  @Input()
  loaiVthh: string;
  @Input()
  loaiVthhCache: string;
  CHUC_NANG = CHUC_NANG;
  public vldTrangThai: CuuTroVienTroComponent;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private cuuTroVienTroComponent: CuuTroVienTroComponent,
    private phieuXuatKhoService: PhieuXuatKhoService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuXuatKhoService);
    this.vldTrangThai = this.cuuTroVienTroComponent;
    this.formData = this.fb.group({
      tenDvi: null,
      maDvi: null,
      nam: null,
      soQdGiaoNvXh: null,
      soPhieuXuatKho: null,
      ngayXuatKho: null,
      ngayXuatKhoTu: null,
      ngayXuatKhoDen: null,
      loaiVthh: null,
      type: null
    })
    this.filterTable = {
      soQdGiaoNvXh: '',
      nam: '',
      ngayQdGiaoNvXh: '',
      tenDiemKho: '',
      tenLoKho: '',
      soPhieuXuatKho: '',
      ngayXuatKho: '',
      soPhieuKnCl: '',
      ngayKn: '',
      tenTrangThai: '',
    };
  }


  userInfo: UserLogin;
  userdetail: any = {};
  selectedId: number = 0;
  isVatTu: boolean = false;
  isView = false;
  children: any = [];
  expandSetString = new Set<string>();
  idPhieuKnCl: number = 0;
  openPhieuKnCl = false;
  disabledStartNgayXk = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayXuatKhoDen) {
      return startValue.getTime() >= this.formData.value.ngayXuatKhoDen.getTime();
    }
    return false;
  };

  disabledEndNgayXk = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayXuatKhoTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayXuatKhoTu.getTime();
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
    this.formData.patchValue({
      // loaiVthh: this.loaiVthh,
      type: "XUAT_CTVT"
    });
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
        let quyetDinh = value.find(f => f.soQdGiaoNvXh === key)
        let rs = chain(value)
          .groupBy("tenDiemKho")
          .map((v, k) => {
              let diaDiem = v.find(s => s.tenDiemKho === k)
              return {
                idVirtual: uuid.v4(),
                tenDiemKho: k != "null" ? k : '',
                tenLoKho: diaDiem ? diaDiem.tenLoKho : null,
                childData: v
              }
            }
          ).value();
        let nam = quyetDinh ? quyetDinh.nam : null;
        let ngayQdGiaoNvXh = quyetDinh ? quyetDinh.ngayQdGiaoNvXh : null;
        return {
          idVirtual: uuid.v4(),
          soQdGiaoNvXh: key != "null" ? key : '',
          nam: nam,
          ngayQdGiaoNvXh: ngayQdGiaoNvXh,
          childData: rs
        };
      }).value();
    this.children = dataView
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


  redirectDetail(id, b: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = b;
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
}

