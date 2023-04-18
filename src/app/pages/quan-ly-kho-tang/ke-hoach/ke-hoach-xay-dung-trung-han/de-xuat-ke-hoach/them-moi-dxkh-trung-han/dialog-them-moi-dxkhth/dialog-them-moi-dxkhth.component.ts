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
  userInfo: UserLogin

  constructor(
    private dmDviService: DonviService,
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
    this.getAllDmKho()

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
    if (!item.maDvi) {
      msgRequired = "Không được để trống danh mục kho";
    } else if (!item.khVonTongSo || !item.khVonNstw) {
      msgRequired = "Số lượng không được để trống";
    }
    return msgRequired;
  }


  async getAllDmKho() {
    let res = await this.dmKhoService.getAllDmKho('DMK');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDmKho = res.data
      if (this.listDmKho && this.listDmKho.length > 0) {
        this.listDmKho = this.listDmKho.filter(item => item.trangThai = '00')
      }
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
}
