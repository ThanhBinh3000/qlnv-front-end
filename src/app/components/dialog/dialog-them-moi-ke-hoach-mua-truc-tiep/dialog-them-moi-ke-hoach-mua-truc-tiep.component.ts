import { DanhSachMuaTrucTiep } from './../../../models/DeXuatKeHoachMuaTrucTiep';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import VNnum2words from 'vn-num2words';
import { Globals } from 'src/app/shared/globals';
import { UserService } from 'src/app/services/user.service';
import { DonviService } from 'src/app/services/donvi.service';
import { MESSAGE } from 'src/app/constants/message';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { LOAI_HANG_DTQG } from 'src/app/constants/config';
import { HelperService } from 'src/app/services/helper.service';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhSachMuaTrucTiepService } from 'src/app/services/danh-sach-mua-truc-tiep.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dialog-them-moi-ke-hoach-mua-truc-tiep',
  templateUrl: './dialog-them-moi-ke-hoach-mua-truc-tiep.component.html',
  styleUrls: ['./dialog-them-moi-ke-hoach-mua-truc-tiep.component.scss']
})
export class DialogThemMoiKeHoachMuaTrucTiepComponent implements OnInit {
  formData: FormGroup;
  thongtinMuaTrucTiep: DanhSachMuaTrucTiep
  loaiVthh: any;
  dataChiTieu: any;
  dataEdit: any;
  listOfData: any[] = [];
  tableExist: boolean = false;
  selectedChiCuc: boolean = false;
  isValid: boolean = false;
  userInfo: UserLogin;
  donGiaVat: number = 0;
  namKh: number = 0;


  constructor(
    private _modalRef: NzModalRef,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    public globals: Globals,
    private userService: UserService,
    private donViService: DonviService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private helperService: HelperService,
    private danhSachMuaTrucTiepService: DanhSachMuaTrucTiepService,
    private notification: NzNotificationService,
  ) {
    this.formData = this.fb.group({
      id: [null],
      maDvi: [null, [Validators.required]],
      tenDvi: [null],
      maDiemKho: [null],
      tenDiemKho: [null],
      diaDiemNhap: [null],
      donGiaVat: [null],
      soLuong: [null],
      donGia: [null, [Validators.required]],
      thanhTien: [],
      tenGoiThau: [null, [Validators.required]],
      soLuongChiTieu: [null],
      soLuongKhDd: [null],
      tongThanhTienVat: [null],
      tongSoLuong: [null],
      tongThanhTien: [null],
      thanhTienVat: [null],
      tongDonGia: [null],
      loaiVthh: [null],
      cloaiVthh: [null],
      children: [null],
    });
  }

  listChiCuc: any[] = [];
  listDiemKho: any[] = [];

  ngOnInit(): void {
    this.initForm();
    this.updateEditCache();
    this.disableChiCuc();
  }

  async save() {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      await this.spinner.hide();
      return;
    }
    if (this.validateSoLuong()) {
      let dataDiemNhap = '';
      this.listOfData.forEach(item => {
        dataDiemNhap += item.tenDiemKho + "(" + item.soLuong + "), "
      })
      this.formData.patchValue({
        children: this.listOfData,
        tongThanhTien: this.listOfData[0].tongThanhTien,
        tongSoLuong: this.listOfData[0].tongSoLuong,
        tongDonGia: this.listOfData[0].tongDonGia,
        soLuongChiTieu: this.listOfData[0].soLuongChiTieu,
        soLuongKhDd: this.listOfData[0].soLuongKhDd,
        diaDiemNhap: dataDiemNhap.substring(0, dataDiemNhap.length - 2)
      })
      this._modalRef.close(this.formData);
      console.log(this.formData, 888)
    }
  }

  onCancel() {
    this._modalRef.destroy();
  }

  initForm() {
    this.userInfo = this.userService.getUserLogin();
    this.thongtinMuaTrucTiep = new DanhSachMuaTrucTiep();
    this.loadDonVi();
    if (this.dataEdit) {
      this.helperService.bidingDataInFormGroup(this.formData, this.dataEdit);
      this.changeChiCuc(this.dataEdit.maDvi);
      this.listOfData = this.dataEdit.children
    } else {
      this.formData.patchValue({
        donGiaVat: this.donGiaVat,
      })

    }
    this.checkDisabledSave();
  }


  async loadDonVi() {
    this.listChiCuc = [];
    let body = {
      trangThai: "01",
      maDviCha: this.userInfo.MA_DVI,
      type: [null, 'MLK']
    };

    if (this.dataChiTieu) {
      console.log(this.dataChiTieu, 7777)
      if (this.loaiVthh === LOAI_HANG_DTQG.THOC) {
        this.dataChiTieu.khLuongThuc?.forEach(item => {
          let body = {
            maDvi: item.maDonVi,
            tenDvi: item.tenDonvi,
            soLuongNhap: item.ntnThoc
          }
          this.listChiCuc.push(body)
        });
      }
    } else {
      let res = await this.donViService.getAll(body);
      if (res.msg === MESSAGE.SUCCESS) {
        this.listChiCuc = res.data;
        this.listChiCuc.map(v => Object.assign(v, { tenDonVi: v.tenDvi }))
      }
    }
  }

  checkDisabledSave() {
    this.isValid = this.listOfData && this.listOfData.length > 0
  }

  async changeChiCuc(event) {
    let body = {
      year: this.namKh,
      loaiVthh: this.loaiVthh,
      maDvi: event
    }
    let soLuongDaLenKh = await this.danhSachMuaTrucTiepService.getSoLuongAdded(body);
    let chiCuc = this.listChiCuc.filter(item => item.maDvi == event)[0];
    const res = await this.tinhTrangKhoHienThoiService.getChiCucByMaTongCuc(event)
    this.listDiemKho = [];
    if (res.msg == MESSAGE.SUCCESS) {
      this.formData.patchValue({
        tenDvi: res.data.tenTongKho,
        soLuongKhDd: soLuongDaLenKh.data,
        soLuongChiTieu: chiCuc?.soLuongNhap * 1000

      })
      for (let i = 0; i < res.data?.child.length; i++) {
        const item = {
          'value': res.data.child[i].maDiemkho,
          'text': res.data.child[i].tenDiemkho,
          'diaDiemNhap': res.data.child[i].diaChi,

        };
        this.listDiemKho.push(item);
      };
      this.thongtinMuaTrucTiep = new DanhSachMuaTrucTiep();
    }
  }

  changeDiemKho(index?) {
    if (index >= 0) {
      let diemKho = this.listDiemKho.filter(item => item.value == this.editCache[index].data.maDiemKho);
      if (diemKho.length > 0) {
        this.editCache[index].data.tenDiemKho = diemKho[0].text;
        this.editCache[index].data.diaDiemNhap = diemKho[0].diaDiemNhap;
      }
    } else {
      let diemKho = this.listDiemKho.filter(item => item.value == this.thongtinMuaTrucTiep.maDiemKho);
      if (diemKho.length > 0) {
        this.thongtinMuaTrucTiep.tenDiemKho = diemKho[0].text;
        this.thongtinMuaTrucTiep.diaDiemNhap = diemKho[0].diaDiemNhap;
      }
    }
  }

  async addDiemKho() {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      await this.spinner.hide();
      return;
    }
    if (this.thongtinMuaTrucTiep.maDiemKho && this.thongtinMuaTrucTiep.soLuong && this.validateSoLuong(true)) {
      this.thongtinMuaTrucTiep.donGia = this.formData.get('donGia').value;
      this.thongtinMuaTrucTiep.donGiaVat = this.donGiaVat;
      this.thongtinMuaTrucTiep.soLuongChiTieu = this.formData.get('soLuongChiTieu').value;
      this.thongtinMuaTrucTiep.soLuongKhDd = this.formData.get('soLuongKhDd').value;
      this.thongtinMuaTrucTiep.tenGoiThau = this.formData.get('tenGoiThau').value;
      this.thongtinMuaTrucTiep.idVirtual = new Date().getTime();
      this.thongtinMuaTrucTiep.maDvi = this.formData.get('maDvi').value;
      this.calculatorThanhTien()
      this.thongtinMuaTrucTiep.thanhTien = this.formData.get('thanhTien').value;
      this.calculatorThanhTienDaDuyet()
      this.thongtinMuaTrucTiep.thanhTienVat = this.formData.get('thanhTienVat').value;
      this.listOfData = [...this.listOfData, this.thongtinMuaTrucTiep];
      this.calculatorTongSoLuongDxMuaTt()
      this.thongtinMuaTrucTiep.tongSoLuong = this.formData.get('tongSoLuong').value;
      this.calculatorTongTienDx()
      this.thongtinMuaTrucTiep.tongThanhTien = this.formData.get('tongThanhTien').value;
      this.calculatorTongTienDxVat()
      this.thongtinMuaTrucTiep.tongThanhTienVat = this.formData.get('tongThanhTienVat').value;
      this.calculatorTongDonGia()
      this.thongtinMuaTrucTiep.tongDonGia = this.formData.get('tongDonGia').value;
      this.updateEditCache();
      this.thongtinMuaTrucTiep = new DanhSachMuaTrucTiep();
      this.disableChiCuc();
      // this.filterData();
      this.checkDisabledSave();

    }
  }

  validateSoLuong(isAdd?) {
    const soLuongConLai = this.formData.value.soLuongChiTieu - this.formData.value.soLuongKhDd
    let soLuong = 0
    if (isAdd) {
      soLuong += this.thongtinMuaTrucTiep.soLuong;
    }
    this.listOfData.forEach(item => {
      soLuong += item.soLuong
    })
    if (soLuong > soLuongConLai) {
      this.notification.error(MESSAGE.ERROR, "Số lượng đã vượt quá chỉ tiêu ")
      return false
    } else {
      return true;
    }
  }

  clearDiemKho() {

  }

  calculatorThanhTien() {
    this.formData.patchValue({
      thanhTien:
        +this.thongtinMuaTrucTiep.soLuong *
        +this.formData.get('donGia').value,
    });
  }

  calculatorThanhTienDaDuyet() {
    this.formData.patchValue({
      thanhTienVat:
        +this.thongtinMuaTrucTiep.soLuong *
        +this.donGiaVat,
    });
  }

  calculatorTongSoLuongDxMuaTt() {
    if (this.listOfData) {
      const sum = this.listOfData.reduce((prev, cur) => {
        prev += cur.soLuong;
        return prev;
      }, 0);
      this.formData.get('tongSoLuong').setValue(sum);
      return sum;
    }
  }

  calculatorTongTienDx() {
    if (this.listOfData) {
      const sum = this.listOfData.reduce((prev, cur) => {
        prev += cur.thanhTien;
        return prev;
      }, 0);
      this.formData.get('tongThanhTien').setValue(sum);
      return sum;
    }
  }

  calculatorTongTienDxVat() {
    if (this.listOfData) {
      const sum = this.listOfData.reduce((prev, cur) => {
        prev += cur.thanhTienVat;
        return prev;
      }, 0);
      this.formData.get('tongThanhTienVat').setValue(sum);
      return sum;
    }
  }

  calculatorTongDonGia() {
    if (this.listOfData) {
      const sum = this.listOfData.reduce((prev, cur) => {
        prev += cur.donGia;
        return prev;
      }, 0);
      this.formData.get('donGia').setValue(sum);
      return sum;
    }
  }





  editCache: { [key: string]: { edit: boolean; data: any } } = {};

  startEdit(index: number): void {
    this.listOfData[index].edit = true
  }

  cancelEdit(index: number): void {
    if (this.validateSoLuong()) {
      this.listOfData[index].edit = false
    }
  }

  saveEdit(index: number): void {
    if (this.validateSoLuong()) {
      this.listOfData[index].edit = false
    }
  }

  deleteRow(i: number): void {
    this.listOfData = this.listOfData.filter((d, index) => index !== i);
    this.disableChiCuc();
    this.checkDisabledSave();
  }

  updateEditCache(): void {
    this.listOfData.forEach((item, index) => {
      this.editCache[index] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  disableChiCuc() {
    if (this.listOfData.length > 0) {
      this.selectedChiCuc = true;
    } else {
      this.selectedChiCuc = false;
    }
  }

  calcTong() {
    if (this.listOfData) {
      const sum = this.listOfData.reduce((prev, cur) => {
        prev += cur.soLuong;
        return prev;
      }, 0);
      this.formData.get('soLuong').setValue(sum);

      return sum;
    }
  }
}
