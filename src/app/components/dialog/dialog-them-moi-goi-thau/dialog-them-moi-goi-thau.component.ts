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
  listDonVi = [];
  listChiCuc = [];
  dataTable: any[] = [];
  thongtinDauThau: DanhSachGoiThau = new DanhSachGoiThau();
  thongTinDiemKho: DanhSachGoiThau = new DanhSachGoiThau();
  listDiemKho: any[] = [];
  listDiemKhoMap = {};

  listPhuongThucDauThau: any[] = [];
  listLoaiHopDong: any[] = [];
  listHinhThucDauThau: any[] = [];

  constructor(
    private _modalRef: NzModalRef,
    private fb: FormBuilder,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private helperService: HelperService,
    private notification: NzNotificationService,
    private donviService: DonviService,
    private spinner: NgxSpinnerService
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
      donGiaTamTinh: [null, [Validators.required]],
      maDvi: ['', [Validators.required]]
    });
    this.formGoiThau.controls['donGiaTamTinh'].valueChanges.subscribe(value => {
      this.validateRangPrice();
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
      this.listDonVi = res.data;
    }
  }

  async loadListDonVi2() {
    let body = {
      "trangThai": "01",
      "maDviCha": "0101"
    };
    let res = await this.donviService.getTreeAll(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDonVi = res.data[0].children;
    }
  }

  async onChangeCuc($event) {
    let body = {
      "trangThai": "01",
      "maDviCha": $event
    };
    let res = await this.donviService.getTreeAll(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listChiCuc = res.data[0].children;
    }
  }

  async onChangeChiCuc($event) {
    let chiCuc = this.listChiCuc.filter(item => item.maDvi == $event)[0];
    this.listDiemKho = chiCuc.children;
    this.listDiemKhoMap[$event] = this.listDiemKho;
    console.log(this.listDiemKhoMap);

  }

  validateRangPrice() {
    let value = +this.formGoiThau.get('donGiaTamTinh').value
    let priceMin = 200000;
    let priceMax = 500000;
    console.log(value);
    if (value > priceMax || value < priceMin) {
      this.notification.error(MESSAGE.ERROR, "Đơn giá đề xuất phải nằm trong khoảng giá tối thiểu - tối đa : " + priceMin + "đ - " + priceMax + "đ");
    }
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

  addChiCuc() {
    if (this.validateDataAdd('chiCuc')) {
      if (this.thongtinDauThau.maDvi && this.thongtinDauThau.soLuong) {
        let dataDvi = this.listChiCuc.filter(d => d.maDvi == this.thongtinDauThau.maDvi)
        this.thongtinDauThau.tenDvi = dataDvi[0].tenDvi;
        this.dataTable = [...this.dataTable, this.thongtinDauThau];
        let soLuong: number = 0;
        this.dataTable.forEach(item => {
          soLuong = soLuong + item.soLuong,
            item.children = [];
        });
        this.formGoiThau.patchValue({
          soLuong: soLuong
        });
        this.thongtinDauThau = new DanhSachGoiThau();
      } else {
        this.notification.error(MESSAGE.ERROR, "Vui lòng nhập đủ thông tin");
      }
    }
  }

  addDiemKho(i, maChiCuc) {
    if (this.validateDataAdd('diemKho')) {
      if (this.thongTinDiemKho.maDvi && this.thongTinDiemKho.soLuong) {
        let dataDvi = this.listDiemKhoMap[maChiCuc].filter(d => d.maDvi == this.thongTinDiemKho.maDvi);
        this.thongTinDiemKho.tenDvi = dataDvi[0].tenDvi;
        this.dataTable[i].children = [...this.dataTable[i].children, this.thongTinDiemKho];
        this.thongTinDiemKho = new DanhSachGoiThau();
      } else {
        this.notification.error(MESSAGE.ERROR, "Vui lòng nhập đủ thông tin");
      }
    }
  }

  validateDataAdd(type): boolean {
    if (type == 'chiCuc') {
      let data = this.dataTable.filter(item => item.maDvi == this.thongtinDauThau.maDvi);
      if (data.length > 0) {
        this.notification.error(MESSAGE.ERROR, "Đơn vị đã tồn tại, xin vui lòng thêm đơn vị khác")
        return false
      }
      return true;
    }
    if (type == 'diemKho') {
      let data = this.dataTable.filter(item => item.maDvi == this.thongtinDauThau.maDvi);
      if (data.length > 0) {
        this.notification.error(MESSAGE.ERROR, "Đơn vị đã tồn tại, xin vui lòng thêm đơn vị khác")
        return false
      }
      return true;
    }
  }

  startEdit(i) {

  }

  deleteRow(i) {
    this.dataTable = this.dataTable.filter((item, index) => index !== i);
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
}
