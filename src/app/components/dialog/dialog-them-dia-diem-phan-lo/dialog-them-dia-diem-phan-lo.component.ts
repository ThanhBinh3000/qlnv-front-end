import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Globals } from 'src/app/shared/globals';
import { UserService } from 'src/app/services/user.service';
import { DonviService } from 'src/app/services/donvi.service';
import { MESSAGE } from 'src/app/constants/message';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { LOAI_HANG_DTQG } from 'src/app/constants/config';
import { HelperService } from 'src/app/services/helper.service';
import { UserLogin } from 'src/app/models/userlogin';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DanhSachPhanLo } from 'src/app/models/KeHoachBanDauGia';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { QuanLyHangTrongKhoService } from 'src/app/services/quanLyHangTrongKho.service';
import { DeXuatKhBanDauGiaService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/deXuatKhBanDauGia.service';
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
  listDiemKhoEdit: any[] = [];
  khoanTienDatTruoc: number;
  namKh: number;
  donGiaVat: number;

  listChiCuc: any[] = [];
  listNhaKho: any[] = [];
  listDiemKho: any[] = [];
  listNganKho: any[] = [];
  listLoKho: any[] = []

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
      diaChi: [null],
      tenDvi: [null],
      soLuong: [null],
      soLuongChiTieu: [null],
      soLuongKh: [null],
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.updateEditCache();
    this.disableChiCuc();
  }

  save() {
    if (this.validateSoLuong()) {
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        return;
      }
      if (this.listOfData.length == 0) {
        this.notification.error(MESSAGE.ERROR, "Danh sách điểm kho không được để trống")
        return;
      }
      let data = this.formData.value;
      data.children = this.listOfData;
      this._modalRef.close(data);
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
      maDviCha: this.userService.isCuc() ? this.userInfo.MA_DVI : this.dataEdit.maDvi.slice(0, 6),
      type: [null, 'MLK']
    };

    if (this.dataChiTieu) {
      if (this.loaiVthh === LOAI_HANG_DTQG.GAO || this.loaiVthh === LOAI_HANG_DTQG.THOC) {
        this.dataChiTieu.khLuongThuc?.forEach(item => {
          let body = {
            maDvi: item.maDonVi,
            tenDvi: item.tenDonvi,
            soLuongXuat: this.loaiVthh === LOAI_HANG_DTQG.GAO ? item.xtnTongGao : item.xtnTongThoc
          }
          this.listChiCuc.push(body)
        });
      }
      if (this.loaiVthh === LOAI_HANG_DTQG.MUOI) {
        this.dataChiTieu.khMuoiDuTru?.forEach(item => {
          let body = {
            maDvi: item.maDonVi,
            tenDvi: item.tenDonVi,
            soLuongXuat: item.xuatTrongNamMuoi
          }
          this.listChiCuc.push(body);
        });
      }
      if (this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU)) {
        let data = this.dataChiTieu.khVatTuXuat.filter(item => item.maVatTuCha == this.loaiVthh);
        data.forEach(item => {
          let body = {
            maDvi: item.maDvi,
            tenDvi: item.tenDonVi,
            soLuongXuat: item.soLuongNhap
          }
          this.listChiCuc.push(body);
        })
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
    // let body = {
    //   year: 2022,
    //   loaiVthh: this.loaiVthh,
    //   maDvi: event
    // }
    // let soLuongDaLenKh = await this.deXuatKhBanDauGiaService.getSoLuongAdded(body);
    let chiCuc = this.listChiCuc.filter(item => item.maDvi == event)[0];
    const res = await this.tinhTrangKhoHienThoiService.getChiCucByMaTongCuc(event)
    this.listDiemKho = [];
    if (res.msg == MESSAGE.SUCCESS) {
      this.formData.patchValue({
        tenDvi: res.data.tenTongKho,
        soLuongChiTieu: this.loaiVthh.startsWith('02') ? chiCuc?.soLuongXuat : chiCuc?.soLuongXuat * 1000,
      })
      for (let i = 0; i < res.data?.child.length; i++) {
        const item = {
          'value': res.data.child[i].maDiemkho,
          'text': res.data.child[i].tenDiemkho,
          'diaDiemKho': res.data.child[i].diaChi,
          listDiemKhoEdit: res.data.child[i],
        };
        this.listDiemKho.push(item);
      }
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
      }
      ;
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
      }
      ;
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
      }
      ;
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
      }
      ;
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
      }
      ;
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
      }
      ;
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
        if (res.msg == MESSAGE.SUCCESS) {
          if (res.data) {
            // this.thongtinPhanLo.cloaiVthh = res.data[0].cloaiVthh;
            // this.thongtinPhanLo.tenCloaiVthh = res.data[0].tenCloaiVthh;
            // this.thongtinPhanLo.duDau = res.data[0].duDau;
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      }
    }
  }

  addDiemKho() {
    if (this.validateDiemKho()) {
      this.listOfData = [...this.listOfData, this.thongtinPhanLo];
      this.thongtinPhanLo = new DanhSachPhanLo();
      this.formData.patchValue({
        soLuong: this.calcTong('soLuong')
      })
      this.updateEditCache();
      this.disableChiCuc();
      this.checkDisabledSave();
    }
  }

  validateDiemKho(): boolean {
    if (this.thongtinPhanLo.maDiemKho && this.thongtinPhanLo.maNhaKho && this.thongtinPhanLo.maNganKho && this.thongtinPhanLo.maDviTsan && this.thongtinPhanLo.soLuong && this.thongtinPhanLo.donGiaDeXuat) {
      let data = this.listOfData.filter(item => item.maDiemKho == this.thongtinPhanLo.maDiemKho && item.maNhaKho == this.thongtinPhanLo.maNhaKho && item.maNganKho == this.thongtinPhanLo.maNganKho);
      if (data.length > 0) {
        if (this.thongtinPhanLo.maLoKho) {
          let loKho = data.filter(x => x.maLoKho == this.thongtinPhanLo.maLoKho);
          if (loKho.length > 0) {
            this.notification.error(MESSAGE.ERROR, "Điểm kho, ngăn kho, lô kho đã tồn tại. Xin vui lòng chọn lại")
            return false;
          }
        } else {
          this.notification.error(MESSAGE.ERROR, "Điểm kho, ngăn kho, lô kho đã tồn tại. Xin vui lòng chọn lại")
          return false;
        }
      }
      return true;
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      return false
    }

  }

  validateSoLuong(isAdd?) {
    const soLuongConLai = this.formData.value.soLuongChiTieu - this.formData.value.soLuongKh
    const soLuong1 = this.thongtinPhanLo.duDau
    let soLuong = 0
    if (isAdd) {
      soLuong += this.thongtinPhanLo.soLuong;
    }
    this.listOfData.forEach(item => {
      soLuong += item.soLuong
    })
    if (soLuong > soLuongConLai) {
      this.notification.error(MESSAGE.ERROR, "Số lượng đã vượt quá số lượng chỉ tiêu ")
      return false
    }
    if (soLuong > soLuong1) {
      this.notification.error(MESSAGE.ERROR, "Số lượng đã vượt quá số lượng tồn kho ")
      return false

    } else {
      return true;
    }

  }

  clearDiemKho() {

  }

  editCache: { [key: string]: { edit: boolean; data: any } } = {};

  startEdit(index: number): void {
    this.listOfData[index].edit = true

  }

  cancelEdit(index: number): void {
    if (this.validateSoLuong()) {
      this.listOfData[index].edit = false
      this.formData.patchValue({
        soLuong: this.calcTong('soLuong')
      })
    }
  }

  saveEdit(index: number): void {
    if (this.validateSoLuong()) {
      this.listOfData[index].edit = false
      this.formData.patchValue({
        soLuong: this.calcTong('soLuong')
      })
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

  calcTong(column) {
    if (this.listOfData) {
      const sum = this.listOfData.reduce((prev, cur) => {
        if (column == 'tienDatTruocDduyet') {
          prev += (cur.soLuong * cur.donGiaVat * this.khoanTienDatTruoc / 100)
        } else {
          prev += cur[column];
        }
        return prev;
      }, 0);
      return sum;
    }
  }

}
