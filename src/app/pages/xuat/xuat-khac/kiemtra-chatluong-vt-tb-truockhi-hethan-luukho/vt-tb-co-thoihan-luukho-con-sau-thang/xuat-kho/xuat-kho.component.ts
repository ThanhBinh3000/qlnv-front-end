import {Component, Input, OnInit} from '@angular/core';
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {CuuTroVienTroComponent} from "../../../../xuat-cuu-tro-vien-tro/xuat-cuu-tro/cuu-tro-vien-tro.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {UserLogin} from "../../../../../../models/userlogin";
import {MESSAGE} from 'src/app/constants/message';
import {chain} from 'lodash';
import * as uuid from "uuid";
import dayjs from "dayjs";
import {CHUC_NANG} from "../../../../../../constants/status";
import {PhieuXuatNhapKhoService} from "../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/PhieuXuatNhapKho.service";
import {DataService} from "../../../../../../services/data.service";

@Component({
  selector: 'app-xuat-kho',
  templateUrl: './xuat-kho.component.html',
  styleUrls: ['./xuat-kho.component.scss']
})
export class XuatKhoComponent extends Base2Component implements OnInit {

  CHUC_NANG = CHUC_NANG;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private dataService: DataService,
    private phieuXuatKhoService: PhieuXuatNhapKhoService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuXuatKhoService);
    // this.vldTrangThai = this.cuuTroVienTroComponent;
    this.formData = this.fb.group({
      tenDvi: null,
      maDvi: null,
      nam: null,
      soQdGiaoNvXh: null,
      soPhieu: null,
      ngayXuatKho: null,
      ngayXuatNhapTu: null,
      ngayXuatNhapDen: null,
      type: null,
      loaiPhieu: 'XUAT'
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
  soQdGiaoNvXhSelected: string;
  isVatTu: boolean = false;
  isView = false;
  children: any = [];
  expandSetString = new Set<string>();
  idPhieuKnCl: number = 0;
  openPhieuKnCl = false;
  disabledStartNgayXk = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayXuatNhapDen) {
      return startValue.getTime() >= this.formData.value.ngayXuatNhapDen.getTime();
    }
    return false;
  };

  disabledEndNgayXk = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayXuatNhapTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayXuatNhapTu.getTime();
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
      // if (this.formData.value.ngayXuatKho) {
      //   this.formData.value.ngayXuatNhapTu = dayjs(this.formData.value.ngayXuatKho[0]).format('YYYY-MM-DD')
      //   this.formData.value.ngayXuatNhapDen = dayjs(this.formData.value.ngayXuatKho[1]).format('YYYY-MM-DD')
      // }
      await this.search();
    } catch (e) {
      console.log(e)
    }
    await this.spinner.hide();
  }

  buildTableView() {
    let dataView = chain(this.dataTable)
      .groupBy("soCanCu")
      .map((value, key) => {
        let parent = value.find(f => f.soCanCu === key)
        let rs = chain(value)
          .groupBy("tenDiemKho")
          .map((v, k) => {
              // let child = v.find(s => s.tenDiemKho === k)
              let rs1 = chain(v)
                .groupBy("tenCloaiVthh")
                .map((v1, k1) => {
                    let childOfChild = v1.find(s => s.tenCloaiVthh === k1)
                    return {
                      idVirtual: uuid.v4(),
                      tenCloaiVthh: k1 != "null" ? k1 : '',
                      tenLoKho: childOfChild ? childOfChild.tenLoKho : null,
                      tenNganKho: childOfChild ? childOfChild.tenNganKho : null,
                      childData: v1
                    }
                  }
                ).value();
              return {
                idVirtual: uuid.v4(),
                tenDiemKho: k != "null" ? k : '',
                // tenLoaiVthh: child ? child.tenLoaiVthh : null,
                childData: rs1
              }
            }
          ).value();
        return {
          idVirtual: uuid.v4(),
          soCanCu: key != "null" ? key : '',
          namKeHoach: parent ? parent.namKeHoach : null,
          ngayQdGiaoNvXh: parent ? parent.ngayKy : null,
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

}
