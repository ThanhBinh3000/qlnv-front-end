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
import { DanhMucService } from "../../../services/danhmuc.service";

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
  expandSet = new Set<number>();
  tenCloaiVthh: string;
  namKhoach: string;
  isReadOnly?: boolean = false;
  disabledGoiThau: boolean = false;
  thongTinChiCuc: DanhSachGoiThau = new DanhSachGoiThau();
  thongTinDiemKho: DanhSachGoiThau = new DanhSachGoiThau();
  listThongTinDiemKho: any[] = [];
  listGoiThau = [];
  dataAll: any[] = [];
  selectedGoiThau: any;

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
      maDvi: [null],
      tenDvi: [null],
      goiThau: [null, [Validators.required]],
      tenCcuc: [null],
      donGiaVat: [0],
      soLuongDaMua: [null],
      soLuongChiTieu: [null],
      soLuong: [null],
      thanhTien: [null],
      bangChu: [null],
      children: [null],
      diaDiemNhap: [null],
      donGiaTamTinh: [],
      thanhTienDx: [],
      tenCloaiVthh: [],
    });
  }

  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  listAllDiemKho: any[] = [];

  async ngOnInit() {
    this.userInfo = await this.userService.getUserLogin();
    this.initForm();
    this.getGiaToiDa();
    this.updateEditCache();
    this.disableChiCuc();
  }

  save() {
    if (this.formData.get('goiThau').value == null) {
      this.notification.error(MESSAGE.ERROR, "Tên gói thầu không được để trống.")
      return;
    }
    if (this.listOfData.length <= 0) {
      this.notification.error(MESSAGE.ERROR, "Địa điểm nhập hàng và số lượng không được để trống.")
      return;
    }
    if (this.validateGiaDeXuat()) {
      this.listOfData.forEach(item => {
        let dataDiemNhap = '';
        item.children.forEach(child => {
          dataDiemNhap += child.tenDvi + "(" + child.soLuong + "), "
        })
        item.diaDiemNhap = dataDiemNhap.substring(0, dataDiemNhap.length - 2)
        item.donGiaTamTinh = this.formData.get('donGiaTamTinh').value;
        item.goiThau = this.formData.get('goiThau').value;
        item.donGiaVat = this.formData.get('donGiaVat').value;
      })
      this.formData.patchValue({
        children: this.listOfData,
        // diaDiemNhap: dataDiemNhap.substring(0, dataDiemNhap.length - 2)
      })
      this._modalRef.close(this.formData);
    }
  }

  onCancel() {
    this._modalRef.destroy();
  }

  initForm() {
    this.thongtinDauThau = new DanhSachGoiThau();
    this.loadDonVi();
    if (this.dataEdit.length > 0) {
      this.formDataPatchValue();
    } else {
      this.formData.patchValue({
        donGiaVat: this.donGiaVat,
        tenCloaiVthh: this.tenCloaiVthh
      })
      this.formattedDonGiaVat = this.formData.get('donGiaVat') ? formatNumber(this.formData.get('donGiaVat').value, 'vi_VN', '1.0-1') : '';
    }
    // this.checkDisabledSave();
  }

  async loadDonVi() {
    this.listChiCuc = [];
    let body = {
      trangThai: "01",
      maDviCha: this.userInfo.MA_DVI
    };
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
    let res = await this.dxuatKhLcntService.getGiaBanToiDa(this.cloaiVthh, this.userInfo.MA_DVI, this.namKhoach);
    if (res.msg === MESSAGE.SUCCESS) {
      this.giaToiDa = res.data;
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

  formDataPatchValue() {
    this.formData.patchValue({
      goiThau: this.dataEdit[0].goiThau,
      donGiaVat: this.dataEdit[0].donGiaVat,
      donGiaTamTinh: this.dataEdit[0].donGiaTamTinh,
      tenCloaiVthh: this.tenCloaiVthh
    })
    this.formattedDonGiaVat = this.formData.get('donGiaVat') ? formatNumber(this.formData.get('donGiaVat').value, 'vi_VN', '1.0-1') : '';
    this.dataEdit.forEach(item => {
      item.children.forEach(i => {
        this.listOfData.push(i)
      })
    })
    this.listOfData.forEach((item) => {
      item.children.forEach((i) => {
        i.thanhTienDx = i.soLuong * this.formData.get('donGiaTamTinh').value
        i.thanhTienQd = i.soLuong * this.formData.get('donGiaVat').value
      })

    })
    this.calcTong()
  }

  changeGoiThau() {
    let data = [];
    this.dataEdit = [];
    this.listOfData = [];
    if (this.formData.get('goiThau') && this.formData.get('goiThau').value != null && this.formData.get('goiThau').value != '') {
      this.dataAll.forEach(item => {
        if (item.goiThau == this.formData.get('goiThau').value) {
          data.push(item)
        }
      })
      this.dataEdit = data;
      this.formDataPatchValue();
      this.selectedGoiThau = this.formData.get('goiThau').value;
    }
  }

  async onChangeChiCuc(event) {
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
      this.thongTinChiCuc.tenDvi = res.data.tenTongKho;
      this.thongTinChiCuc.soLuongDaMua = soLuongDaLenKh.data;
      this.thongTinChiCuc.soLuongTheoChiTieu = chiCuc.soLuongNhap;
      this.thongTinChiCuc.tenDvi = chiCuc.tenDonVi;
      for (let i = 0; i < res.data?.child.length; i++) {
        const item = {
          'value': res.data.child[i].maDiemkho,
          'text': res.data.child[i].tenDiemkho,
          'diaDiemNhap': res.data.child[i].diaDiemNhap,
        };
        this.listDiemKho.push(item);
      }
    }
  }

  async addChiCuc() {
    await this.onChangeChiCuc(this.thongTinChiCuc.maDvi);
    if (this.validateDataAdd('chiCuc')) {
      if (this.thongTinChiCuc.maDvi) {
        this.thongTinChiCuc.children = [];
        this.listOfData = [...this.listOfData, this.thongTinChiCuc];
        this.formData.patchValue({
          tenDvi: this.thongTinChiCuc.tenDvi,
          soLuongChiTieu: this.thongTinChiCuc.soLuongTheoChiTieu,
          soLuongDaMua: this.thongTinChiCuc.soLuongDaMua,
        });
        this.thongTinChiCuc = new DanhSachGoiThau();
        this.expandSet.clear();
        const maxIndex = this.listOfData.length > 0 ? this.listOfData.length - 1 : 0
        this.expandSet.add(maxIndex)
        this.listThongTinDiemKho.push(new DanhSachGoiThau());
        this.listAllDiemKho.push(this.listDiemKho);
        this.listDiemKho = [];
      } else {
        this.notification.error(MESSAGE.ERROR, "Vui lòng nhập đủ thông tin");
      }
    }
  }

  addDiemKho(i) {
    if (this.validateDataAdd('diemKho', i)) {
      if (this.listThongTinDiemKho[i].maDvi && this.listThongTinDiemKho[i].soLuong) {
        if (this.validateSlChiCuc(i)) {
          let dataDvi = this.listAllDiemKho[i].filter(d => d.value == this.listThongTinDiemKho[i].maDvi);
          this.listThongTinDiemKho[i].tenDvi = dataDvi[0].text;
          this.listThongTinDiemKho[i].diaDiemNhap = dataDvi[0].diaDiemNhap;
          this.listOfData[i].children = [...this.listOfData[i].children, this.listThongTinDiemKho[i]];
          let soLuong: number = 0;
          this.listOfData[i].children.forEach(item => {
            soLuong = soLuong + item.soLuong
          });
          this.listOfData[i].soLuong = soLuong;
          this.formData.patchValue({
            soLuong: soLuong,
          })
          this.calcTong();
          this.listThongTinDiemKho[i] = new DanhSachGoiThau();
        }
      } else {
        this.notification.error(MESSAGE.ERROR, "Vui lòng nhập đủ thông tin");
      }
    }
    // this.checkDisabledSave();
  }

  validateDataAdd(type, index?): boolean {
    if (type == 'chiCuc') {
      let data = this.listOfData.filter(item => item.maDvi == this.thongTinChiCuc.maDvi);
      if (data.length > 0) {
        this.notification.error(MESSAGE.ERROR, "Đơn vị đã tồn tại, xin vui lòng thêm đơn vị khác")
        return false
      }
      return true;
    }
    if (type == 'diemKho') {
      let data = this.listOfData[index].children.filter(item => item.maDvi == this.thongTinDiemKho.maDvi);
      if (data.length > 0) {
        this.notification.error(MESSAGE.ERROR, "Đơn vị đã tồn tại, xin vui lòng thêm đơn vị khác")
        return false
      }
      return true;
    }
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  deleteRow(i, y, z?) {
    if (i >= 0 && y >= 0 && z >= 0) {
      this.listOfData[i].children[y].children = this.listOfData[i].children[y].children.filter((d, index) => index !== z);
    } else if (i >= 0 && y >= 0) {
      this.listOfData[i].children = this.listOfData[i].children.filter((d, index) => index !== y);
    } else if (i >= 0) {
      this.listOfData = this.listOfData.filter((d, index) => index !== i);
      this.listAllDiemKho.splice(i, 1);
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

  validateSlChiCuc(i) {
    const soLuongConLai = this.formData.value.soLuongChiTieu - this.formData.value.soLuongDaMua
    let soLuong = 0
    this.listOfData[i].children.forEach(item => {
      soLuong = soLuong + item.soLuong
    });
    soLuong = soLuong + this.thongTinDiemKho.soLuong;
    if (soLuong > soLuongConLai) {
      this.notification.error(MESSAGE.ERROR, "Số lượng đã vượt quá chỉ tiêu ")
      return false
    } else {
      return true;
    }
  }

  validateGiaDeXuat() {
    if (this.giaToiDa == null) {
      this.notification.error(MESSAGE.ERROR, 'Bạn cần lập và trình duyệt phương án giá mua tối đa, giá bán tối thiểu trước. Chỉ sau khi có giá mua tối đa bạn mới thêm được địa điểm nhập kho vì giá mua đề xuất ở đây nhập vào phải <= giá mua tối đa.');
      return;
    } else if (this.formData.get('donGiaTamTinh').value > this.giaToiDa) {
      this.notification.error(MESSAGE.ERROR, "Đơn giá đề xuất không được lớn hơn giá tối đa (" + this.giaToiDa + " đ)")
      return false
    } else {
      return true;
    }
  }

  clearDiemKho(i) {
    this.listThongTinDiemKho[i].maDvi = null;
    this.listThongTinDiemKho[i].soLuong = null;
  }

  clearChiCuc() {
    this.thongTinChiCuc.maDvi = null
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
    this.formattedThanhTien = this.formData.get('thanhTien') ? formatNumber(this.formData.get('thanhTien').value, 'vi_VN', '1.0-1') : '0';
  }

  calculatorThanhTienDx() {
    this.formData.patchValue({
      thanhTienDx:
        +this.formData.get('soLuong').value *
        +this.formData.get('donGiaTamTinh').value,
    });
    this.formattedThanhTienDx = this.formData.get('thanhTienDx') ? formatNumber(this.formData.get('thanhTienDx').value, 'vi_VN', '1.0-1') : '0';
  }

  calculator() {
    this.thongtinDauThau.thanhTienDx = this.thongtinDauThau.soLuong * this.formData.get('donGiaTamTinh').value
    this.thongtinDauThau.thanhTienQd = this.thongtinDauThau.soLuong * this.formData.get('donGiaVat').value
  }
  calculatorEdit(i: number) {
    this.listOfData[i].thanhTienDx = this.listOfData[i].soLuong * this.formData.get('donGiaTamTinh').value
    this.listOfData[i].thanhTienQd = this.listOfData[i].soLuong * this.formData.get('donGiaTamTinh').value
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
        if (cur.soLuong == undefined && cur.soLuong == null) {
          cur.soLuong = 0
        }
        prev += cur.soLuong;
        return prev;
      }, 0);
      this.formData.get('soLuong').setValue(sum);
      this.formattedSoLuong = this.formData.get('soLuong') ? formatNumber(this.formData.get('soLuong').value, 'vi_VN', '1.0-1') : '0';
      this.calculatorThanhTien();
      this.calculatorThanhTienDx();
      return sum;
    }
  }
}
