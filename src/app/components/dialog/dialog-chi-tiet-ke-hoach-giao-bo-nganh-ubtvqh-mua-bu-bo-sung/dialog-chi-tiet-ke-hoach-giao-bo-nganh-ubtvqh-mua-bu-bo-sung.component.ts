import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {
  KeHoachLuongThucComponent
} from "../dialog-chi-tiet-ke-hoach-giao-bo-nganh/ke-hoach-luong-thuc/ke-hoach-luong-thuc.component";
import {NzModalRef} from "ng-zorro-antd/modal";
import {DanhMucService} from "../../../services/danhmuc.service";
import {Globals} from "../../../shared/globals";
import {MESSAGE} from "../../../constants/message";
import {MuaBuComponent} from "./mua-bu/mua-bu.component";

@Component({
  selector: 'app-dialog-chi-tiet-ke-hoach-giao-bo-nganh-ubtvqh-mua-bu-bo-sung',
  templateUrl: './dialog-chi-tiet-ke-hoach-giao-bo-nganh-ubtvqh-mua-bu-bo-sung.component.html',
  styleUrls: ['./dialog-chi-tiet-ke-hoach-giao-bo-nganh-ubtvqh-mua-bu-bo-sung.component.scss']
})
export class DialogChiTietKeHoachGiaoBoNganhUbtvqhMuaBuBoSungComponent implements OnInit {

  @ViewChild('keHoachMuaBu') kehoachmuaBu: MuaBuComponent;
  isView: boolean = false;
  errorBn: boolean = false;
  keHoach: any = {
    id: null,
    maBoNganh: null,
    tenBoNganh: null,
    tongTien: null,
    idMuaQdUbtvqh: null,
    ttMuaBu: null,
    ttMuaBsung: null,
    muaBuList: [],
    muaBsungList: []
  }
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
    if (this.validateData()) {
      this.keHoach.tongTien = this.keHoach.ttMuaBsung + this.keHoach.ttMuaBu;
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
    return true;
  }

  onCancel() {
    this._modalRef.close();
  }
}
