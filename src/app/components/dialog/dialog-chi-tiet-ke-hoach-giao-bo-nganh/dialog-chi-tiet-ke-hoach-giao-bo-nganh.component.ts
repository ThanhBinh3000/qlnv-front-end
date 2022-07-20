import { Component, OnInit, ViewChild } from '@angular/core';
import { sortBy } from 'lodash';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucTieuChuanService } from 'src/app/services/danhMucTieuChuan.service';
import { DanhMucService } from './../../../services/danhmuc.service';
import { KeHoachXuatGiamComponent } from './ke-hoach-xuat-giam/ke-hoach-xuat-giam.component';

@Component({
  selector: 'app-dialog-chi-tiet-ke-hoach-giao-bo-nganh',
  templateUrl: './dialog-chi-tiet-ke-hoach-giao-bo-nganh.component.html',
  styleUrls: ['./dialog-chi-tiet-ke-hoach-giao-bo-nganh.component.scss'],
})
export class DialogChiTietKeHoachGiaoBoNganhComponent implements OnInit {


  dataKhXg: any;

  dataMuaTang = [];
  dataXuatGiam = [];
  dataXuatBan = [];
  dataLuanPhien = [];


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
  dsBoNganh: any[];
  dsHangHoa: any[];

  constructor(
    private readonly _modalRef: NzModalRef,
    private danhMucService: DanhMucService,
  ) { }

  async ngOnInit() {
    await Promise.all([
      this.getListBoNganh(),
      this.loadDanhMucHang()
    ]);
  }

  async getListBoNganh() {
    this.dsBoNganh = [];
    let res = await this.danhMucService.danhMucChungGetAll('BO_NGANH');
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsBoNganh = res.data;
    }
  }

  async loadDanhMucHang() {
    await this.danhMucService.loadDanhMucHangHoa().subscribe((hangHoa) => {
      console.log(hangHoa);
      if (hangHoa.msg == MESSAGE.SUCCESS) {
        const dataVatTu = hangHoa.data.filter(item => item.ma == "02");
        this.dsHangHoa = dataVatTu[0].child;
      }
    })
  }

  luu() {
    console.log(this.dataMuaTang, this.dataXuatGiam, this.dataXuatBan, this.dataLuanPhien)
  }

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
