import { MESSAGE } from '../../../constants/message';
import { DanhMucService } from '../../../services/danhmuc.service';
import { VatTu } from '../dialog-them-thong-tin-vat-tu-trong-nam/danh-sach-vat-tu-hang-hoa.type';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'dialog-them-moi-ctbb-chuan-bi-kho-truoc-khi-nhap',
  templateUrl:
    './dialog-them-moi-ctbb-chuan-bi-kho-truoc-khi-nhap.component.html',
  styleUrls: [
    './dialog-them-moi-ctbb-chuan-bi-kho-truoc-khi-nhap.component.scss',
  ],
})
export class DialogThemMoiCtbbChuanBiKhoTruocKhiNhapComponent
  implements OnInit {
  data: any;
  radioValue: string = 'trung';
  listOfMapData: VatTu[];
  listOfMapDataClone: VatTu[];
  mapOfExpandedData: { [key: string]: VatTu[] } = {};
  options = {
    luongThuc: false,
    muoi: false,
    vatTu: false,
  };

  constructor(
    private _modalRef: NzModalRef,
    private danhMucService: DanhMucService,
  ) { }

  ngOnInit(): void { }

  handleOk() {
    this._modalRef.close();
  }

  handleCancel() {
    this._modalRef.close();
  }
}
