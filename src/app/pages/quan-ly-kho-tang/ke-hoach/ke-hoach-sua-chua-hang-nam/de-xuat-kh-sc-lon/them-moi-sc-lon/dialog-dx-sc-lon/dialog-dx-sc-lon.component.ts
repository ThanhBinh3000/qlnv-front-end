import {Component, Input, OnInit} from '@angular/core';
import {UserLogin} from "../../../../../../../models/userlogin";
import {UserService} from "../../../../../../../services/user.service";
import {NzModalRef} from "ng-zorro-antd/modal";
import {Globals} from "../../../../../../../shared/globals";
import {MESSAGE} from "../../../../../../../constants/message";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import { DanhMucKho } from "../../../../dm-du-an-cong-trinh/danh-muc-du-an/danh-muc-du-an.component";
import { DanhMucKhoService } from "../../../../../../../services/danh-muc-kho.service";
import { DanhMucService } from "../../../../../../../services/danhmuc.service";
import { STATUS } from "../../../../../../../constants/status";
import dayjs from "dayjs";
import {
  DanhMucSuaChuaService
} from "../../../../../../../services/qlnv-kho/quy-hoach-ke-hoach/danh-muc-kho/danh-muc-sua-chua.service";

@Component({
  selector: 'app-dialog-dx-sc-lon',
  templateUrl: './dialog-dx-sc-lon.component.html',
  styleUrls: ['./dialog-dx-sc-lon.component.scss']
})
export class DialogDxScLonComponent implements OnInit {
  @Input() dataInput: any
  @Input() type: string
  @Input() sum: number
  @Input() dataTable: any
  @Input() page: string
  item: DanhMucKho = new DanhMucKho();
  listDmScLon: any[] = []
  listLoaiDuAn: any[] = []
  userInfo: UserLogin
  namKh : number

  constructor(
    private danhMucService: DanhMucService,
    private userService: UserService,
    private _modalRef: NzModalRef,
    public globals: Globals,
    private notification: NzNotificationService,
    private spinner: NgxSpinnerService,
    private dmSuaChuaService : DanhMucSuaChuaService
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
    this.item = new DanhMucKho();
  }

  onCancel() {
    this._modalRef.close();
  }

  required(item: DanhMucKho) {
    let msgRequired = '';
    //validator
    if (!item.maDuAn) {
      msgRequired = "Không được để trống danh mục kho";
    } else if (!item.ncKhNstw || !item.ncKhTongSo) {
      msgRequired = "Không được để trống nhu cầu kế hoạch đầu tư";
    } else if (!item.loaiDuAn) {
      msgRequired = "Không được để trống loại dự án";
    }
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
      "namKeHoach" : "DMK",
      "maDvi" : this.userInfo.MA_DVI
    }
    let res = await this.dmSuaChuaService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDmScLon = res.data
      if (this.listDmScLon && this.listDmScLon.length > 0) {
        this.listDmScLon = this.listDmScLon.filter(item => (item.trangThai == STATUS.CHUA_THUC_HIEN || item.trangThai == STATUS.DANG_THUC_HIEN) && item.khoi == this.dataInput.khoi)
      }
    }
  }

  getDetail() {
    if (this.type == 'sua') {
      this.item.maDuAn = this.dataInput.maDuAn;
      this.item.diaDiem = this.dataInput.diaDiem;
      this.item.loaiDuAn = this.dataInput.loaiDuAn;
      this.item.khoi = this.dataInput.khoi;
      this.item.tgKcHt = this.dataInput.tgKcHt;
      this.item.soQdPd = this.dataInput.soQdPd;
      this.item.tmdtDuKien = this.dataInput.tmdtDuKien;
      this.item.nstwDuKien = this.dataInput.nstwDuKien;
      this.item.khVonTongSo = this.dataInput.khVonTongSo;
      this.item.khVonNstw = this.dataInput.khVonNstw;
      this.item.ncKhTongSo = this.dataInput.ncKhTongSo;
      this.item.ncKhNstw = this.dataInput.ncKhNstw;
      this.item.vonDauTu = this.dataInput.vonDauTu ? this.dataInput.vonDauTu : 0 ;
    } else {
      this.item.namKeHoach = dayjs().get('year')
    }
  }

  changeDmucDuAn(event: any) {
    if (event) {
      let result = this.listDmScLon.filter(item => item.maDuAn == event)
      if (result && result.length > 0) {
        this.item = result[0];
        this.item.tgKcHt = this.item.tgKhoiCong + ' - ' + this.item.tgHoanThanh
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