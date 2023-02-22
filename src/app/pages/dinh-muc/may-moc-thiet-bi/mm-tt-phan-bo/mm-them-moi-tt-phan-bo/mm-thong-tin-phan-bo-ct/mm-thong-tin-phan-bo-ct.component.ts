import {Component, Input, OnInit} from '@angular/core';
import {
  MmThongTinNcChiCuc
} from "../../../de-xuat-nhu-cau-chi-cuc/thong-tin-de-xuat-nhu-cau-chi-cuc/thong-tin-de-xuat-nhu-cau-chi-cuc.component";
import {DANH_MUC_LEVEL} from "../../../../../luu-kho/luu-kho.constant";
import {DonviService} from "../../../../../../services/donvi.service";
import {UserLogin} from "../../../../../../models/userlogin";
import {UserService} from "../../../../../../services/user.service";
import {NzModalRef} from "ng-zorro-antd/modal";
import {Globals} from "../../../../../../shared/globals";
import {MESSAGE} from "../../../../../../constants/message";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-mm-thong-tin-phan-bo-ct',
  templateUrl: './mm-thong-tin-phan-bo-ct.component.html',
  styleUrls: ['./mm-thong-tin-phan-bo-ct.component.scss']
})
export class MmThongTinPhanBoCtComponent implements OnInit {
  @Input() dataInput: any
  @Input() type: string
  item: MmThongTinNcChiCuc = new MmThongTinNcChiCuc();
  listChiCuc: any[] = []
  userInfo: UserLogin

  constructor(
    private dmDviService: DonviService,
    private userService: UserService,
    private _modalRef: NzModalRef,
    public globals: Globals,
    private notification: NzNotificationService,
    private spinner: NgxSpinnerService
  ) {
  }

  async ngOnInit() {
    this.userInfo = this.userService.getUserLogin();
    this.addDetail()
    // await this.loadDsChiCuc();

  }

  addDetail() {
    if (this.dataInput) {
      if (this.type == 'them') {
        this.item.soLuongTc = this.dataInput.soLuongTc;
        this.item.tenTaiSan = this.dataInput.tenTaiSan;
        this.item.donViTinh = this.dataInput.donViTinh;
        this.item.maTaiSan = this.dataInput.maTaiSan;
      } else {
        this.item.soLuongTc = this.dataInput.soLuongTc;
        this.item.tenTaiSan = this.dataInput.tenTaiSan;
        this.item.donViTinh = this.dataInput.donViTinh;
        this.item.maTaiSan = this.dataInput.maTaiSan;
        this.item.maDvi = this.dataInput.maDvi
        this.item.soLuong = this.dataInput.soLuong
        this.item.ghiChu = this.dataInput.ghiChu
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
    this.listChiCuc = this.listChiCuc.filter(item => item.type != "PB")
  }

  handleOk() {
    let msgRequired = this.required(this.item);
    if (msgRequired) {
      this.notification.error(MESSAGE.ERROR, msgRequired);
      this.spinner.hide();
      return;
    }
    this._modalRef.close(this.item);
    this.item = new MmThongTinNcChiCuc();
  }

  onCancel() {
    this._modalRef.close();
  }

  required(item: MmThongTinNcChiCuc) {
    let msgRequired = '';
    //validator
    if (!item.maDvi) {
      msgRequired = "Đơn vị Chi cục, VP Cục không được để trống!";
    } else if (!item.soLuong) {
      msgRequired = "Số lượng không được để trống";
    }
    return msgRequired;
  }

}
