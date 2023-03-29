import { DanhSachGoiThau } from './../../../models/DeXuatKeHoachuaChonNhaThau';
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
import { DxuatKhLcntService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/dxuatKhLcnt.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { formatNumber } from "@angular/common";

@Component({
  selector: 'dialog-them-moi-vat-tu',
  templateUrl: './dialog-them-moi-vat-tu.component.html',
  styleUrls: ['./dialog-them-moi-vat-tu.component.scss'],
})
export class DialogThemMoiVatTuComponent implements OnInit {
  formData: FormGroup;
  thongtinDauThau: DanhSachGoiThau
  loaiVthh: any;
  cloaiVthh: any;
  dataChiTieu: any;
  dataEdit: any;
  listOfData: any[] = [];
  tableExist: boolean = false;
  selectedChiCuc: boolean = false;
  isValid: boolean = false;
  userInfo: UserLogin;
  donGiaVat: number = 0;
  giaToiDa: any;
  formattedThanhTienDx: string = '0';
  formattedThanhTien: string = '0';
  formattedSoLuong: string = '0';
  formattedDonGiaVat: string = '0';

  constructor(
    private _modalRef: NzModalRef,
    private fb: FormBuilder,
    public globals: Globals,
    private userService: UserService,
    private donViService: DonviService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private helperService: HelperService,
    private dxuatKhLcntService: DxuatKhLcntService,
    private notification: NzNotificationService,
  ) {
    this.formData = this.fb.group({
      id: [null],
      maDvi: [null, [Validators.required]],
      tenDvi: [null],
      goiThau: [null, [Validators.required]],
      tenCcuc: [null],
      donGiaVat: [0, [Validators.required]],
      soLuongDaMua: [null],
      soLuongChiTieu: [null],
      soLuong: [null, [Validators.required]],
      thanhTien: [null],
      bangChu: [null],
      children: [null],
      diaDiemNhap: [null],
      donGiaDx:[],
      thanhTienDx:[],
    });
  }

  listChiCuc: any[] = [];
  listDiemKho: any[] = [];

  ngOnInit(): void {
    this.initForm();
    this.getGiaToiDa();
    this.updateEditCache();
    this.disableChiCuc();
  }

  save() {
    if (this.validateSoLuong() && this.validateGiaDeXuat()) {
      let dataDiemNhap = '';
      this.listOfData.forEach(item => {
        dataDiemNhap += item.tenDiemKho + "(" + item.soLuong + "), "
      })
      this.formData.patchValue({
        children: this.listOfData,
        diaDiemNhap: dataDiemNhap.substring(0, dataDiemNhap.length - 2)
      })
      this._modalRef.close(this.formData);
    }
  }

  onCancel() {
    this._modalRef.destroy();
  }

  initForm() {
    this.userInfo = this.userService.getUserLogin();
    this.thongtinDauThau = new DanhSachGoiThau();
    this.loadDonVi();
    if (this.dataEdit) {
      this.listChiCuc = [{
        maDvi: this.dataEdit.maDvi,
        tenDonVi: this.dataEdit.tenDvi,
        soLuongNhap: this.dataEdit.soLuongChiTieu
      }]
      this.formData.patchValue({
        maDvi: this.dataEdit.maDvi,
        tenDvi: this.dataEdit.tenDvi,
        goiThau: this.dataEdit.goiThau,
        tenCcuc: this.dataEdit.tenCcuc,
        soLuong: this.dataEdit.soLuong,
        donGiaVat: this.dataEdit.donGiaVat,
        donGiaDx: this.dataEdit.donGiaDx,
        thanhTien: this.dataEdit.thanhTien,
      })
      this.formattedDonGiaVat = this.formData.get('donGiaVat') ? formatNumber(this.formData.get('donGiaVat').value, 'vi_VN', '1.0-1' ) : '0';
      this.changeChiCuc(this.dataEdit.maDvi);
      this.listOfData = this.dataEdit.children
      this.listOfData.forEach((item) => {
        item.thanhTienDx = item.soLuong * this.formData.get('donGiaDx').value
        item.thanhTienQd = item.soLuong * this.formData.get('donGiaVat').value
      })
    } else {
      this.formData.patchValue({
        donGiaVat: this.donGiaVat,
      })
      this.formattedDonGiaVat = this.formData.get('donGiaVat') ? formatNumber(this.formData.get('donGiaVat').value, 'vi_VN', '1.0-1' ) : '0';
    }
    this.checkDisabledSave();
  }

  async loadDonVi() {
    this.listChiCuc = [];
    let body = {
      trangThai: "01",
      maDviCha: this.userInfo.MA_DVI
    };
    console.log(this.dataChiTieu);
    if (this.dataChiTieu) {
      if (this.loaiVthh === LOAI_HANG_DTQG.GAO || this.loaiVthh === LOAI_HANG_DTQG.THOC) {
        this.listChiCuc = this.dataChiTieu.khLuongThuc.filter(item => this.loaiVthh === LOAI_HANG_DTQG.GAO ? item.ntnGao > 0 : item.ntnThoc > 0);
        this.listChiCuc.forEach(item => {
          item.maDvi = item.maDonVi
          item.tenDonVi = item.tenDonvi
          item.soLuongNhap = this.loaiVthh === LOAI_HANG_DTQG.GAO ? item.ntnGao : item.ntnThoc
        })
      }
      if (this.loaiVthh === LOAI_HANG_DTQG.MUOI) {
        this.listChiCuc = this.dataChiTieu.khMuoiDuTru.filter(item => item.nhapTrongNam > 0);
        this.listChiCuc.forEach(item => {
          item.maDvi = item.maDonVi
          item.soLuongNhap = item.nhapTrongNam
        })
      }
    } else {
      let res = await this.donViService.getAll(body);
      if (res.msg === MESSAGE.SUCCESS) {
        this.listChiCuc = res.data;
      }
    }
  }

  async getGiaToiDa() {
    let res = await this.dxuatKhLcntService.getGiaBanToiDa(this.cloaiVthh, this.userInfo.MA_DVI);
    if (res.msg === MESSAGE.SUCCESS) {
      this.giaToiDa = res.data ? res.data : '0';
    }
  }

  checkDisabledSave() {
    this.isValid = this.listOfData && this.listOfData.length > 0
  }

  async changeChiCuc(event) {
    let body = {
      year: 2022,
      loaiVthh: this.loaiVthh,
      maDvi: event
    }
    let soLuongDaLenKh = await this.dxuatKhLcntService.getSoLuongAdded(body);
    let chiCuc = this.listChiCuc.filter(item => item.maDvi == event)[0];
    const res = await this.tinhTrangKhoHienThoiService.getChiCucByMaTongCuc(event)
    this.listDiemKho = [];
    if (res.msg == MESSAGE.SUCCESS) {
      this.formData.patchValue({
        tenDvi: res.data.tenTongKho,
        soLuongDaMua: soLuongDaLenKh.data,
        soLuongChiTieu: chiCuc.soLuongNhap
      })
      for (let i = 0; i < res.data?.child.length; i++) {
        const item = {
          'value': res.data.child[i].maDiemkho,
          'text': res.data.child[i].tenDiemkho,
          'diaDiemNhap': res.data.child[i].diaChi,
        };
        this.listDiemKho.push(item);
      };
      this.thongtinDauThau = new DanhSachGoiThau();
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
      let diemKho = this.listDiemKho.filter(item => item.value == this.thongtinDauThau.maDiemKho);
      if (diemKho.length > 0) {
        this.thongtinDauThau.tenDiemKho = diemKho[0].text;
        this.thongtinDauThau.diaDiemNhap = diemKho[0].diaDiemNhap;
      }
    }
  }

  addDiemKho() {
    if (this.thongtinDauThau.maDiemKho && this.thongtinDauThau.soLuong && this.validateSoLuong(true)) {
      this.thongtinDauThau.donGiaVat = this.formData.get('donGiaVat').value;
      this.thongtinDauThau.goiThau = this.formData.get('goiThau').value;
      this.thongtinDauThau.idVirtual = new Date().getTime();
      this.thongtinDauThau.maDvi = this.formData.get('maDvi').value;
      this.calculatorTongThanhTien()
      this.listOfData = [...this.listOfData, this.thongtinDauThau];
      this.updateEditCache();
      this.thongtinDauThau = new DanhSachGoiThau();
      this.disableChiCuc();
      // this.filterData();
      this.checkDisabledSave();

    }
  }

  validateSoLuong(isAdd?) {
    const soLuongConLai = this.formData.value.soLuongChiTieu - this.formData.value.soLuongDaMua
    let soLuong = 0
    if (isAdd) {
      soLuong += this.thongtinDauThau.soLuong;
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

  validateGiaDeXuat() {
    if (this.formData.get('donGiaDx').value > this.giaToiDa) {
      this.notification.error(MESSAGE.ERROR, "Đơn giá đề xuất không được lớn hơn giá tối đa (" + this.giaToiDa + " đ)")
      return false
    } else {
      return true;
    }
  }

  clearDiemKho() {
    this.thongtinDauThau.maDiemKho = null;
    this.thongtinDauThau.diaDiemNhap = null;
    this.thongtinDauThau.soLuong = null;
    this.thongtinDauThau.thanhTienDx = null;
    this.thongtinDauThau.thanhTienQd = null;
  }

  calculatorThanhTien() {
    this.formData.patchValue({
      thanhTien:
        +this.formData.get('soLuong').value *
        +this.formData.get('donGiaVat').value,
    });
    this.formData.patchValue({
      bangChu: VNnum2words(+this.formData.get('thanhTien').value),
    });
    this.formattedThanhTien = this.formData.get('thanhTien') ? formatNumber(this.formData.get('thanhTien').value, 'vi_VN', '1.0-1' ) : '0';
  }

  calculatorThanhTienDx() {
    this.formData.patchValue({
      thanhTienDx:
        +this.formData.get('soLuong').value *
        +this.formData.get('donGiaDx').value,
    });
    this.formattedThanhTienDx = this.formData.get('thanhTienDx') ? formatNumber(this.formData.get('thanhTienDx').value, 'vi_VN', '1.0-1' ) : '0';
  }

  calculator() {
    this.thongtinDauThau.thanhTienDx = this.thongtinDauThau.soLuong * this.formData.get('donGiaDx').value
    this.thongtinDauThau.thanhTienQd = this.thongtinDauThau.soLuong * this.formData.get('donGiaVat').value
  }
  calculatorEdit(i: number) {
    this.listOfData[i].thanhTienDx = this.listOfData[i].soLuong * this.formData.get('donGiaDx').value
    this.listOfData[i].thanhTienQd = this.listOfData[i].soLuong * this.formData.get('donGiaDx').value
  }

  calculatorTongThanhTien () {
    this.calculatorThanhTien();
    this.calculatorThanhTienDx();
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
      this.formattedSoLuong = this.formData.get('soLuong') ? formatNumber(this.formData.get('soLuong').value, 'vi_VN', '1.0-1' ) : '0';
      this.calculatorThanhTien();
      this.calculatorThanhTienDx();
      return sum;
    }
  }
}
