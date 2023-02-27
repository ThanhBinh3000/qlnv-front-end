import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { DON_VI_TIEN } from 'src/app/Utility/utils';

@Component({
  selector: 'app-phu-luc-4',
  templateUrl: './phu-luc-4.component.html',
  styleUrls: ['./phu-luc-4.component.scss']
})
export class PhuLuc4Component implements OnInit {
  @Input() dataInfo;

  donViTiens: any[] = DON_VI_TIEN;
  isDataAvailable = false;
  editMoneyUnit = false;
  status = false;
  statusBtnFinish: boolean;
  statusBtnOk: boolean;
  statusPrint: boolean;
  namBcao: number;
  maDviTien: string = '1';
  thuyetMinh: string;
  constructor(
    private _modalRef: NzModalRef,
  ) { }

  ngOnInit() {
  }

  getMoneyUnit() {
    return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
  };

  async save(trangThai: string, lyDoTuChoi: string) {

  };

  async tuChoi(mcn: string) {

  };

  doPrint() {

  };

  handleCancel() {
    this._modalRef.close();
  };

}
