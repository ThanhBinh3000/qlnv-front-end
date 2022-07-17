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
  formGoiThau: FormGroup;
  data?: any;
  listVatTu?= [];
  loaiVthh?: any;
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
  // isEmptyCl: boolean = false;

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
      tenVthh: [null],
      loaiVthh: [null],
      cloaiVthh: [null],
      tenCloaiVthh: [null],
      dviTinh: [null],
      soLuong: [null],
      donGia: [null, [Validators.required]],
      thanhTien: [null],
      hthucLcnt: [null, [Validators.required]],
      tenHthucLcnt: [null],
      pthucLcnt: [null, [Validators.required]],
      tenPthucLcnt: [null],
      tgianBdauThien: [null, [Validators.required]],
      loaiHdong: [null, [Validators.required]],
      tenLoaiHdong: [null],
      tgianThienHd: [null, [Validators.required]],
      diaDiemNhap: [null],
      nguonVon: [null],
      tenNguonVon: [null]
    });
    this.formGoiThau.controls['soLuong'].valueChanges.subscribe(value => {
      this.calendarThanhTien();
    });
    this.formGoiThau.controls['donGia'].valueChanges.subscribe(value => {
      this.calendarThanhTien();
    });
    this.formGoiThau.controls['hthucLcnt'].valueChanges.subscribe(value => {
      let data = this.listHinhThucDauThau.filter(item => item.ma === value)
      this.formGoiThau.get('tenHthucLcnt').setValue(data[0].giaTri);
    });
    this.formGoiThau.controls['pthucLcnt'].valueChanges.subscribe(value => {
      let data = this.listPhuongThucDauThau.filter(item => item.ma === value)
      this.formGoiThau.get('tenPthucLcnt').setValue(data[0].giaTri);
    });
    this.formGoiThau.controls['loaiHdong'].valueChanges.subscribe(value => {
      let data = this.listLoaiHopDong.filter(item => item.ma === value)
      this.formGoiThau.get('tenLoaiHdong').setValue(data[0].giaTri);
    });
  }

  async ngOnInit() {
    await Promise.all([
      this.phuongThucDauThauGetAll(),
      this.hinhThucDauThauGetAll(),
      this.loaiHopDongGetAll(),
      this.loadListDonVi(),
    ]);
    let res = await this.danhMucService.getDetail(this.loaiVthh);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listChungLoai = res.data.child;
      this.formGoiThau.patchValue({
        loaiVthh: res.data.ma,
        tenVthh: res.data.ten
      });
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    console.log(this.loaiVthh, this.data);

    this.initForm(this.data)
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

  async phuongThucDauThauGetAll() {
    this.listPhuongThucDauThau = [];
    let res = await this.danhMucService.phuongThucDauThauGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listPhuongThucDauThau = res.data;
    }
  }


  async hinhThucDauThauGetAll() {
    this.listHinhThucDauThau = [];
    let res = await this.danhMucService.hinhThucDauThauGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listHinhThucDauThau = res.data;
    }
  }

  async loaiHopDongGetAll() {
    this.listLoaiHopDong = [];
    let res = await this.danhMucService.loaiHopDongGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiHopDong = res.data;
    }
  }

  handleOk() {
    this.helperService.markFormGroupTouched(this.formGoiThau);
    if (this.formGoiThau.invalid) {
      return;
    }
    if (this.dataTable.length == 0) {
      this.notification.error(MESSAGE.ERROR, 'Danh sách địa điểm nhập không được để trống');
      return;
    }
    const body = this.formGoiThau.value;
    body.children = this.dataTable
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
