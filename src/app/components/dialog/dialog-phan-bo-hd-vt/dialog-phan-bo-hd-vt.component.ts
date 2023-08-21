import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NzModalRef} from "ng-zorro-antd/modal";
import {Globals} from "../../../shared/globals";
import {UserService} from "../../../services/user.service";
import {DonviService} from "../../../services/donvi.service";
import {DanhSachGoiThau} from "../../../models/DeXuatKeHoachuaChonNhaThau";
import {MESSAGE} from "../../../constants/message";
import {DxuatKhLcntService} from "../../../services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/dxuatKhLcnt.service";
import {UserLogin} from "../../../models/userlogin";
import {NzNotificationService} from "ng-zorro-antd/notification";

@Component({
  selector: 'app-dialog-phan-bo-hd-vt',
  templateUrl: './dialog-phan-bo-hd-vt.component.html',
  styleUrls: ['./dialog-phan-bo-hd-vt.component.scss']
})
export class DialogPhanBoHdVtComponent implements OnInit {
  formGoiThau: FormGroup;
  giaToiDa: any;
  data?: any;
  dviTinh: any;
  loaiVthh?: any;
  listChiCuc = [];
  dataTable: any[] = [];
  listChiCucMap: any[] = [];
  thongTinChiCuc: any[] = [];
  userInfo: UserLogin;
  namKeHoach: any;
  constructor(
    private _modalRef: NzModalRef,
    private fb: FormBuilder,
    public globals: Globals,
    private notification: NzNotificationService,
    private userService: UserService,
    private donViService: DonviService,
    private dxuatKhLcntService: DxuatKhLcntService,
  ) {
    this.formGoiThau = this.fb.group({
      goiThau: [null, [Validators.required]],
      loaiVthh: [null],
      tenLoaiVthh: [null],
      cloaiVthh: [null],
      tenCloaiVthh: [null],
      dviTinh: [this.dviTinh],
      soLuong: [null],
      donGiaVat: [null],
      maDvi: [''],
      soQdPdGiaCuThe: [''],
      ngayKyQdPdGiaCuThe: [''],
    });
  }

  async ngOnInit() {
    this.userInfo = this.userService.getUserLogin();
    await this.initForm();
    await this.getGiaToiDa();
  }

  async initForm() {
    if (this.data) {
      this.formGoiThau.patchValue({
        goiThau: this.data.goiThau,
        cloaiVthh: this.data.cloaiVthh,
        tenCloaiVthh: this.data.tenCloaiVthh,
        donGiaVat: this.data.donGiaNhaThau,
        soLuong: this.data.soLuong,
        dviTinh: this.data.dviTinh,
      })
      this.dataTable = this.data.children;
      for (let i = 0; i < this.dataTable.length; i++) {
        this.thongTinChiCuc[i] = new DanhSachGoiThau();
        await this.getListChiCuc(this.dataTable[i].maDvi, i)
      }
    }
  }

  async getListChiCuc(maCuc, index) {
    let body = {
      "trangThai": "01",
      "maDviCha": maCuc
    };
    let res = await this.donViService.getTreeAll(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listChiCucMap[index] = res.data[0].children.filter(item => item.type != 'PB');
    }
  }



  async getGiaToiDa() {
    let res = await this.dxuatKhLcntService.getGiaBanToiDa(this.data.cloaiVthh, this.userInfo.MA_DVI, this.namKeHoach);
    if (res.msg === MESSAGE.SUCCESS) {
      this.giaToiDa = res.data;
    }
  }

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  addChiCuc(i) {
    if (this.validateSoLuongChiCuc(i)){
      if (this.thongTinChiCuc[i].maDvi && this.thongTinChiCuc[i].soLuong) {
        let dataDvi = this.listChiCucMap[i].filter(d => d.maDvi == this.thongTinChiCuc[i].maDvi)
        this.thongTinChiCuc[i].tenDvi = dataDvi[0].tenDvi;
        this.dataTable[i].children = [...this.dataTable[i].children, this.thongTinChiCuc[i]];
        this.thongTinChiCuc[i] = new DanhSachGoiThau();
      } else {
        this.notification.error(MESSAGE.ERROR, "Vui lòng nhập đủ thông tin");
      }
    }
  }
  clearChiCuc(i){
    this.thongTinChiCuc[i] = new DanhSachGoiThau();
  }
  deleteRow(i,y){
    this.dataTable[i].children = this.dataTable[i].children.filter((d, index) => index !== y);
  }
  handleCancel(){
    this._modalRef.close();
  }
  handleOk(){
    const body = this.dataTable;
    body.forEach(item => item.donGia = this.formGoiThau.value.donGiaVat);
    this._modalRef.close(body);
  }

  validateSoLuongChiCuc(i) {
    if (this.dataTable[i].children.length > 0 && this.dataTable[i].children.find(item => item.maDvi == this.thongTinChiCuc[i].maDvi) != null) {
      this.notification.error(MESSAGE.ERROR, "Chi cục DTNN đã được phân bổ.")
      return false;
    }
    let slDaNhap = 0;
    this.dataTable[i].children.forEach(i => {
      slDaNhap += i.soLuong;
    })
    if ((slDaNhap + this.thongTinChiCuc[i].soLuong) > this.dataTable[i].soLuong) {
      this.notification.error(MESSAGE.ERROR, "Số lượng đã vượt quá chỉ tiêu.")
      return false;
    }
    return true;
  }
}
