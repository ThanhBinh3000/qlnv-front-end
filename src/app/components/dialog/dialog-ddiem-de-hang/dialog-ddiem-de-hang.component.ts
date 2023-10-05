import { Component, OnInit } from '@angular/core';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import { DiaDiemDeHang } from 'src/app/models/DiaDiemDeHang';
import { UserLogin } from 'src/app/models/userlogin';
import { DonviService } from 'src/app/services/donvi.service';
import { HelperService } from 'src/app/services/helper.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import {DANH_MUC_LEVEL} from "../../../pages/luu-kho/luu-kho.constant";

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
    public globals: Globals,
    private modal: NzModalService,
  ) { }

  async ngOnInit() {
    await Promise.all([
      this.userInfo = this.userService.getUserLogin(),
      this.loadDsChiCuc(),
      this.updateEditCache()
    ])
  }

  themMoiItem() {
    this.dataTable = [...this.dataTable, this.rowItem]
    this.updateEditCache();
    this.rowItem = new DiaDiemDeHang();
  }

  async loadDsChiCuc() {
    let res = await this.donviService.layTatCaDonViByLevel(3);
    if (res && res.data) {
      this.dsChiCuc = res.data
      this.dsChiCuc = this.dsChiCuc.filter(item => item.type != "PB" && item.maDvi.startsWith(this.userInfo.MA_DVI))
    }
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

  onChangeChiCuc($event, type?) {
    let dataCcuc = this.dsChiCuc.filter(item => item.maDvi == $event);
    if (dataCcuc.length > 0) {
      if (type) {
        type.tenDvi =  dataCcuc[0].tenDvi;
      } else {
        this.rowItem.tenDvi = dataCcuc[0].tenDvi;
      }
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

  startEdit(i: number) {
    this.editCache[i].edit = true;
  }

  deleteRow(i: number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          this.dataTable.splice(i, 1);
          this.updateEditCache()
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  saveEdit(index: number) {
    Object.assign(this.dataTable[index], this.editCache[index].data);
    this.editCache[index].edit = false;
  }

  cancelEdit(idx: number) {
    this.editCache[idx] = {
      data: { ...this.dataTable[idx] },
      edit: false,
    };
  }
}
