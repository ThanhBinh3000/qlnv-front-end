import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { DiaDiemDeHang } from 'src/app/models/DiaDiemDeHang';
import { UserLogin } from 'src/app/models/userlogin';
import { DonviService } from 'src/app/services/donvi.service';
import { HelperService } from 'src/app/services/helper.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-dialog-ddiem-de-hang',
  templateUrl: './dialog-ddiem-de-hang.component.html',
  styleUrls: ['./dialog-ddiem-de-hang.component.scss']
})
export class DialogDdiemDeHangComponent implements OnInit {
  isView: boolean = false;
  dataTable: any[] = [];
  dsChiCuc: any[] = []

  editCache: { [key: string]: { edit: boolean; data: any } } = {};

  rowItem: DiaDiemDeHang = new DiaDiemDeHang();
  userInfo: UserLogin
  dviTinh: string = '';

  constructor(
    private _modalRef: NzModalRef,
    private donviService: DonviService,
    private userService: UserService,
    public globals: Globals
  ) { }

  async ngOnInit() {
    await Promise.all([
      this.userInfo = this.userService.getUserLogin(),
      this.getListChiCuc()
    ])
  }

  themMoiItem() {
    this.dataTable = [...this.dataTable, this.rowItem]
    this.updateEditCache();
    this.rowItem = new DiaDiemDeHang();
  }

  async getListChiCuc() {
    let body = {
      "maDviCha": this.userInfo.MA_DVI,
      "trangThai": "01"
    }
    const res = await this.donviService.getAll(body)
    this.dsChiCuc = res.data;
  }

  clearData() {

  }

  updateEditCache(): void {
    this.dataTable.forEach((item, index) => {
      this.editCache[index] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  onChangeChiCuc($event) {
    let dataCcuc = this.dsChiCuc.filter(item => item.maDvi == $event);
    if (dataCcuc.length > 0) {
      this.rowItem.tenDvi = dataCcuc[0].tenDvi;
    }
  }

  calcTong() {
    if (this.dataTable) {
      const sum = this.dataTable.reduce((prev, cur) => {
        prev += cur.soLuong;
        return prev;
      }, 0);
      return sum;
    }
  }

  save() {
    this._modalRef.close(this.dataTable);
  }

  onCancel() {
    this._modalRef.destroy();
  }

}
