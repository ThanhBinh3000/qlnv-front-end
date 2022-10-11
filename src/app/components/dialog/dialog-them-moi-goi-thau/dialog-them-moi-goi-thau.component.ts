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
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  thongtinDauThau: DanhSachGoiThau = new DanhSachGoiThau();
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
    private donviService: DonviService
  ) {
    this.formGoiThau = this.fb.group({
      goiThau: [null, [Validators.required]],
      loaiVthh: [null],
      tenLoaiVthh : [null],
      cloaiVthh: [null],
      tenCloaiVthh: [null],
      dviTinh: [this.dviTinh],
      soLuong: [null],
      donGia: [null, [Validators.required]],
      thanhTien: [null],
    });
    this.formGoiThau.controls['soLuong'].valueChanges.subscribe(value => {
      this.calendarThanhTien();
    });
    this.formGoiThau.controls['donGia'].valueChanges.subscribe(value => {
      this.calendarThanhTien();
    });
  }


  async ngOnInit() {
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
  }

  onChangeCloaiVthh($event){
    let cloaiSelected = this.listChungLoai.filter(item => item.ma == $event);
    this.formGoiThau.patchValue({
      tenCloaiVthh : cloaiSelected[0].ten
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
    body.children.forEach( item => item.donGia = body.donGia);
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

  addDiemKho() {
    if (this.thongtinDauThau.maDvi && this.thongtinDauThau.soLuong) {
      let dataDvi = this.listDonVi.filter(d => d.maDvi == this.thongtinDauThau.maDvi)
      this.thongtinDauThau.tenDvi = dataDvi[0].tenDvi;
      this.dataTable = [...this.dataTable, this.thongtinDauThau];
      let soLuong: number = 0;
      let diaDiemNhap: string = "";
      this.dataTable.forEach(item => {
        soLuong = soLuong + item.soLuong,
          diaDiemNhap = diaDiemNhap + this.thongtinDauThau.tenDvi + "(" + this.thongtinDauThau.soLuong + "), "
      });
      this.formGoiThau.patchValue({
        soLuong: soLuong,
        diaDiemNhap: diaDiemNhap.substring(0, diaDiemNhap.length - 2)
      })
      this.thongtinDauThau = new DanhSachGoiThau();
    }
  }

  startEdit(i) {

  }

  deleteRow(i) {
    this.dataTable = this.dataTable.filter((item, index) => index !== i);
  }

  clearDiemKho() {

  }
}
