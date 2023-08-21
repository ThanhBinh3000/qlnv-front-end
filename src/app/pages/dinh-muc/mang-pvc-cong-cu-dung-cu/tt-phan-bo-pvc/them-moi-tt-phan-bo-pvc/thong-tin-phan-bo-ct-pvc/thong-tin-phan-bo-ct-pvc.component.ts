import {Component, Input, OnInit} from '@angular/core';
import {DANH_MUC_LEVEL} from "../../../../../luu-kho/luu-kho.constant";
import {DonviService} from "../../../../../../services/donvi.service";
import {UserLogin} from "../../../../../../models/userlogin";
import {UserService} from "../../../../../../services/user.service";
import {NzModalRef} from "ng-zorro-antd/modal";
import {Globals} from "../../../../../../shared/globals";
import {MESSAGE} from "../../../../../../constants/message";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {
  MmThongTinNcChiCuc
} from "../../../../may-moc-thiet-bi/de-xuat-nhu-cau-chi-cuc/thong-tin-de-xuat-nhu-cau-chi-cuc/thong-tin-de-xuat-nhu-cau-chi-cuc.component";
import {
  PvcDxChiCucCtiet
} from "../../../de-xuat-nc-chi-cuc-pvc/them-moi-dx-chi-cuc-pvc/them-moi-dx-chi-cuc-pvc.component";
import {AMOUNT} from "../../../../../../Utility/utils";

@Component({
  selector: 'app-thong-tin-phan-bo-ct-pvc',
  templateUrl: './thong-tin-phan-bo-ct-pvc.component.html',
  styleUrls: ['./thong-tin-phan-bo-ct-pvc.component.scss']
})
export class ThongTinPhanBoCtPvcComponent  implements OnInit {
  @Input() dataInput: any
  @Input() type: string
  @Input() sum: number
  item: PvcDxChiCucCtiet = new PvcDxChiCucCtiet();
  listChiCuc: any[] = []
  userInfo: UserLogin
  amount = AMOUNT

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
    console.log(this.dataInput)
    this.addDetail();
    await this.loadDsChiCuc();

  }

  addDetail() {
    if (this.dataInput) {
      if (this.type == 'them') {
        this.item.soLuongTc = this.dataInput.soLuongTc;
        this.item.tenCcdc = this.dataInput.tenCcdc;
        this.item.donViTinh = this.dataInput.donViTinh;
        this.item.maCcdc = this.dataInput.maCcdc;
        this.item.soLuong = 0
        this.item.ghiChu = null
      } else {
        this.item.soLuongTc = this.dataInput.soLuongTc;
        this.item.tenCcdc = this.dataInput.tenCcdc;
        this.item.donViTinh = this.dataInput.donViTinh;
        this.item.maCcdc = this.dataInput.maCcdc;
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
    if (this.item.soLuong > this.sum){
      this.notification.error(MESSAGE.ERROR, 'Số lượng vượt quá số lượng được phân bổ!');
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
      msgRequired = "Đơn vị Chi cục, VP Cục không được để trống!";
    } else if (!item.soLuong) {
      msgRequired = "Số lượng không được để trống";
    }
    return msgRequired;
  }

  changeDvi(event) {
    let loaiHangHoa = this.listChiCuc.filter(item => item.maDvi === event)
    if (loaiHangHoa && loaiHangHoa.length > 0) {
      this.item.tenDvi = loaiHangHoa[0].tenDvi
    }
  }

  protected readonly AMOUNT = AMOUNT;
}
