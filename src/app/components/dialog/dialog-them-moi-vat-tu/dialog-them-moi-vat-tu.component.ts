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
import {QuyetDinhGiaCuaBtcService} from "../../../services/ke-hoach/phuong-an-gia/quyetDinhGiaCuaBtc.service";
import {CurrencyMaskInputMode} from "ngx-currency";
import {STATUS} from "../../../constants/status";
import {QuyetDinhGiaTCDTNNService} from "../../../services/ke-hoach/phuong-an-gia/quyetDinhGiaTCDTNN.service";
import {SoLuongNhapHangService} from "../../../services/qlnv-hang/nhap-hang/sl-nhap-hang.service";
import {cloneDeep} from 'lodash';
@Component({
  selector: 'dialog-them-moi-vat-tu',
  templateUrl: './dialog-them-moi-vat-tu.component.html',
  styleUrls: ['./dialog-them-moi-vat-tu.component.scss'],
})
export class DialogThemMoiVatTuComponent implements OnInit {
  maDvi: any;
  formData: FormGroup;
  thongtinDauThau: DanhSachGoiThau
  loaiVthh: any;
  cloaiVthh: any;
  dataChiTieu: any;
  dataEdit: any;
  listOfData: any[] = [];
  userInfo: UserLogin;
  donGiaVat: number = 0;
  formattedThanhTienDx: string = '0';
  formattedThanhTien: string = '0';
  formattedSoLuong: string = '0';
  formattedDonGiaVat: string = '';
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
  showFromQd: boolean = false;

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
    private dmDonViService: DonviService,
    private quyetDinhGiaCuaBtcService: QuyetDinhGiaCuaBtcService,
    private quyetDinhGiaTCDTNNService: QuyetDinhGiaTCDTNNService,
    private soLuongNhapHangService: SoLuongNhapHangService,
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
      thueVat: [],
    });
  }

  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  listAllDiemKho: any[] = [];
  listType = ["MLK", "DV"]
  amount = {
    allowZero: true,
    allowNegative: false,
    precision: 2,
    prefix: '',
    thousands: '.',
    decimal: ',',
    align: "left",
    nullable: true,
    min: 0,
    max: 1000000000000,
    inputMode: CurrencyMaskInputMode.NATURAL,
  }
  async ngOnInit() {
    this.userInfo = await this.userService.getUserLogin();
    this.initForm();
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
    // if (this.validateGiaDeXuat()) {
      this.listOfData.forEach(item => {
        item.goiThau = this.formData.get('goiThau').value;
      })
      this.formData.patchValue({
        children: this.listOfData,
      })
      this._modalRef.close(this.formData);
    // }
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
          item.diaDiemNhap = item.diaDiemNhap
          item.soLuongNhap = this.loaiVthh === LOAI_HANG_DTQG.GAO ? item.ntnGao : item.ntnThoc
        })
      }
      if (this.loaiVthh === LOAI_HANG_DTQG.MUOI) {
        this.listChiCuc = this.dataChiTieu.khMuoiDuTru.filter(item => item.nhapTrongNam > 0);
        this.listChiCuc.forEach(item => {
          item.maDvi = item.maDonVi
          item.tenDonVi = item.tenDonVi
          item.diaDiemNhap = item.diaDiemNhap
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

  async getGiaToiDa(maDvi?:any) {
    let body = {
      loaiGia: "LG01",
      namKeHoach: this.namKhoach,
      maDvi: maDvi,
      loaiVthh: this.loaiVthh,
      cloaiVthh: this.cloaiVthh
    }
    let res = await this.quyetDinhGiaCuaBtcService.getQdGiaLastestBtc(body);
    if (res.msg === MESSAGE.SUCCESS) {
      if (res.data && res.data.length > 0) {
        let data = res.data[0];
        if (data.giaQdDcBtcVat != null && data.giaQdDcBtcVat > 0) {
          this.thongTinChiCuc.giaToiDa = data.giaQdDcBtcVat
        } else {
          this.thongTinChiCuc.giaToiDa = data.giaQdBtcVat
        }
        this.formData.patchValue({
          thueVat: data.vat * 100
        })
      }
    }
  }

  async updateGiaToiDa(chiCuc?:any) {
    let body = {
      loaiGia: "LG01",
      namKeHoach: this.namKhoach,
      maDvi: chiCuc.maDvi,
      loaiVthh: this.loaiVthh,
      cloaiVthh: this.cloaiVthh
    }
    let res = await this.quyetDinhGiaCuaBtcService.getQdGiaLastestBtc(body);
    if (res.msg === MESSAGE.SUCCESS) {
      if (res.data && res.data.length > 0) {
        let data = res.data[0];
        if (data.giaQdDcBtcVat != null && data.giaQdDcBtcVat > 0) {
          chiCuc.giaToiDa = data.giaQdDcBtcVat
        } else {
          chiCuc.giaToiDa = data.giaQdBtcVat
        }
        this.formData.patchValue({
          thueVat: data.vat * 100
        })
      }
    }
  }

  formDataPatchValue() {
    if (this.dataEdit.length > 0) {
      this.formData.patchValue({
        goiThau: this.dataEdit[0].goiThau,
      })
    }
    this.formData.patchValue({
      tenCloaiVthh: this.tenCloaiVthh
    })
    this.dataEdit.forEach(item => {
      item.children.forEach(i => {
        this.listOfData.push(i)
      })
    })
    this.listAllDiemKho = [];
    this.updateListAllDiemKho()
    this.calcTong()
  }

  async updateListAllDiemKho() {
    for (let i = 0; i < this.listOfData.length; i++) {
      this.updateGiaToiDa(this.listOfData[i])
      let body = {
        maDvi: this.listOfData[i].maDvi,
        type: this.listType
      }
      const res = await this.donViService.layTatCaByMaDvi(body);
      if (res.msg == MESSAGE.SUCCESS) {
        const listDiemKho = [];
        for (let j = 0; j < res.data[0].children.length; j++) {
          const item = {
            'value': res.data[0].children[j].maDvi,
            'text': res.data[0].children[j].tenDvi,
            'diaDiemNhap': res.data[0].children[j].diaChi,
          };
          listDiemKho.push(item);
        }
        this.listAllDiemKho.push(listDiemKho);
        if(this.listOfData[i].children.length > 0) {
          this.listOfData[i].children.forEach((e) => {
            e.thanhTienDx = e.soLuong * this.listOfData[i].donGiaTamTinh * 1000
            e.thanhTien = e.soLuong * this.listOfData[i].donGia * 1000
            this.listThongTinDiemKho.push(new DanhSachGoiThau());
          })
        } else {
          this.listThongTinDiemKho.push(new DanhSachGoiThau());
        }
      }
    }
  }

  changeGoiThau(event?: any) {
    let data = [];
    this.dataEdit = [];
    this.listOfData = [];
    if (event.nzValue != '') {
      this.dataAll.forEach(item => {
        if (item.goiThau == event.nzValue) {
          data.push(item)
        }
      })
      this.dataEdit = data;
      this.formDataPatchValue();
      this.selectedGoiThau = event.nzValue;
    }
  }


  async onChangeChiCuc(event) {
    debugger
    let body = {
      maDvi: event,
      type: this.listType
    }
    let body1 = {
      year: this.namKhoach,
      loaiVthh: this.loaiVthh,
      maDvi: event
    }
    let soLuongDaLenKh = await this.soLuongNhapHangService.getSoLuongCtkhTheoQd(body1);
    let chiCuc = this.listChiCuc.filter(item => item.maDvi == event)[0];
    const res = await this.donViService.layTatCaByMaDvi(body);
    this.listDiemKho = [];
    if (res.msg == MESSAGE.SUCCESS) {
      this.thongTinChiCuc.soLuongDaMua = soLuongDaLenKh.data;
      this.thongTinChiCuc.soLuongTheoChiTieu = chiCuc.soLuongNhap;
      this.thongTinChiCuc.tenDvi = chiCuc.tenDonVi;
      for (let i = 0; i < res.data[0].children.length; i++) {
        const item = {
          'value': res.data[0].children[i].maDvi,
          'text': res.data[0].children[i].tenDvi,
          'diaDiemNhap': res.data[0].children[i].diaChi,
        };
        this.listDiemKho.push(item);
      }
    }
    console.log(res, 'aaa')
    let bodyPag = {
      namKeHoach: this.namKhoach,
      loaiVthh: this.loaiVthh,
      cloaiVthh: this.cloaiVthh,
      trangThai: STATUS.BAN_HANH,
      maDvi: event,
      loaiGia: 'LG03'
    }
    let pag = await this.quyetDinhGiaTCDTNNService.getPag(bodyPag)
    if (pag.msg == MESSAGE.SUCCESS && pag.data.length > 0) {
      const data = pag.data[0];
      console.log(data, 'aaa')
      let donGiaVatQd = 0;
      if (data != null && data.giaQdDcTcdtVat != null && data.giaQdDcTcdtVat > 0) {
        donGiaVatQd = data.giaQdDcTcdtVat
      } else {
        donGiaVatQd = data.giaQdTcdtVat
      }
      this.thongTinChiCuc.donGia = donGiaVatQd
    } else {
      this.thongTinChiCuc.donGia = null
    }
    this.getGiaToiDa(event)
  }

  async addChiCuc() {
    await this.onChangeChiCuc(this.thongTinChiCuc.maDvi);
    if (this.validateDataAdd('chiCuc') && this.validateSlChiCucAdd()) {
      if (this.thongTinChiCuc.maDvi) {
        this.thongTinChiCuc.children = [];
        this.listOfData = [...this.listOfData, this.thongTinChiCuc];
        this.formData.patchValue({
          tenDvi: this.thongTinChiCuc.tenDvi,
          soLuongChiTieu: this.thongTinChiCuc.soLuongTheoChiTieu,
          soLuongDaMua: this.thongTinChiCuc.soLuongDaMua,
          loaiVthh: this.loaiVthh,
          cloaiVthh: this.cloaiVthh,
        });
        this.thongTinChiCuc = new DanhSachGoiThau();
        this.expandSet.clear();
        const maxIndex = this.listOfData.length > 0 ? this.listOfData.length - 1 : 0
        this.expandSet.add(maxIndex)
        this.listThongTinDiemKho.push(new DanhSachGoiThau());
        this.listAllDiemKho.push(this.listDiemKho);
        this.listDiemKho = [];
        let soLuong: number = 0;
        this.listOfData.forEach(item => {
          soLuong = soLuong + item.soLuong
        });
        this.formData.patchValue({
          soLuong: soLuong,
        })
        this.calcTong();
      } else {
        this.notification.error(MESSAGE.ERROR, "Vui lòng nhập đủ thông tin");
      }
    }
  }
  validateSlChiCucAdd() {
    const soLuongConLai = this.thongTinChiCuc.soLuongTheoChiTieu - this.thongTinChiCuc.soLuongDaMua
    if (this.thongTinChiCuc.soLuong > soLuongConLai) {
      this.notification.error(MESSAGE.ERROR, "Số lượng đã vượt quá chỉ tiêu ")
      return false
    } else {
      return true;
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
  }

  validateDataAdd(type, index?): boolean {
    if (type == 'chiCuc') {
      let data = this.listOfData.filter(item => item.maDvi == this.thongTinChiCuc.maDvi);
      if (data.length > 0) {
        this.notification.error(MESSAGE.ERROR, "Đơn vị đã tồn tại, xin vui lòng thêm đơn vị khác")
        return false
      }
      if (this.showFromQd && this.thongTinChiCuc.donGiaTamTinh > this.thongTinChiCuc.giaToiDa) {
        this.notification.error(MESSAGE.ERROR, "Đơn giá đề xuất không được lớn hơn giá tối đa (" + this.thongTinChiCuc.giaToiDa + " đ)")
        return false
      }
      if (this.thongTinChiCuc.donGiaTamTinh == null) {
        this.notification.error(MESSAGE.ERROR, "Đơn giá đề xuất không được để trống.")
        return false;
      }
      return true;
    }
    if (type == 'diemKho') {
      let data = this.listOfData[index].children.filter(item => item.maDvi == this.listThongTinDiemKho[index].maDvi);
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
    this.calcTong()
  }

  validateSlChiCuc(i) {
    const soLuongConLai = this.listOfData[i].soLuongTheoChiTieu - this.listOfData[i].soLuongDaMua
    let soLuong = 0
    this.listOfData[i].children.forEach(item => {
      soLuong = soLuong + item.soLuong
    });
    soLuong = soLuong + this.listThongTinDiemKho[i].soLuong;
    if (soLuong > soLuongConLai) {
      this.notification.error(MESSAGE.ERROR, "Số lượng đã vượt quá chỉ tiêu ")
      return false
    } else {
      return true;
    }
  }

  validateSlChiCucEdit(i, y) {
    const soLuongConLai = this.listOfData[i].soLuongTheoChiTieu - this.listOfData[i].soLuongDaMua
    let soLuong = 0
    this.listOfData[i].children.forEach(item => {
      soLuong = soLuong + item.soLuong
    });
    soLuong = soLuong + this.listOfData[i].children[y].soLuongEdit - this.listOfData[i].children[y].soLuong;
    if (soLuong > soLuongConLai) {
      this.notification.error(MESSAGE.ERROR, "Số lượng đã vượt quá chỉ tiêu ")
      return false
    } else {
      return true;
    }
  }

  validateGiaDeXuat() {
    for (let chiCuc of this.listOfData) {
      if (chiCuc.giaToiDa == null) {
        this.notification.error(MESSAGE.ERROR, chiCuc.tenDvi + ': Bạn cần lập và trình duyệt phương án giá mua tối đa, giá bán tối thiểu trước. Chỉ sau khi có giá mua tối đa bạn mới thêm được địa điểm nhập kho vì giá mua đề xuất ở đây nhập vào phải <= giá mua tối đa.');
        return false;
      } else {
        return true;
      }
    }
  }

  clearDiemKho(i) {
    this.listThongTinDiemKho[i].maDvi = null;
    this.listThongTinDiemKho[i].soLuong = null;
  }

  clearChiCuc() {
    this.thongTinChiCuc.maDvi = null
    this.thongTinChiCuc.soLuong = null
  }

  calcTong() {
    if (this.listOfData) {
      let sum = 0;
      let thanhTienDx = 0;
      let thanhTien = 0;
      for (let chiCuc of this.listOfData) {
        if (chiCuc.soLuong == undefined && chiCuc.soLuong == null) {
          chiCuc.soLuong = 0
        }
        sum += chiCuc.soLuong
        thanhTienDx += chiCuc.soLuong * chiCuc.donGiaTamTinh * 1000
        thanhTien += chiCuc.soLuong * chiCuc.donGia * 1000
      }
      this.formData.patchValue({
        soLuong: sum,
        thanhTienDx: thanhTienDx,
        thanhTien: thanhTien
      });
      this.formattedSoLuong = this.formData.get('soLuong') ? formatNumber(this.formData.get('soLuong').value, 'vi_VN', '1.0-1') : '0';
      this.formattedThanhTien = this.formData.get('thanhTien') ? formatNumber(this.formData.get('thanhTien').value, 'vi_VN', '1.0-1') : '0';
      this.formattedThanhTienDx = this.formData.get('thanhTienDx') ? formatNumber(this.formData.get('thanhTienDx').value, 'vi_VN', '1.0-1') : '0';
      return sum;
    }
  }
  editRow(i, y) {
    this.listOfData[i].children[y].soLuongEdit = this.listOfData[i].children[y].soLuong;
    this.listOfData[i].children[y].edit = true;
  }

  saveEdit(i, y) {
    if (this.validateSlChiCucEdit(i, y)) {
      this.listOfData[i].children[y].soLuong = this.listOfData[i].children[y].soLuongEdit;
      let soLuong: number = 0;
      this.listOfData[i].children.forEach(item => {
        soLuong = soLuong + item.soLuong
      });
      this.listOfData[i].soLuong = soLuong;
      this.formData.patchValue({
        soLuong: soLuong,
      })
      this.calcTong();
      this.listOfData[i].children[y].edit = false;
    }
  }

  cancelEdit(i, y) {
    this.listOfData[i].children[y].edit = false;
  }

  editRowCc(i) {
    this.listOfData[i].donGiaTamTinhEdit = cloneDeep(this.listOfData[i].donGiaTamTinh);
    this.listOfData[i].edit = true;
  }

  saveEditCc(i) {
    if (this.validateEditCc(i)) {
      this.listOfData[i].donGiaTamTinh = cloneDeep(this.listOfData[i].donGiaTamTinhEdit);
      this.listOfData[i].edit = false;
    }
  }

  cancelEditCc(i) {
    this.listOfData[i].edit = false;
  }

  validateEditCc (i) {
    if (this.showFromQd && this.listOfData[i].donGiaTamTinhEdit > this.listOfData[i].giaToiDa) {
      this.notification.error(MESSAGE.ERROR, "Đơn giá đề xuất không được lớn hơn giá tối đa (" + this.listOfData[i].giaToiDa + " đ)")
      return false
    }
    if (this.listOfData[i].donGiaTamTinhEdit == null) {
      this.notification.error(MESSAGE.ERROR, "Đơn giá đề xuất không được để trống.")
      return false;
    }
    return true
  }
}
