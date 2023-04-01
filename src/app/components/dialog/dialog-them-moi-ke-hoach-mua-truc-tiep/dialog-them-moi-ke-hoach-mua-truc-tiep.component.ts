import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Globals } from 'src/app/shared/globals';
import { UserService } from 'src/app/services/user.service';
import { DonviService } from 'src/app/services/donvi.service';
import { MESSAGE } from 'src/app/constants/message';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { HelperService } from 'src/app/services/helper.service';
import { UserLogin } from 'src/app/models/userlogin';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { QuanLyHangTrongKhoService } from 'src/app/services/quanLyHangTrongKho.service';
import { DeXuatKhBanTrucTiepService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/de-xuat-kh-ban-truc-tiep.service';
import { DanhSachMuaTrucTiep } from 'src/app/models/DeXuatKeHoachMuaTrucTiep';
import { DanhSachMuaTrucTiepService } from 'src/app/services/danh-sach-mua-truc-tiep.service';


@Component({
  selector: 'app-dialog-them-moi-ke-hoach-mua-truc-tiep',
  templateUrl: './dialog-them-moi-ke-hoach-mua-truc-tiep.component.html',
  styleUrls: ['./dialog-them-moi-ke-hoach-mua-truc-tiep.component.scss']
})
export class DialogThemMoiKeHoachMuaTrucTiepComponent implements OnInit {
  formData: FormGroup;
  thongTinMuaTrucTiep: DanhSachMuaTrucTiep
  loaiVthh: any;
  dataChiTieu: any;
  dataEdit: any;
  listOfData: any[] = [];
  tableExist: boolean = false;
  selectedChiCuc: boolean = false;
  isValid: boolean = false;
  userInfo: UserLogin;
  listDiemKhoEdit: any[] = [];
  namKh: number;
  donGiaVat: number;

  listChiCuc: any[] = [];

  listDiemKho: any[] = [];


  constructor(
    private _modalRef: NzModalRef,
    private fb: FormBuilder,
    public globals: Globals,
    private userService: UserService,
    private donViService: DonviService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private helperService: HelperService,
    private deXuatKhBanTrucTiepService: DeXuatKhBanTrucTiepService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucService,
    private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,
    private danhSachMuaTrucTiepService: DanhSachMuaTrucTiepService,
  ) {
    this.formData = this.fb.group({
      id: [null],
      tenGoiThau: [null],
      maDvi: [null, [Validators.required]],
      tenDvi: [null],
      diaChi: [null],
      soLuongChiTieu: [null],
      soLuongKhDd: [null],
      donGia: [null],
      donGiaVat: [null],
      tongSoLuong: [null],
      tongThanhTien: [null],
      tongThanhTienVat: [null],
      soLuong: [null],
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
    this.thongTinMuaTrucTiep = new DanhSachMuaTrucTiep();
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
    if (this.dataChiTieu) {
      this.dataChiTieu.khLuongThuc?.forEach(item => {
        let body = {
          maDvi: item.maDonVi,
          tenDvi: item.tenDonvi,
          soLuongNhap: item.ntnThoc
        }
        this.listChiCuc.push(body)
      });
    } else {
      let body = {
        trangThai: "01",
        maDviCha: this.userService.isCuc() ? this.userInfo.MA_DVI : this.dataEdit.maDvi.slice(0, 6),
      };
      let res = await this.donViService.getAll(body);
      if (res.msg === MESSAGE.SUCCESS) {
        this.listChiCuc = res.data.filter(item => item.type == 'DV');
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
    const res = await this.donViService.getDonVi({ str: event })
    this.listDiemKho = [];
    if (res.msg == MESSAGE.SUCCESS) {
      this.formData.patchValue({
        tenDvi: res.data.tenDvi,
        diaChi: res.data.diaChi,
        soLuongKhDd: soLuongDaLenKh.data,
        soLuongChiTieu: chiCuc?.soLuongNhap * 1000
      })
      this.listDiemKho = res.data.children.filter(item => item.type == 'MLK');

      this.thongTinMuaTrucTiep = new DanhSachMuaTrucTiep();
      this.thongTinMuaTrucTiep.donGiaVat = this.donGiaVat;

    }
  }

  changeDiemKho(index?) {
    if (index >= 0) {
      let diemKho = this.listDiemKho.filter(item => item.value == this.editCache[index].data.maDiemKho);
      if (diemKho.length > 0) {
        this.editCache[index].data.tenDiemKho = diemKho[0].text;
        this.editCache[index].data.diaDiemNhap = diemKho[0].diaDiemKho
      }
    } else {
      let diemKho = this.listDiemKho.filter(item => item.maDvi == this.thongTinMuaTrucTiep.maDiemKho)[0];
      this.thongTinMuaTrucTiep.tenDiemKho = diemKho.tenDvi;
      this.thongTinMuaTrucTiep.diaDiemNhap = diemKho.diaChi;
    }
    this.thongTinMuaTrucTiep.donGia = this.formData.get('donGia').value;
    this.thongTinMuaTrucTiep.soLuong = this.formData.get('soLuong').value;

  }

  addDiemKho() {
    this.listOfData = [...this.listOfData, this.thongTinMuaTrucTiep];
    this.thongTinMuaTrucTiep = new DanhSachMuaTrucTiep();
    this.calcTongSLnhapTrucTiepDeXuat();
    this.calcTongThanhTienTrucTiep();
    this.calcTongThanhTienTheoDonGiaDd();
    this.updateEditCache();
    this.disableChiCuc();
    this.checkDisabledSave();
  }



  validateSoLuong(isAdd?) {
    return true;
    const soLuongConLai = this.formData.value.soLuongChiTieu - this.formData.value.soLuongKh
    let soLuong = 0
    if (isAdd) {
      soLuong += this.thongTinMuaTrucTiep.soLuong;
    }
    this.listOfData.forEach(item => {
      soLuong += item.soLuong
    })
    if (soLuong > soLuongConLai) {
      this.notification.error(MESSAGE.ERROR, "Số lượng đã vượt quá số lượng chỉ tiêu ")
      return false
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

  calcTongSLnhapTrucTiepDeXuat() {
    if (this.listOfData) {
      const sum = this.listOfData.reduce((prev, cur) => {
        prev += cur.soLuong;
        return prev;
      }, 0);
      this.formData.get('tongSoLuong').setValue(sum);
      return sum;
    }
  }

  calcTongThanhTienTrucTiep() {
    this.formData.patchValue({
      tongThanhTien:
        +this.formData.get('tongSoLuong').value *
        +this.formData.get('donGia').value,
    });
  }

  calcTongThanhTienTheoDonGiaDd() {
    this.formData.patchValue({
      tongThanhTienVat:
        +this.formData.get('tongSoLuong').value *
        +this.formData.get('donGiaVat').value,
    });
  }



}
