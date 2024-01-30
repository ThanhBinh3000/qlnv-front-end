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
import { cloneDeep } from 'lodash';
import {AMOUNT, AMOUNT_ONE_DECIMAL, AMOUNT_TWO_DECIMAL} from "../../../Utility/utils";
import {QuyetDinhGiaCuaBtcService} from "../../../services/ke-hoach/phuong-an-gia/quyetDinhGiaCuaBtc.service";
import {STATUS} from "../../../constants/status";
import {QuyetDinhGiaTCDTNNService} from "../../../services/ke-hoach/phuong-an-gia/quyetDinhGiaTCDTNN.service";
import {CurrencyMaskInputMode} from "ngx-currency";
import {SoLuongNhapHangService} from "../../../services/qlnv-hang/nhap-hang/sl-nhap-hang.service";


@Component({
  selector: 'app-dialog-them-moi-ke-hoach-mua-truc-tiep',
  templateUrl: './dialog-them-moi-ke-hoach-mua-truc-tiep.component.html',
  styleUrls: ['./dialog-them-moi-ke-hoach-mua-truc-tiep.component.scss']
})
export class DialogThemMoiKeHoachMuaTrucTiepComponent implements OnInit {
  formData: FormGroup;
  thongTinMuaTrucTiep: DanhSachMuaTrucTiep
  loaiVthh: any;
  cloaiVthh: any;
  tenCloaiVthh: any;
  dataChiTieu: any;
  dataEdit: any;
  idQdHdr: any;
  maDviCuc: any;
  dataAll: any;
  listOfData: any[] = [];
  tableExist: boolean = false;
  selectedChiCuc: boolean = false;
  isValid: boolean = false;
  userInfo: UserLogin;
  thongTinMuaTrucTiepEdit: any[] = [];
  namKh: number;
  donGiaVat: number;
  giaToiDa: number;

  listChiCuc: any[] = [];

  listDiemKho: any[] = [];
  // amount = AMOUNT_TWO_DECIMAL;
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
  customPrecisionFn(value: string | number, precision?: number): number {
    return +Number(value).toFixed(precision! + 1);
  }

  constructor(
    private _modalRef: NzModalRef,
    private fb: FormBuilder,
    public globals: Globals,
    public userService: UserService,
    private donViService: DonviService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private helperService: HelperService,
    private deXuatKhBanTrucTiepService: DeXuatKhBanTrucTiepService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucService,
    private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,
    private danhSachMuaTrucTiepService: DanhSachMuaTrucTiepService,
    private quyetDinhGiaCuaBtcService: QuyetDinhGiaCuaBtcService,
    private quyetDinhGiaTCDTNNService: QuyetDinhGiaTCDTNNService,
    private soLuongNhapHangService: SoLuongNhapHangService,
  ) {
    this.formData = this.fb.group({
      id: [null],
      maDvi: [null, [Validators.required]],
      tenDvi: [null],
      diaChi: [null],
      soLuongChiTieu: [null],
      soLuongKhDd: [null],
      soLuongDaLenKhByIdQd: [null],
      donGia: [null],
      donGiaVat: [null],
      tongSoLuong: [null, [Validators.required]],
      tongThanhTien: [null],
      tongThanhTienVat: [null],
      soLuong: [null],
      tongSoLuongChuaTh: [''],
      dvt: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      donGiaTdVat: [''],
      thueVat: [''],
      maDonVi: ['']
    });
  }

  async ngOnInit() {
    await this.initForm();
    this.updateEditCache();
    this.disableChiCuc();
    // await this.getGiaToiDa(this.maDviCuc ? this.maDviCuc : this.userInfo.MA_DVI);
  }

  save() {
    if (this.validateSoLuong()) {
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        return;
      }
      if (this.formData.get('donGia').value > this.formData.get('donGiaTdVat').value) {
        this.notification.error(MESSAGE.ERROR, "Đơn giá đề xuất không được lớn hơn đơn giá tối đa được duyệt bao gồm VAT")
        return;
      }
      // if (this.formData.get('tongSoLuong').value > (this.formData.get('soLuongChiTieu').value - this.formData.get('soLuongKhDd').value)) {
      //   this.notification.error(MESSAGE.ERROR, "Số lượng đề xuất, phê duyệt không được lớn hơn số lượng chỉ tiêu kế hoạch")
      //   return;
      // }
      // if (this.listOfData.length == 0 && this.userService.isCuc()) {
      //   this.notification.error(MESSAGE.ERROR, "Danh sách điểm kho không được để trống")
      //   return;
      // }
      let data = this.formData.value;
      this.listOfData.forEach(item =>{
        item.donGia = data.donGia
      })
      data.children = this.listOfData;
      this._modalRef.close(data);
    }
  }

  onCancel() {
    this._modalRef.destroy();
  }

  async initForm() {
    debugger
    this.userInfo = this.userService.getUserLogin();
    this.thongTinMuaTrucTiep = new DanhSachMuaTrucTiep();
    await this.loadDonVi();
    // if(this.dataAll){
    //
    // }
    if (this.dataEdit) {
      this.helperService.bidingDataInFormGroup(this.formData, this.dataEdit);
      if(this.donGiaVat){
        this.formData.patchValue({
          donGiaVat: this.donGiaVat,
          tenCloaiVthh: this.tenCloaiVthh,
          cloaiVthh: this.cloaiVthh,
        })
      }
      let body = {
        year: this.namKh,
        loaiVthh: this.loaiVthh,
        maDvi: this.formData.value.maDvi,
        idQd: this.idQdHdr,
      }
      let soLuongDaLenKh = await this.soLuongNhapHangService.getSoLuongCtkhTheoQd(body);
      let soLuongDaLenKhByIdQd = await this.soLuongNhapHangService.getSoLuongCtkhTheoQdByIdQd(body);
      this.formData.value.soLuongKhDd = soLuongDaLenKh.data;
      this.formData.value.soLuongDaLenKhByIdQd = soLuongDaLenKhByIdQd.data;
      this.formData.value.tongSoLuongChuaTh = this.formData.value.soLuongChiTieu - this.formData.value.soLuongKhDd
      // this.changeChiCuc(this.dataEdit.maDvi);
      this.listOfData = this.dataEdit.children
    } else {
      this.formData.patchValue({
        donGiaVat: this.donGiaVat,
        tenCloaiVthh: this.tenCloaiVthh,
        cloaiVthh: this.cloaiVthh,
      })
    }
    this.checkDisabledSave();
  }

  async loadDonVi() {
    this.listChiCuc = [];
    if (this.dataAll && this.userService.isCuc()) {
      this.dataAll?.forEach(item => {
        console.log("item", item)
        let resChiTieu;
        resChiTieu = this.dataChiTieu.khLuongThuc.find(x => x.maDonVi == item.maDvi);
        console.log("resChiTieu ", resChiTieu)
        let body = {
          maDvi: item.maDvi,
          tenDvi: item.tenDvi,
          soLuongNhap: item.soLuongChiTieu,
          tongSoLuong: item.soLuong,
          donGiaVat: item.donGiaVat,
          tongThanhTien: item.tongThanhTien,
          tongThanhTienVat: item.tongThanhTienVat,
          donGia: item.donGia,
          children: item.children
        }
        this.listChiCuc.push(body)
      });
    } else {
      let body = {
        trangThai: "01",
        maDviCha: this.userService.isCuc() ? this.userInfo.MA_DVI : this.maDviCuc,
      };
      let res = await this.donViService.getAll(body);
      if (res.msg === MESSAGE.SUCCESS) {
        console.log(this.dataChiTieu, "this.dataChiTieu")
        this.listChiCuc = this.dataChiTieu.khLuongThuc.filter(x => x.ntnThoc != 0)
        this.listChiCuc.map(v => Object.assign(v, { tenDonVi: v.tenDvi }))
        console.log(this.listChiCuc, "this.listChiCuc")
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
      maDvi: event,
      idQd: this.idQdHdr,
    }
    await this.getGiaCuThe(event)
    await this.getGiaToiDa(event);
    let soLuongDaLenKh = await this.soLuongNhapHangService.getSoLuongCtkhTheoQd(body);
    let soLuongDaLenKhByIdQd = await this.soLuongNhapHangService.getSoLuongCtkhTheoQdByIdQd(body);
    let resChiTieu = this.dataChiTieu?.khLuongThuc.find(x => x.maDonVi == event);
    console.log(this.dataAll, "dataAll")
    let chiCuc = this.dataAll.find(item => item.maDvi == event);
    const res = await this.donViService.getDonVi({ str: event })
    this.listDiemKho = [];
    if (res.msg == MESSAGE.SUCCESS) {
      this.formData.patchValue({
        tenDvi: res.data.tenDvi,
        diaChi: res.data.diaChi,
        dvt: resChiTieu?.donViTinh,
        // maDonVi: res.data.maDvi,

        soLuongNhap: chiCuc?.soLuongNhap,
        tongSoLuong: chiCuc?.tongSoLuong,
        donGiaVat: chiCuc?.donGiaVat,
        tongThanhTien: chiCuc?.tongThanhTien,
        tongThanhTienVat: chiCuc?.tongThanhTienVat,
        donGia: chiCuc?.donGia,
      })
      if(soLuongDaLenKh && resChiTieu){
        this.formData.patchValue({
          soLuongKhDd: soLuongDaLenKh?.data,
          soLuongChiTieu: resChiTieu?.ntnThoc,
          soLuongDaLenKhByIdQd: soLuongDaLenKhByIdQd?.data,
          tongSoLuongChuaTh: resChiTieu?.ntnThoc - soLuongDaLenKh.data
        })
      }

      console.log("changeChiCuc", this.formData.value);
      // this.listOfData = chiCuc.children
      this.listDiemKho = res.data.children.filter(item => item.type == 'MLK');
      this.thongTinMuaTrucTiep = new DanhSachMuaTrucTiep();
    }
  }

  // async getGiaToiDa(ma: string) {
  //   let res = await this.dxuatKhLcntService.getGiaBanToiDa(ma, this.userInfo.MA_DVI, this.namKeHoach);
  //   if (res.msg === MESSAGE.SUCCESS) {
  //     this.giaToiDa = res.data;
  //   }
  // }

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
    if (this.validateSoLuong(true)) {
      this.thongTinMuaTrucTiep.donGia = this.formData.get('donGia').value;
      this.thongTinMuaTrucTiep.donGiaVat = this.formData.get('donGiaVat').value;
      this.thongTinMuaTrucTiep.tongSoLuongChuaTh = this.formData.get('soLuongChiTieu').value - this.formData.get('soLuongKhDd').value
      this.listOfData = [...this.listOfData, this.thongTinMuaTrucTiep];
      this.thongTinMuaTrucTiep = new DanhSachMuaTrucTiep();
      this.calcTongSLnhapTrucTiepDeXuat();
      this.calcTongThanhTienTrucTiep();
      this.calcTongThanhTienTheoDonGiaDd();
      this.updateEditCache();
      this.disableChiCuc();
      this.checkDisabledSave();
    }
  }

  calTongThanhTien() {
    console.log(111)
    this.calcTongThanhTienTrucTiep();
    this.calcTongThanhTienTheoDonGiaDd();
  }

  validateSoLuong(isAdd?) {
    let soLuongConLai = this.formData.value.soLuongChiTieu - this.formData.value.soLuongKhDd
    let soLuongConLaiByIdQd = 0
    let soLuong = 0
    if (isAdd) {
      soLuong += this.thongTinMuaTrucTiep.soLuong;
    }else{
      soLuong += this.formData.value.tongSoLuong
    }
    if(this.formData.value.soLuongDaLenKhByIdQd){
      soLuongConLaiByIdQd = this.formData.value.soLuongDaLenKhByIdQd
      soLuongConLai = soLuongConLai + soLuongConLaiByIdQd;
    }
    // this.listOfData.forEach(item => {
    //   soLuong += item.soLuong
    // })
    if (soLuong > soLuongConLai) {
      this.notification.error(MESSAGE.ERROR, "Số lượng đề xuất, phê duyệt không được lớn hơn số lượng chỉ tiêu kế hoạch ")
      return false
    }
    return true
  }
  validateSoLuongEdit(index) {
    const soLuongConLai = this.formData.value.soLuongChiTieu - this.formData.value.soLuongKhDd
    let soLuong = 0
    this.listOfData.forEach(item => {
      soLuong += item.soLuong
    })
    soLuong = soLuong - this.listOfData[index].soLuong + this.thongTinMuaTrucTiepEdit[index].soLuong
    if (soLuong > soLuongConLai) {
      this.notification.error(MESSAGE.ERROR, "Số lượng đã vượt quá số lượng chỉ tiêu ")
      return false
    }
    return true;
  }

  clearDiemKho() {
    this.thongTinMuaTrucTiep = new DanhSachMuaTrucTiep();
  }

  editCache: { [key: string]: { edit: boolean; data: any } } = {};

  startEdit(index: number): void {
    this.thongTinMuaTrucTiepEdit[index] = cloneDeep(this.listOfData[index]);
    this.listOfData[index].edit = true;
  }

  cancelEdit(index: number): void {
    this.listOfData[index].edit = false;
  }

  saveEdit(index: number): void {
    if (this.validateSoLuongEdit(index)) {
      this.thongTinMuaTrucTiepEdit[index].donGia = this.formData.get('donGia').value;
      this.thongTinMuaTrucTiepEdit[index].donGiaVat = this.formData.get('donGiaVat').value;
      this.listOfData[index] = this.thongTinMuaTrucTiepEdit[index];
      this.listOfData[index].edit = false;
      this.calcTongSLnhapTrucTiepDeXuat();
      this.calcTongThanhTienTrucTiep();
      this.calcTongThanhTienTheoDonGiaDd();
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
        +this.formData.value.tongSoLuong *
        +this.formData.value.donGia *1000,
    });
  }

  calcTongThanhTienTheoDonGiaDd() {
    this.formData.patchValue({
      tongThanhTienVat:
        +this.formData.value.tongSoLuong *
        +this.formData.value.donGiaVat *1000,
    });
  }

  async getGiaToiDa(maDvi?:any) {
    let dvi;
    if (maDvi != null) {
      dvi = maDvi;
    } else {
      dvi = this.userInfo.MA_DVI
    }
    let body = {
      loaiGia: "LG01",
      namKeHoach: this.namKh,
      maDvi: dvi,
      loaiVthh: this.loaiVthh,
      cloaiVthh: this.cloaiVthh
    }
    let res = await this.quyetDinhGiaCuaBtcService.getQdGiaLastestBtc(body);
    if (res.msg === MESSAGE.SUCCESS) {
      if (res.data) {
        console.log(res.data, "0000")
        let giaToiDa = 0;
        res.data.forEach(i => {
          let giaQdBtc = 0;
          if(i.giaQdDcBtcVat != null && i.giaQdDcBtcVat >0) {
            giaQdBtc = i.giaQdDcBtcVat
          } else {
            giaQdBtc = i.giaQdBtcVat
          }
          if (giaQdBtc > giaToiDa) {
            giaToiDa = giaQdBtc;
          }
          this.formData.patchValue({
            thueVat: i.vat * 100
          })
        })
        this.formData.get('donGiaTdVat').setValue(giaToiDa);
      }
    }
  }


  async getGiaCuThe(maDvi?:any){
    let dvi;
    if (maDvi != null) {
      dvi = maDvi;
    } else {
      dvi = this.userInfo.MA_DVI
    }
    let body = {
      loaiGia: "LG03",
      namKeHoach: this.namKh,
      maDvi: dvi,
      loaiVthh: this.loaiVthh,
      cloaiVthh: this.cloaiVthh
    }
    let pag = await this.quyetDinhGiaTCDTNNService.getPag(body)
    if (pag.msg == MESSAGE.SUCCESS && pag.data.length > 0) {
      const data = pag.data[0];
      let donGiaVatQd = 0;
      if (data != null && data.giaQdDcTcdtVat != null && data.giaQdDcTcdtVat > 0) {
        donGiaVatQd = data.giaQdDcTcdtVat
      } else {
        donGiaVatQd = data.giaQdTcdtVat
      }
      this.formData.patchValue({
        donGiaVat: donGiaVatQd
      })
    } else {
      this.formData.patchValue({
        donGiaVat: null
      })
    }
  }
}
