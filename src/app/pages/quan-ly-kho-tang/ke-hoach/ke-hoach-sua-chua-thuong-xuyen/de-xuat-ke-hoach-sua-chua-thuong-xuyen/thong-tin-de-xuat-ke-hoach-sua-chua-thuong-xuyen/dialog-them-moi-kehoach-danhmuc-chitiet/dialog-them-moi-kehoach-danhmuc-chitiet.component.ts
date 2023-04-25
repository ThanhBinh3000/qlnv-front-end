import {Component, Input, OnInit} from '@angular/core';
import {UserLogin} from "../../../../../../../models/userlogin";
import {DanhMucService} from "../../../../../../../services/danhmuc.service";
import {UserService} from "../../../../../../../services/user.service";
import {NzModalRef} from "ng-zorro-antd/modal";
import {Globals} from "../../../../../../../shared/globals";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {DanhMucKhoService} from "../../../../../../../services/danh-muc-kho.service";
import dayjs from "dayjs";
import {MESSAGE} from "../../../../../../../constants/message";
import {STATUS} from "../../../../../../../constants/status";
import {KeHoachDmChiTiet} from "../thong-tin-de-xuat-ke-hoach-sua-chua-thuong-xuyen.component";
import {AMOUNT, AMOUNT_NO_DECIMAL} from "../../../../../../../Utility/utils";

@Component({
  selector: 'app-dialog-them-moi-kehoach-danhmuc-chitiet',
  templateUrl: './dialog-them-moi-kehoach-danhmuc-chitiet.component.html',
  styleUrls: ['./dialog-them-moi-kehoach-danhmuc-chitiet.component.scss']
})
export class DialogThemMoiKehoachDanhmucChitietComponent implements OnInit {
  @Input() dataInput: any
  @Input() type: string
  @Input() sum: number
  @Input() dataTable: any
  @Input() page: string
  item: KeHoachDmChiTiet = new KeHoachDmChiTiet();
  listDmKho: any[] = []
  listLoaiDuAn: any[] = []
  userInfo: UserLogin
  namKh: number
  amount = AMOUNT_NO_DECIMAL;

  constructor(
    private danhMucService: DanhMucService,
    private userService: UserService,
    private _modalRef: NzModalRef,
    public globals: Globals,
    private notification: NzNotificationService,
    private spinner: NgxSpinnerService,
    private dmKhoService: DanhMucKhoService
  ) {
  }

  async ngOnInit() {
    this.userInfo = this.userService.getUserLogin();
    this.namKh = dayjs().get('year')
    this.getAllDmKho();
    this.getAllLoaiDuAn();
    this.getDetail()

  }

  handleOk() {
    let msgRequired = this.required(this.item);
    if (msgRequired) {
      this.notification.error(MESSAGE.ERROR, msgRequired);
      this.spinner.hide();
      return;
    }
    if (this.checkExitsData(this.item, this.dataTable) && this.type == 'them') {
      this.notification.error(MESSAGE.ERROR, "Không được chọn trùng danh mục dự án");
      this.spinner.hide();
      return;
    }
    this._modalRef.close(this.item);
    this.item = new KeHoachDmChiTiet();
  }

  onCancel() {
    this._modalRef.close();
  }

  required(item: KeHoachDmChiTiet) {
    let msgRequired = '';
    //validator
    // if (!item.maDuAn) {
    //   msgRequired = "Không được để trống danh mục kho";
    // } else if (!item.ncKhNstw || !item.ncKhTongSo) {
    //   msgRequired = "Không được để trống nhu cầu kế hoạch đầu tư";
    // } else if (!item.loaiDuAn) {
    //   msgRequired = "Không được để trống loại dự án";
    // }
    return msgRequired;
  }

  checkExitsData(item, dataItem): boolean {
    let rs = false;
    if (dataItem && dataItem.length > 0) {
      dataItem.forEach(it => {
        if (it.maDuAn == item.maDuAn) {
          rs = true;
          return;
        }
      });
    }
    return rs;
  }


  async getAllDmKho() {
    let body = {
      "type": "DMK",
      "maDvi": this.userInfo.MA_DVI
    }
    let res = await this.dmKhoService.getAllDmKho(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDmKho = res.data
      if (this.listDmKho && this.listDmKho.length > 0) {
        this.listDmKho = this.listDmKho.filter(item => (item.trangThai == STATUS.CHUA_THUC_HIEN || item.trangThai == STATUS.DANG_THUC_HIEN) && item.khoi == this.dataInput.khoi)
      }
    }
  }

  getDetail() {
    if (this.type == 'sua') {
      // this.item.maDuAn = this.dataInput.maDuAn;
      // this.item.diaDiem = this.dataInput.diaDiem;
      // this.item.loaiDuAn = this.dataInput.loaiDuAn;
      // this.item.khoi = this.dataInput.khoi;
      // this.item.tgKcHt = this.dataInput.tgKcHt;
      // this.item.soQdPd = this.dataInput.soQdPd;
      // this.item.tmdtDuKien = this.dataInput.tmdtDuKien;
      // this.item.nstwDuKien = this.dataInput.nstwDuKien;
      // this.item.khVonTongSo = this.dataInput.khVonTongSo;
      // this.item.khVonNstw = this.dataInput.khVonNstw;
      // this.item.ncKhTongSo = this.dataInput.ncKhTongSo;
      // this.item.ncKhNstw = this.dataInput.ncKhNstw;
      // this.item.vonDauTu = this.dataInput.vonDauTu ? this.dataInput.vonDauTu : 0;
    }
  }

  changeDmucDuAn(event: any) {
    if (event) {
      let result = this.listDmKho.filter(item => item.maDuAn == event)
      if (result && result.length > 0) {
        this.item = result[0];
        // this.item.tgKcHt = this.item.tgKhoiCong + ' - ' + this.item.tgHoanThanh
      }
    }
  }

  async getAllLoaiDuAn() {
    let res = await this.danhMucService.danhMucChungGetAll("LOAI_DU_AN_KT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiDuAn = res.data;
    }
  }
}
