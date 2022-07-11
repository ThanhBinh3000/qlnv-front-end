import { Component, OnInit } from '@angular/core';
import { sortBy } from 'lodash';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';

@Component({
  selector: 'app-dialog-chi-tiet-ke-hoach-giao-bo-nganh',
  templateUrl: './dialog-chi-tiet-ke-hoach-giao-bo-nganh.component.html',
  styleUrls: ['./dialog-chi-tiet-ke-hoach-giao-bo-nganh.component.scss'],
})
export class DialogChiTietKeHoachGiaoBoNganhComponent implements OnInit {
  keHoach: IKeHoachGiaoBoNganh = {
    id: null,
    idBoNganh: null,
    tenBoNganh: null,
    khLuongThuc: {
      tonDauKy: {
        gao: 250234,
        thoc: 250234,
      },
      xuatRa: {
        gao: 250234,
        thoc: 250234,
      },
      muaVao: {
        gao: 250234,
        thoc: 250234,
      },
      duTruCuoiNam: {
        gao: 250234,
        thoc: 250234,
      },
    },
    khMuaTang: null,
    khXuatGiam: null,
    khXuatBan: null,
    khLuanPhienDoiHang: null,
    tongGiaTri: null,
  };
  dsBoNganh = [
    {
      id: 1,
      tenBoNganh: 'Bộ ngoại giao',
    },
    {
      id: 2,
      tenBoNganh: 'Bộ công an',
    },
    {
      id: 2,
      tenBoNganh: 'Bộ tài chính',
    },
  ];

  constructor(private readonly _modalRef: NzModalRef) {}

  ngOnInit(): void {
    this.initData();
  }

  initData() {}

  luu() {}

  onCancel() {
    this._modalRef.close();
  }
}

interface IKeHoachGiaoBoNganh {
  id: number;
  idBoNganh: number;
  tenBoNganh: string;
  khLuongThuc: any;
  khMuaTang: any;
  khXuatGiam: any;
  khXuatBan: any;
  khLuanPhienDoiHang: any;
  tongGiaTri: number;
}
