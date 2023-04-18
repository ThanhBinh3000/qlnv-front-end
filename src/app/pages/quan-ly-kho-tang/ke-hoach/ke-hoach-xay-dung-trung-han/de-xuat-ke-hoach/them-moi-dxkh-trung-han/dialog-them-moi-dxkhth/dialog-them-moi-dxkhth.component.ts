import {Component, Input, OnInit} from '@angular/core';
import {DonviService} from "../../../../../../../services/donvi.service";
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

@Component({
  selector: 'app-dialog-them-moi-dxkhth',
  templateUrl: './dialog-them-moi-dxkhth.component.html',
  styleUrls: ['./dialog-them-moi-dxkhth.component.scss']
})
export class DialogThemMoiDxkhthComponent implements OnInit {
  @Input() dataInput: any
  @Input() type: string
  @Input() sum: number
  item: DanhMucKho = new DanhMucKho();
  listDmKho: any[] = []
  listLoaiDuAn: any[] = []
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
    let res = await this.dmKhoService.getAllDmKho('DMK');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDmKho = res.data
      if (this.listDmKho && this.listDmKho.length > 0) {
        this.listDmKho = this.listDmKho.filter(item => item.trangThai == STATUS.CHUA_THUC_HIEN && item.khoi == this.dataInput.khoi)
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
    }
  }

  changeDmucDuAn(event: any) {
    if (event) {
      let result = this.listDmKho.filter(item => item.maDuAn == event)
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
