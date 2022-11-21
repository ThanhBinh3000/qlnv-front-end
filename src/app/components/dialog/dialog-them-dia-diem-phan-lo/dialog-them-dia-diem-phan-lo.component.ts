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
import { DeXuatKeHoachBanDauGiaService } from 'src/app/services/deXuatKeHoachBanDauGia.service';
import { DeXuatKhBanDauGiaService } from 'src/app/services/de-xuat-kh-ban-dau-gia.service';
import { DanhSachPhanLo } from 'src/app/models/KeHoachBanDauGia';
import { cloneDeep } from 'lodash';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { QuanLyHangTrongKhoService } from 'src/app/services/quanLyHangTrongKho.service';
@Component({
  selector: 'app-dialog-them-dia-diem-phan-lo',
  templateUrl: './dialog-them-dia-diem-phan-lo.component.html',
  styleUrls: ['./dialog-them-dia-diem-phan-lo.component.scss']
})
export class DialogThemDiaDiemPhanLoComponent implements OnInit {
  formData: FormGroup;
  thongtinPhanLo: DanhSachPhanLo;
  loaiVthh: any;
  dataChiTieu: any;
  dataEdit: any;
  listOfData: any[] = [];
  tableExist: boolean = false;
  selectedChiCuc: boolean = false;
  isValid: boolean = false;
  userInfo: UserLogin;
  giaKhongVat: number = 0;
  listDiemKhoEdit: any[] = [];
  khoanTienDatTruoc: number;
  namKh: number;
  constructor(
    private _modalRef: NzModalRef,
    private fb: FormBuilder,
    public globals: Globals,
    private userService: UserService,
    private donViService: DonviService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private helperService: HelperService,
    private deXuatKhBanDauGiaService: DeXuatKhBanDauGiaService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucService,
    private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,
  ) {
    this.formData = this.fb.group({
      id: [null],
      maDvi: [null, [Validators.required]],
      tenDvi: [null],
      maNhaKho: [null],
      tenNhakho: [null],
      maDiemKho: [null],
      tenDiemKho: [null],
      maNganKho: [null],
      tenNganKho: [null],
      maLoKho: [null],
      tenLoKho: [null],
      loaiVthh: [null],
      tenLoaiVthh: [null],
      cloaiVthh: [null],
      tenCloaiVthh: [null],
      maDviTsan: [null],
      soLuong: [null],
      dviTinh: [null],
      giaKhongVat: [null],
      giaKhoiDiem: [null],
      tienDatTruoc: [null],
      soLuongChiTieu: [null],
      soLuongKh: [null],
      duDau: [null],
      diaDiemKho: [null],
      children: [null],

    });
  }

  listChiCuc: any[] = [];
  listNhaKho: any[] = [];
  listDiemKho: any[] = [];
  listNganKho: any[] = [];
  listLoKho: any[] = []

  ngOnInit(): void {
    this.initForm();
    this.updateEditCache();
    this.disableChiCuc();
  }

  save() {
    if (this.validateSoLuong()) {
      let dataDiemNhap = '';
      this.listOfData.forEach(item => {
        dataDiemNhap += item.tenDiemKho + "(" + item.soLuong + "), "
      })
      this.formData.patchValue({
        children: this.listOfData,
        diaDiemNhap: dataDiemNhap.substring(0, dataDiemNhap.length - 2)
      })
      this._modalRef.close(this.formData);
      console.log(this.listOfData, 4444)
    }
  }


  onCancel() {
    this._modalRef.destroy();
  }

  initForm() {
    this.userInfo = this.userService.getUserLogin();
    this.thongtinPhanLo = new DanhSachPhanLo();
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

        soLuong: this.dataEdit.soLuong,
        giaKhongVat: this.dataEdit.giaKhongVat,
        giaKhoiDiem: this.dataEdit.giaKhoiDiem,
        maDviTsan: this.dataEdit.maDviTsan,
      })
      this.changeChiCuc(this.dataEdit.maDvi);
      this.listOfData = this.dataEdit.children
    } else {
      this.formData.patchValue({
        giaKhongVat: this.giaKhongVat,
      })
    }
    this.checkDisabledSave();
  }

  async loadDonVi() {
    this.listChiCuc = [];
    let body = {
      trangThai: "01",
      maDviCha: this.userInfo.MA_DVI
    };

    if (this.dataChiTieu) {
      if (this.loaiVthh === LOAI_HANG_DTQG.GAO || this.loaiVthh === LOAI_HANG_DTQG.THOC) {
        this.listChiCuc = this.dataChiTieu.khLuongThucList.filter(item => item.maVatTu == this.loaiVthh);
      }
      if (this.loaiVthh === LOAI_HANG_DTQG.MUOI) {
        this.listChiCuc = this.dataChiTieu.khMuoiList.filter(item => item.maVatTu == this.loaiVthh);
      }
    } else {
      // let res = await this.donViService.getAll(body);
      // if (res.msg === MESSAGE.SUCCESS) {
      //   this.listChiCuc = res.data;
      // }
    }
  }

  checkDisabledSave() {
    this.isValid = this.listOfData && this.listOfData.length > 0
  }

  async changeChiCuc(event) {
    let body = {
      namKh: 2022,
      loaiVthh: this.loaiVthh,
      maDvi: event
    }
    let soLuongDaLenKh = await this.deXuatKhBanDauGiaService.search(body);
    console.log(soLuongDaLenKh, 45545)
    let chiCuc = this.listChiCuc.filter(item => item.maDvi == event)[0];
    const res = await this.tinhTrangKhoHienThoiService.getChiCucByMaTongCuc(event)
    console.log(res, 11111)

    this.listDiemKho = [];
    if (res.msg == MESSAGE.SUCCESS) {
      this.formData.patchValue({
        tenDvi: res.data.tenTongKho,
        soLuongKh: soLuongDaLenKh.data,
        soLuongChiTieu: chiCuc.soLuongNhap
      })
      for (let i = 0; i < res.data?.child.length; i++) {
        const item = {
          'value': res.data.child[i].maDiemkho,
          'text': res.data.child[i].tenDiemkho,
          'diaDiemKho': res.data.child[i].diaChi,
          listDiemKhoEdit: res.data.child[i],
        };
        console.log(item, 6786767)
        this.listDiemKho.push(item);
      };
      this.thongtinPhanLo = new DanhSachPhanLo();
    }
  }

  changeDiemKho(index?) {
    if (index >= 0) {
      let diemKho = this.listDiemKho.filter(item => item.value == this.editCache[index].data.maDiemKho);
      if (diemKho.length > 0) {
        this.editCache[index].data.tenDiemKho = diemKho[0].text;
        this.editCache[index].data.diaDiemKho = diemKho[0].diaDiemKho
      }
      this.listNhaKho = [];
      for (let i = 0; i < diemKho[0].listDiemKhoEdit?.child.length; i++) {
        const item = {
          'value': diemKho[0].listDiemKhoEdit.child[i].maNhakho,
          'text': diemKho[0].listDiemKhoEdit.child[i].tenNhakho,
          listNganKhoEdit: diemKho[0].listDiemKhoEdit.child[i],
        };
        this.listNhaKho.push(item);
      };
      this.thongtinPhanLo = new DanhSachPhanLo();
    } else {
      let diemKho = this.listDiemKho.filter(item => item.value == this.thongtinPhanLo.maDiemKho);
      if (diemKho.length > 0) {
        this.thongtinPhanLo.tenDiemKho = diemKho[0].text;
        this.thongtinPhanLo.diaDiemKho = diemKho[0].diaDiemKho;
      }
      this.listNhaKho = [];
      for (let i = 0; i < diemKho[0].listDiemKhoEdit?.child.length; i++) {
        const item = {
          'value': diemKho[0].listDiemKhoEdit.child[i].maNhakho,
          'text': diemKho[0].listDiemKhoEdit.child[i].tenNhakho,
          listNganKhoEdit: diemKho[0].listDiemKhoEdit.child[i],
        };
        this.listNhaKho.push(item);
      };
    }
  }

  changeNhaKho(index?) {
    if (index >= 0) {
      let nhakho = this.listNhaKho.filter(item => item.value == this.editCache[index].data.maNhaKho);
      if (nhakho.length > 0) {
        this.editCache[index].data.tenNhakho = nhakho[0].text;
      }
      this.listNganKho = [];
      for (let i = 0; i < nhakho[0].listNganKhoEdit?.child.length; i++) {
        const item = {
          'value': nhakho[0].listNganKhoEdit.child[i].maNgankho,
          'text': nhakho[0].listNganKhoEdit.child[i].tenNgankho,
          listLoKhoEdit: nhakho[0].listNganKhoEdit.child[i],
        };
        this.listNganKho.push(item);
      };
      this.thongtinPhanLo = new DanhSachPhanLo();
    } else {
      let nhakho = this.listNhaKho.filter(item => item.value == this.thongtinPhanLo.maNhaKho);
      if (nhakho.length > 0) {
        this.thongtinPhanLo.tenNhakho = nhakho[0].text;
      }
      this.listNganKho = [];
      for (let i = 0; i < nhakho[0].listNganKhoEdit?.child.length; i++) {
        const item = {
          'value': nhakho[0].listNganKhoEdit.child[i].maNgankho,
          'text': nhakho[0].listNganKhoEdit.child[i].tenNgankho,
          listLoKhoEdit: nhakho[0].listNganKhoEdit.child[i],
        };
        this.listNganKho.push(item);
      };
    }
  }

  changeNganKho(index?) {
    if (index >= 0) {
      let nganKho = this.listNganKho.filter(item => item.value == this.editCache[index].data.maNganKho);
      if (nganKho.length > 0) {
        this.editCache[index].data.tenNganKho = nganKho[0].text;
      }
      for (let i = 0; i < nganKho[0].listLoKhoEdit?.child.length; i++) {
        const item = {
          'value': nganKho[0].listLoKhoEdit.child[i].maLokho,
          'text': nganKho[0].listLoKhoEdit.child[i].tenLokho,
        };
        this.listLoKho.push(item);
      };
      this.thongtinPhanLo = new DanhSachPhanLo();
    } else {
      let nganKho = this.listNganKho.filter(item => item.value == this.thongtinPhanLo.maNganKho);
      if (nganKho.length > 0) {
        this.thongtinPhanLo.tenNganKho = nganKho[0].text;
      }
      this.listLoKho = [];
      for (let i = 0; i < nganKho[0].listLoKhoEdit?.child.length; i++) {
        const item = {
          'value': nganKho[0].listLoKhoEdit.child[i].maNganlo,
          'text': nganKho[0].listLoKhoEdit.child[i].tenNganlo,
        };
        this.listLoKho.push(item);
      };
    }

  }

  async changeLoKho(index?) {

    if (index >= 0) {
      let loKho = this.listLoKho.filter(item => item.value == this.editCache[index].data.maLoKho);
      if (loKho.length > 0) {
        this.editCache[index].data.tenLoKho = loKho[0].text;
      }
    } else {
      let loKho = this.listLoKho.filter(item => item.value == this.thongtinPhanLo.maLoKho);
      if (loKho.length > 0) {
        this.thongtinPhanLo.tenLoKho = loKho[0].text;
        let body = {
          maDvi: this.thongtinPhanLo.maLoKho,
          loaiVthh: this.loaiVthh,
          nam: this.namKh,
        }
        const res = await this.quanLyHangTrongKhoService.getTrangThaiHt(body)
        console.log(res, 555)
        if (res.msg == MESSAGE.SUCCESS) {
          if (res.data) {
            this.thongtinPhanLo.cloaiVthh = res.data[0].cloaiVthh;
            this.thongtinPhanLo.tenCloaiVthh = res.data[0].tenCloaiVthh;
            this.thongtinPhanLo.duDau = res.data[0].duDau;
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      }
    }
  }

  addDiemKho() {
    if (this.thongtinPhanLo.maDiemKho && this.thongtinPhanLo.soLuong && this.validateSoLuong(true)) {
      this.thongtinPhanLo.giaKhongVat = this.formData.get('giaKhongVat').value;
      this.calculatorGiaKhoiDiem();
      this.thongtinPhanLo.giaKhoiDiem = this.formData.get('giaKhoiDiem').value;
      this.thongtinPhanLo.idVirtual = new Date().getTime();
      this.thongtinPhanLo.maDvi = this.formData.get('maDvi').value;
      this.listOfData = [...this.listOfData, this.thongtinPhanLo];
      this.updateEditCache();
      this.thongtinPhanLo = new DanhSachPhanLo();
      this.disableChiCuc();
      this.checkDisabledSave();
    }
  }

  validateSoLuong(isAdd?) {
    const soLuongConLai = this.formData.value.soLuongChiTieu - this.formData.value.soLuongKh
    let soLuong = 0
    if (isAdd) {
      soLuong += this.thongtinPhanLo.soLuong;
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

  calculatorGiaKhoiDiem() {
    this.formData.patchValue({
      giaKhoiDiem:
        +this.thongtinPhanLo.soLuong *
        +this.formData.get('giaKhongVat').value,
    });
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
      this.calculatorGiaKhoiDiem();
      return sum;
    }
  }
  calcTonKho() {
    if (this.listOfData) {
      const sum = this.listOfData.reduce((prev, cur) => {
        prev += cur.duDau;
        return prev;
      }, 0);
      this.formData.get('duDau').setValue(sum);
      return sum;
    }
  }

  calcGiaKhoiDiem() {
    if (this.listOfData) {
      const sum = this.listOfData.reduce((prev, cur) => {
        prev += cur.giaKhoiDiem;
        return prev;
      }, 0);
      this.formData.get('giaKhoiDiem').setValue(sum);
      return sum;
    }
  }
}
