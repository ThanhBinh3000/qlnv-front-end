import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucThuKhoService } from 'src/app/services/danh-muc-thu-kho.service';
import { DonviService } from 'src/app/services/donvi.service';
import {UserService} from "../../../../services/user.service";

@Component({
  selector: 'app-themmoi-thukho',
  templateUrl: './themmoi-thukho.component.html',
  styleUrls: ['./themmoi-thukho.component.scss']
})
export class ThemmoiThukhoComponent implements OnInit {

  data: any;
  idThuKho: number;
  dataTree: any[] = [];

  constructor(
    public userService: UserService,
    private _modalRef: NzModalRef,
    private donViService: DonviService,
    private danhMucThuKhoService: DanhMucThuKhoService,
    private notification: NzNotificationService
  ) { }

  async ngOnInit() {
    this.data = this.dataTree[0];
    this.dataTree = this.data.children;
    await this.danhMucThuKhoService.getDetail(this.idThuKho).then((res) => {
      res.included?.forEach(element => {
        this.setOfCheckedId.add(element)
      });
    })
    console.log(this.setOfCheckedId);
  }

  onExpandChange(item: any, checked: boolean): void {
    item.expandSet = checked
  }


  handleCancel() {
    this._modalRef.close();
  }

  handleOk() {
    console.log(this.setOfCheckedId);
    let body = {
      idThuKho: this.idThuKho,
      listMaDvi: Array.from(this.setOfCheckedId)
    }
    this.donViService.updateThuKho(body).then((res) => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS)
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      console.log(res);
    })
    this._modalRef.close();
  }

  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();

  onItemChecked(dataChecked: any, checked: boolean): void {
    this.updateCheckedSet(dataChecked, checked);
  }

  updateCheckedSet(dataChecked: any, checked: boolean): void {
    if (checked) {
      this.addChildren(dataChecked, dataChecked.capDvi, true);
    } else {
      // this.setOfCheckedId.delete(dataChecked.maDvi);
      this.addChildren(dataChecked, dataChecked.capDvi, false);
    }
  }

  addChildren(data: any, level: string, isAdd: boolean) {
    switch (level) {
      // Cấp ngăn kho
      case '6':
        isAdd ? this.setOfCheckedId.add(data.maDvi) : this.setOfCheckedId.delete(data.maDvi);;
        // Add toàn bộ cấp 7 ( Lô Kho ).
        data.children.forEach(element => {
          isAdd ? this.setOfCheckedId.add(element.maDvi) : this.setOfCheckedId.delete(element.maDvi);
        });
        break;
      case '7':
        isAdd ? this.setOfCheckedId.add(data.maDvi) : this.setOfCheckedId.delete(data.maDvi);
    }
    console.log(this.setOfCheckedId);
  }

  checkContainThuKho(dataKho) {
    if (dataKho.idThuKho == null || dataKho.idThuKho.length == 0 || dataKho.idThuKho == this.idThuKho) {
      return true
    } else {
      return false;
    }
  }

}
