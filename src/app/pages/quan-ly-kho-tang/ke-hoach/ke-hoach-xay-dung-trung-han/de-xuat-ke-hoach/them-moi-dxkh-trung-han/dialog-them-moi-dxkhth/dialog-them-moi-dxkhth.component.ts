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
import {cloneDeep} from "lodash";

@Component({
  selector: 'app-dialog-them-moi-dxkhth',
  templateUrl: './dialog-them-moi-dxkhth.component.html',
  styleUrls: ['./dialog-them-moi-dxkhth.component.scss']
})
export class DialogThemMoiDxkhthComponent implements OnInit {
  @Input() dataInput: any
  @Input() type: string
  @Input() namKh : number
  @Input() sum: number
  @Input() page: string
  item: DanhMucKho = new DanhMucKho();
  listDmKho: any[] = []
  listLoaiDuAn: any[] = []
  listKhoi: any[] = []
  userInfo: UserLogin


  constructor(
    private danhMucService: DanhMucService,
    private userService: UserService,
    private _modalRef: NzModalRef,
    public globals: Globals,
    private notification: NzNotificationService,
    private spinner: NgxSpinnerService,
    private dmKhoService : DanhMucKhoService
  ) {
  }

  async ngOnInit() {
    this.userInfo = this.userService.getUserLogin();
    // this.namKh = dayjs().get('year');
    this.getAllLoaiDuAn();
    this.getDsKhoi();
    await this.getAllDmKho();
    await this.getDetail();
    this.item.namKeHoach= this.namKh;
  }

  async getDsKhoi() {
    let res = await this.danhMucService.danhMucChungGetAll("KHOI_DU_AN_KT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listKhoi = res.data;
    }
  }

  handleOk() {
    let msgRequired = this.required(this.item);
    if (msgRequired) {
      this.notification.error(MESSAGE.ERROR, msgRequired);
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


  async getAllDmKho() {
    let body = {
      "type" : "DMK",
      "maDvi" : this.userInfo.MA_DVI,
      "trangThai" : STATUS.CHUA_THUC_HIEN
    }
    let res = await this.dmKhoService.getAllDmKho(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDmKho = res.data
    }
  }

  getDetail() {
    if (this.type == 'sua') {
      this.item.maDuAn = this.dataInput.maDuAn;
      this.item.namKeHoach = this.dataInput.namKeHoach;
      this.item.khoi = this.dataInput.khoi;
      this.item.diaDiem = this.dataInput.diaDiem;
      this.item.loaiDuAn = this.dataInput.loaiDuAn;
      this.item.soQdPd = this.dataInput.soQdPd;
      this.item.ngayQdDc = this.dataInput.ngayQdDc;
      this.item.tmdtDuKien = this.dataInput.tmdtDuKien;
      this.item.nstwDuKien = this.dataInput.nstwDuKien;
      this.item.khVonTongSo = this.dataInput.khVonTongSo;
      this.item.khVonNstw = this.dataInput.khVonNstw;
      this.item.ncKhTongSo = this.dataInput.ncKhTongSo;
      this.item.ncKhNstw = this.dataInput.ncKhNstw;
      this.item.tgKhoiCong = this.dataInput.tgKhoiCong;
      this.item.tgHoanThanh = this.dataInput.tgHoanThanh;
      this.item.vonDauTu = this.dataInput.vonDauTu ? this.dataInput.vonDauTu : 0 ;
    }
  }
  async changeDmucDuAn(event: any) {
    if (event) {
      let result = this.listDmKho.find(item => item.maDuAn == event)
      if (result) {
        this.item = cloneDeep(result);
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
