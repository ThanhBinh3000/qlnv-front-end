import { Component, OnInit, ViewChild } from '@angular/core';
import { sortBy } from 'lodash';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucTieuChuanService } from 'src/app/services/danhMucTieuChuan.service';
import { Globals } from 'src/app/shared/globals';
import { DanhMucService } from './../../../services/danhmuc.service';
import { KeHoachLuongThucComponent } from './ke-hoach-luong-thuc/ke-hoach-luong-thuc.component';
import { KeHoachXuatGiamComponent } from './ke-hoach-xuat-giam/ke-hoach-xuat-giam.component';

@Component({
  selector: 'app-dialog-chi-tiet-ke-hoach-giao-bo-nganh',
  templateUrl: './dialog-chi-tiet-ke-hoach-giao-bo-nganh.component.html',
  styleUrls: ['./dialog-chi-tiet-ke-hoach-giao-bo-nganh.component.scss'],
})
export class DialogChiTietKeHoachGiaoBoNganhComponent implements OnInit {

  @ViewChild('keHoachLuongThuc') keHoachLuongThucComponent: KeHoachLuongThucComponent;

  isView: boolean = false;
  errorBn: boolean = false;
  errorTt: boolean = false;
  keHoach: any = {
    id: null,
    maBoNganh: null,
    tenBoNganh: null,
    tongTien: null,
    ltGaoMua: null,
    ltThocMua: null,
    ltGaoXuat: null,
    ltThocXuat: null,
    ttMuaTang: null,
    ttXuatBan: null,
    ttXuatGiam: null,
    muaTangList: [],
    xuatGiamList: [],
    xuatBanList: [],
    luanPhienList: [],
  };
  dsBoNganh: any[];
  dsHangHoa: any[];
  dataEdit: any;
  constructor(
    private readonly _modalRef: NzModalRef,
    private danhMucService: DanhMucService,
    public globals: Globals
  ) { }

  async ngOnInit() {
    this.bindingData(this.dataEdit)
    await Promise.all([
      this.getListBoNganh(),
      this.loadDanhMucHang()
    ]);
  }

  bindingData(dataEdit) {
    if (dataEdit) {
      console.log(dataEdit);
      this.keHoach = dataEdit;
    }
  }

  onChangeBoNganh(event) {
    const boNganh = this.dsBoNganh.filter(item => item.ma == event)
    if (boNganh.length > 0) {
      this.keHoach.tenBoNganh = boNganh[0].giaTri;
    }
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
      if (hangHoa.msg == MESSAGE.SUCCESS) {
        const dataVatTu = hangHoa.data.filter(item => item.ma == "02");
        this.dsHangHoa = dataVatTu[0].child;
      }
    })
  }

  luu() {
    this.keHoachLuongThucComponent.onChangeInput();
    console.log(this.keHoach);
    if (this.validateData()) {
      this._modalRef.close(this.keHoach);
    }
  }

  validateData() {
    if (!this.keHoach.maBoNganh) {
      this.errorBn = true;
      return false;
    } else {
      this.errorBn = false;
    }

    if (!this.keHoach.tongTien) {
      this.errorTt = true;
      return false;
    } else {
      this.errorTt = false;
    }
    return true;
  }

  onCancel() {
    this._modalRef.close();
  }

}

