import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { uniqBy } from 'lodash';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { DanhSachGoiThau } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { Globals } from 'src/app/shared/globals';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { HelperService } from 'src/app/services/helper.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DonviService } from 'src/app/services/donvi.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DxuatKhLcntService } from "../../../services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/dxuatKhLcnt.service";

@Component({
  selector: 'dialog-them-moi-goi-thau',
  templateUrl: './dialog-them-moi-goi-thau.component.html',
  styleUrls: ['./dialog-them-moi-goi-thau.component.scss'],
})
export class DialogThemMoiGoiThauComponent implements OnInit {
  dviTinh: any
  formGoiThau: FormGroup;
  data?: any;
  listVatTu?= [];
  loaiVthh?: any;
  isReadOnly?: boolean = false;
  listChungLoai = [];
  listCuc = [];
  listChiCuc = [];
  dataTable: any[] = [];
  thongTinCuc: DanhSachGoiThau = new DanhSachGoiThau();
  thongTinChiCuc: DanhSachGoiThau = new DanhSachGoiThau();
  thongTinDiemKho: DanhSachGoiThau = new DanhSachGoiThau();

  listChiCucMap = {};
  listDiemKhoMap = {};


  listPhuongThucDauThau: any[] = [];
  listLoaiHopDong: any[] = [];
  listHinhThucDauThau: any[] = [];

  giaToiDa: any;

  constructor(
    private _modalRef: NzModalRef,
    private fb: FormBuilder,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private helperService: HelperService,
    private notification: NzNotificationService,
    private donviService: DonviService,
    private spinner: NgxSpinnerService,
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
      donGiaVat: [320000, [Validators.required]],
      donGiaTamTinh: [null],
      maDvi: ['']
    });
  }


  async ngOnInit() {
    // this.spinner.show();
    await Promise.all([
      this.loadListDonVi(),
    ]);
    let res = await this.danhMucService.getDetail(this.loaiVthh);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listChungLoai = res.data.child;
      this.formGoiThau.patchValue({
        loaiVthh: res.data.ma,
        tenVthh: res.data.ten,
        dviTinh: res.data.maDviTinh
      });
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.initForm(this.data)
    // this.spinner.hide();
  }

  onChangeCloaiVthh($event) {
    let cloaiSelected = this.listChungLoai.filter(item => item.ma == $event);
    this.getGiaToiDa($event);
    this.formGoiThau.patchValue({
      tenCloaiVthh: cloaiSelected[0].ten
    })
  }

  async loadListDonVi() {
    let body = {
      "trangThai": "01",
      "capDvi": "2"
    };
    let res = await this.donviService.getAll(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listCuc = res.data;
    }
  }

  async onChangeCuc($event) {
    let body = {
      "trangThai": "01",
      "maDviCha": $event
    };
    let res = await this.donviService.getTreeAll(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listChiCucMap[$event] = res.data[0].children;
      console.log(this.listChiCucMap);
    }
  }

  async onChangeChiCuc($event, maCuc) {
    let chiCuc = this.listChiCucMap[maCuc].filter(item => item.maDvi == $event)[0];
    this.listDiemKhoMap[$event] = chiCuc.children;
  }

  validateRangPrice() {
    let value = +this.formGoiThau.get('donGiaTamTinh').value
    let priceMax = this.giaToiDa;
    return value <= priceMax;
  }

  async initForm(dataDetail) {
    if (dataDetail) {
      this.formGoiThau.patchValue({
        goiThau: dataDetail.goiThau,
        cloaiVthh: dataDetail.cloaiVthh,
        diaDiemNhap: dataDetail.diaDiemNhap,
        donGia: dataDetail.donGia,
        dviTinh: dataDetail.dviTinh,
        loaiHdong: dataDetail.loaiHdong,
        hthucLcnt: dataDetail.hthucLcnt,
        pthucLcnt: dataDetail.pthucLcnt,
        soLuong: dataDetail.soLuong,
        tenDvi: dataDetail.tenDvi,
        tgianBdauThien: dataDetail.tgianBdauThien,
        tgianThienHd: dataDetail.tgianThienHd,
        maDvi: dataDetail.maDvi,
        nguonVon: dataDetail.nguonVon,
        tenNguonVon: dataDetail.tenNguonVon,
        thanhTien: dataDetail.thanhTien,
      })
      this.dataTable = dataDetail.children;
    }
  }

  handleOk() {
    this.helperService.markFormGroupTouched(this.formGoiThau);
    if (this.formGoiThau.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
      return;
    }
    if (this.dataTable.length == 0) {
      this.notification.error(MESSAGE.ERROR, 'Danh sách địa điểm nhập không được để trống');
      return;
    }
    if (this.giaToiDa == null) {
      this.notification.error(MESSAGE.ERROR, 'Chủng loại hàng hóa chưa có giá mua tối đa');
      return;
    }
    if (this.validateRangPrice()) {
      this.notification.error(MESSAGE.ERROR, 'Giá tạm tính phải nhỏ hơn giá mua tối đa (' + this.giaToiDa + ')');
      return;
    }
    const body = this.formGoiThau.value;
    body.children = this.dataTable
    body.children.forEach(item => item.donGia = body.donGia);
    this._modalRef.close(body);
  }

  handleCancel() {
    this._modalRef.close();
  }


  calendarThanhTien() {
    let soLuong = this.formGoiThau.get('soLuong') ? this.formGoiThau.get('soLuong').value : null;
    let donGia = this.formGoiThau.get('donGia') ? this.formGoiThau.get('donGia').value : null;
    if (soLuong && donGia) {
      this.formGoiThau.get('thanhTien').setValue(soLuong * donGia);
    }
  }

  addCuc() {
    if (this.validateDataAdd('cuc')) {
      if (this.thongTinCuc.maDvi && this.thongTinCuc.soLuong) {
        let dataDvi = this.listCuc.filter(d => d.maDvi == this.thongTinCuc.maDvi)
        this.thongTinCuc.tenDvi = dataDvi[0].tenDvi;
        this.thongTinCuc.children = [];
        this.dataTable = [...this.dataTable, this.thongTinCuc];
        let soLuong: number = 0;
        this.dataTable.forEach(item => {
          soLuong = soLuong + item.soLuong
        });
        this.formGoiThau.patchValue({
          soLuong: soLuong
        });
        this.thongTinCuc = new DanhSachGoiThau();
      } else {
        this.notification.error(MESSAGE.ERROR, "Vui lòng nhập đủ thông tin");
      }
    }
  }

  addChiCuc(i, maCuc) {
    if (this.validateDataAdd('chiCuc')) {
      if (this.thongTinChiCuc.maDvi && this.thongTinChiCuc.soLuong) {
        let dataDvi = this.listChiCucMap[maCuc].filter(d => d.maDvi == this.thongTinChiCuc.maDvi)
        this.thongTinChiCuc.tenDvi = dataDvi[0].tenDvi;
        this.thongTinChiCuc.children = [];
        this.dataTable[i].children = [...this.dataTable[i].children, this.thongTinChiCuc];
        this.thongTinChiCuc = new DanhSachGoiThau();
      } else {
        this.notification.error(MESSAGE.ERROR, "Vui lòng nhập đủ thông tin");
      }
    }
  }

  addDiemKho(i, y, maChiCuc) {
    if (this.validateDataAdd('diemKho')) {
      if (this.thongTinDiemKho.maDvi && this.thongTinDiemKho.soLuong) {
        let dataDvi = this.listDiemKhoMap[maChiCuc].filter(d => d.maDvi == this.thongTinDiemKho.maDvi);
        this.thongTinDiemKho.tenDvi = dataDvi[0].tenDvi;
        this.dataTable[i].children[y].children = [...this.dataTable[i].children[y].children, this.thongTinDiemKho];
        this.thongTinDiemKho = new DanhSachGoiThau();
      } else {
        this.notification.error(MESSAGE.ERROR, "Vui lòng nhập đủ thông tin");
      }
    }
  }

  validateDataAdd(type): boolean {
    if (type == 'cuc') {
      let data = this.dataTable.filter(item => item.maDvi == this.thongTinCuc.maDvi);
      if (data.length > 0) {
        this.notification.error(MESSAGE.ERROR, "Đơn vị đã tồn tại, xin vui lòng thêm đơn vị khác")
        return false
      }
      return true;
    }
    if (type == 'chiCuc') {
      let data = this.dataTable.filter(item => item.maDvi == this.thongTinChiCuc.maDvi);
      if (data.length > 0) {
        this.notification.error(MESSAGE.ERROR, "Đơn vị đã tồn tại, xin vui lòng thêm đơn vị khác")
        return false
      }
      return true;
    }
    if (type == 'diemKho') {
      let data = this.dataTable.filter(item => item.maDvi == this.thongTinDiemKho.maDvi);
      if (data.length > 0) {
        this.notification.error(MESSAGE.ERROR, "Đơn vị đã tồn tại, xin vui lòng thêm đơn vị khác")
        return false
      }
      return true;
    }
  }

  startEdit(i) {

  }

  deleteRow(i, y, z) {
    console.log(i, y, z);
    if (i >= 0 && y >= 0 && z >= 0) {
      // this.dataTable[i].children[y].children = this.dataTable[i].children[y].children.splice(z, 1);
      this.dataTable[i].children[y].children = this.dataTable[i].children[y].children.filter((d, index) => index !== z);
    } else if (i >= 0 && y >= 0) {
      // this.dataTable[i].children = this.dataTable[i].children.splice(y, 1);
      this.dataTable[i].children = this.dataTable[i].children.filter((d, index) => index !== y);
    } else if (i >= 0) {
      this.dataTable = this.dataTable.filter((d, index) => index !== i);
      // this.dataTable = this.dataTable.splice(i, 1);
    }
  }

  clearDiemKho() {

  }

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }
  expandSet2 = new Set<number>();
  onExpandChange2(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet2.add(id);
    } else {
      this.expandSet2.delete(id);
    }
  }

  async getGiaToiDa(ma: string) {
    let res = await this.dxuatKhLcntService.getGiaBanToiDa(ma);
    if (res.msg === MESSAGE.SUCCESS) {
      this.giaToiDa = res.data;
    }
  }
}
