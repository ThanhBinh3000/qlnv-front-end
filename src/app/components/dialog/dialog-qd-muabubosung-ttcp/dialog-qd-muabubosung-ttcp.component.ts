import {Component, OnInit, ViewChild} from '@angular/core';
import {MuaBuComponent} from "../dialog-chi-tiet-ke-hoach-giao-bo-nganh-ubtvqh-mua-bu-bo-sung/mua-bu/mua-bu.component";
import {NzModalRef} from "ng-zorro-antd/modal";
import {DanhMucService} from "../../../services/danhmuc.service";
import {Globals} from "../../../shared/globals";
import {MESSAGE} from "../../../constants/message";
import {MuabuBosungComponent} from "./muabu-bosung/muabu-bosung.component";

@Component({
  selector: 'app-dialog-qd-muabubosung-ttcp',
  templateUrl: './dialog-qd-muabubosung-ttcp.component.html',
  styleUrls: ['./dialog-qd-muabubosung-ttcp.component.scss']
})
export class DialogQdMuabubosungTtcpComponent implements OnInit {
  @ViewChild('keHoachMuaBu') kehoachmuaBuBoSung: MuabuBosungComponent;

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
