import { Component, Input, OnInit } from '@angular/core';
import { DANH_MUC_LEVEL } from '../../../../../luu-kho/luu-kho.constant';
import { DonviService } from '../../../../../../services/donvi.service';
import { UserLogin } from '../../../../../../models/userlogin';
import { UserService } from '../../../../../../services/user.service';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Globals } from '../../../../../../shared/globals';
import { MESSAGE } from '../../../../../../constants/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  PvcDxChiCucCtiet,
} from '../../../de-xuat-nc-chi-cuc-pvc/them-moi-dx-chi-cuc-pvc/them-moi-dx-chi-cuc-pvc.component';
import { AMOUNT } from '../../../../../../Utility/utils';
import { DxChiCucPvcService } from '../../../../../../services/dinh-muc-nhap-xuat-bao-quan/pvc/dx-chi-cuc-pvc.service';

@Component({
  selector: 'app-thong-tin-phan-bo-ct-pvc',
  templateUrl: './thong-tin-phan-bo-ct-pvc.component.html',
  styleUrls: ['./thong-tin-phan-bo-ct-pvc.component.scss'],
})
export class ThongTinPhanBoCtPvcComponent implements OnInit {
  @Input() listData: any[];
  @Input() dataInput: any;
  @Input() type: string;
  @Input() sum: number;
  item: PvcDxChiCucCtiet = new PvcDxChiCucCtiet();
  listChiCuc: any[] = [];
  userInfo: UserLogin;
  @Input()  listDxChiCuc: any[];
  amount = AMOUNT;

  constructor(
    private dmDviService: DonviService,
    private userService: UserService,
    private _modalRef: NzModalRef,
    public globals: Globals,
    private notification: NzNotificationService,
    private spinner: NgxSpinnerService,
  ) {
  }

  async ngOnInit() {
    this.userInfo = this.userService.getUserLogin();
    this.addDetail();
    await this.loadDsChiCuc();
    // await this.loadListDxCuaChiCuc();
  }

  addDetail() {
    if (this.dataInput) {
      if (this.type == 'them') {
        this.item.soLuongTc = this.dataInput.soLuongTc;
        this.item.tenCcdc = this.dataInput.tenCcdc;
        this.item.donViTinh = this.dataInput.donViTinh;
        this.item.maCcdc = this.dataInput.maCcdc;
        this.item.soLuong = 0;
        this.item.ghiChu = null;
      } else {
        this.item.soLuongTc = this.dataInput.soLuongTc;
        this.item.tenCcdc = this.dataInput.tenCcdc;
        this.item.donViTinh = this.dataInput.donViTinh;
        this.item.maCcdc = this.dataInput.maCcdc;
        this.item.maDvi = this.dataInput.maDvi;
        this.item.soLuong = this.dataInput.soLuong;
        this.item.ghiChu = this.dataInput.ghiChu;
      }
    }
  }

  async loadDsChiCuc() {
    const body = {
      maDviCha: this.userInfo.MA_DVI,
      trangThai: '01',
    };

    const dsTong = await this.dmDviService.layDonViTheoCapDo(body);
    this.listChiCuc = dsTong[DANH_MUC_LEVEL.CHI_CUC];
    this.listChiCuc = this.listChiCuc.filter(item => item.type != 'PB');
  }

  handleOk() {
    let msgRequired = this.required(this.item);
    if (msgRequired) {
      this.notification.warning(MESSAGE.WARNING, msgRequired);
      this.spinner.hide();
      return;
    }
    if ((this.item.soLuong > this.sum && this.type == 'them') || (this.item.soLuong > (this.sum + this.dataInput.soLuong)) && this.type == 'sua') {
      this.notification.warning(MESSAGE.WARNING, 'Số lượng vượt quá số lượng được phân bổ!');
      this.spinner.hide();
      return;
    }
    this._modalRef.close(this.item);
    this.item = new PvcDxChiCucCtiet();
  }

  onCancel() {
    this._modalRef.close();
  }


  required(item: PvcDxChiCucCtiet) {
    let msgRequired = '';
    //validator
    if (!item.maDvi) {
      msgRequired = 'Đơn vị Chi cục, VP Cục không được để trống!';
    } else if (!item.soLuong) {
      msgRequired = 'Số lượng không được để trống';
    } else {
      let dataCheck = this.listData.find(it => it.maDvi == item.maDvi && it.maCcdc == item.maCcdc);
      if (this.type == 'them') {
        if (dataCheck)
          msgRequired = 'Chi cục này đã được phân bổ hàng hóa!';
      }
    }
    return msgRequired;
  }

  changeDvi(event) {
    let itemDvi = this.listChiCuc.find(item => item.maDvi === event);
    if (itemDvi) {
      this.item.slHienCo = 0;
      this.item.slNhapThem = 0;
      this.item.tenDvi = itemDvi.tenDvi;
      let itemDx = this.listDxChiCuc.find(it => it.maDvi == itemDvi.maDvi);
      if (itemDx) {
        this.item.slHienCo = itemDx.slHienCo;
        this.item.slNhapThem = itemDx.slNhapThem;
      }
    }
  }
}
