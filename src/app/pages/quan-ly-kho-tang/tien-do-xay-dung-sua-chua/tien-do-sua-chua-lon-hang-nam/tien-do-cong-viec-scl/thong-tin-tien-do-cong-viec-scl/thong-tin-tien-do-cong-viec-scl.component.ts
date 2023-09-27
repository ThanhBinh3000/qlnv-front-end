import {Component, Input, OnInit} from '@angular/core';
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {UserLogin} from "../../../../../../models/userlogin";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {UserService} from "../../../../../../services/user.service";
import {Globals} from "../../../../../../shared/globals";
import {MESSAGE} from "../../../../../../constants/message";
import {TienDoXayDungCt} from "../../../tien-do-dau-tu-xay-dung/tien-do-cong-viec/tien-do-cong-viec.component";
@Component({
  selector: 'app-thong-tin-tien-do-cong-viec-scl',
  templateUrl: './thong-tin-tien-do-cong-viec-scl.component.html',
  styleUrls: ['./thong-tin-tien-do-cong-viec-scl.component.scss']
})
export class ThongTinTienDoCongViecSclComponent implements OnInit {
  @Input() dataInput: any
  @Input() type: string
  @Input() sum: number
  @Input() dataTable: any[] = []
  @Input() tableCongViec: any[] = []
  dataTableRes : any[] = []
  item: TienDoXayDungCt = new TienDoXayDungCt();
  userInfo: UserLogin
  valueLabel: boolean = true;
  tableCvMoi: any[] = [];

  constructor(
    private danhMucService: DanhMucService,
    private userService: UserService,
    private _modalRef: NzModalRef,
    private modal: NzModalService,
    public globals: Globals,
    private notification: NzNotificationService,
    private spinner: NgxSpinnerService,
  ) {
  }

  async ngOnInit() {
    this.userInfo = this.userService.getUserLogin();
    this.filterData();
  }

  handleOk() {
    if (this.dataInput && this.dataInput.dataChild && this.dataInput.dataChild.length > 0) {
      this._modalRef.close(this.dataTableRes);
    } else {
      this.tableCongViec.forEach(item => {
        item.loai = "00";
        item.thang = this.dataInput.thang
      })
      let arr = [...this.tableCongViec, this.tableCvMoi].flat()
      this._modalRef.close(arr)
    }
  }

  onCancel() {
    this._modalRef.close();
  }

  filterData() {
    if(this.dataInput && this.dataInput.dataChild && this.dataInput.dataChild.length > 0) {
      this.tableCongViec = this.dataTable.filter(item => item.loai == "00");
      this.tableCvMoi = this.dataTable.filter(item => item.loai == "01");
    } else {
      this.dataTable.forEach(item => {
        item.klTheoHd = item.khoiLuong ?? null
        item.ttTheoHd = item.donGia ?? null
      })
      this.tableCongViec = this.dataTable
    }
  }

  checkExitsData(item, dataItem): boolean {
    let rs = false;
    if (dataItem && dataItem.length > 0) {
      dataItem.forEach(it => {
        if (it.tenCongViec == item.tenCongViec) {
          rs = true;
          return;
        }
      });
    }
    return rs;
  }

  themMoiCongViec() {
    if (!this.item.tenCongViec) {
      this.notification.error(MESSAGE.ERROR, "Không được để trống tên công việc");
      return;
    }
    if (this.checkExitsData(this.item, this.tableCvMoi)) {
      this.notification.error(MESSAGE.ERROR, "Không được trùng tên công việc");
      this.spinner.hide();
      return;
    }
    this.item.thang = this.dataInput.thang
    this.item.loai = "01"
    this.tableCvMoi = [...this.tableCvMoi, this.item]
    this.dataTableRes.push(this.item)
    this.item = new TienDoXayDungCt();
  }

}
