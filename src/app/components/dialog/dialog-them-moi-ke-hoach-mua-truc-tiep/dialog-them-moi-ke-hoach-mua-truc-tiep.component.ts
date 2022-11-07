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


  constructor(
    private _modalRef: NzModalRef,
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
      donGiaVat: [0, [Validators.required]],
      soLuongDxmtt: [null, [Validators.required]],
      diaDiemNhap: [null],
      maDiemKho: [null],
      soLuongCtieu: [null],
      listSlddDtl: [null],
      soLuongKhDd: [null],
    });
  }

  listChiCuc: any[] = [];
  listDiemKho: any[] = [];

  ngOnInit(): void {
    this.initForm();
    this.updateEditCache();
    this.disableChiCuc();
  }

  save() {
    if (this.validateSoLuong()) {
      let dataDiemNhap = '';
      this.listOfData.forEach(item => {
        dataDiemNhap += item.tenDiemKho + "(" + item.soLuongDxmtt + "), "
      })
      console.log(this.listOfData, 9090);
      this.formData.patchValue({
        listSlddDtl: this.listOfData,
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
    this.thongtinMuaTrucTiep = new DanhSachMuaTrucTiep();
    this.loadDonVi();
    if (this.dataEdit) {
      this.listChiCuc = [{
        maDvi: this.dataEdit.maDvi,
        tenDonVi: this.dataEdit.tenDvi,
        soLuongNhap: this.dataEdit.soLuongCtieu
      }]
      this.formData.patchValue({
        maDvi: this.dataEdit.maDvi,
        tenDvi: this.dataEdit.tenDvi,
        soLuongDxmtt: this.dataEdit.soLuongDxmtt,
        donGiaVat: this.dataEdit.donGiaVat,
        thanhTien: this.dataEdit.thanhTien,
      })
      this.changeChiCuc(this.dataEdit.maDvi);
      this.listOfData = this.dataEdit.ListSlddDtl
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
      year: 2022,
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
        soLuongCtieu: chiCuc.soLuongNhap
      })
      for (let i = 0; i < res.data?.child.length; i++) {
        const item = {
          'value': res.data.child[i].maDiemkho,
          'text': res.data.child[i].tenDiemkho,
          'diaDiemKho': res.data.child[i].diaChi,
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
        this.editCache[index].data.diaDiemKho = diemKho[0].diaDiemKho;
      }
    } else {
      let diemKho = this.listDiemKho.filter(item => item.value == this.thongtinMuaTrucTiep.maDiemKho);
      if (diemKho.length > 0) {
        this.thongtinMuaTrucTiep.tenDiemKho = diemKho[0].text;
        this.thongtinMuaTrucTiep.diaDiemKho = diemKho[0].diaDiemKho;
      }
    }
  }

  addDiemKho() {
    if (this.thongtinMuaTrucTiep.maDiemKho && this.thongtinMuaTrucTiep.soLuongDxmtt && this.validateSoLuong(true)) {
      this.thongtinMuaTrucTiep.donGiaVat = this.formData.get('donGiaVat').value;
      this.thongtinMuaTrucTiep.idDxKhmtt = new Date().getTime();
      this.thongtinMuaTrucTiep.maDvi = this.formData.get('maDvi').value;
      this.listOfData = [...this.listOfData, this.thongtinMuaTrucTiep];
      this.updateEditCache();
      this.thongtinMuaTrucTiep = new DanhSachMuaTrucTiep();
      this.disableChiCuc();
      // this.filterData();
      this.checkDisabledSave();

    }
  }

  validateSoLuong(isAdd?) {
    const soLuongConLai = this.formData.value.soLuongCtieu - this.formData.value.soLuongKhDd
    let soLuongDxmtt = 0
    if (isAdd) {
      soLuongDxmtt += this.thongtinMuaTrucTiep.soLuongDxmtt;
    }
    this.listOfData.forEach(item => {
      soLuongDxmtt += item.soLuongDxmtt
    })
    if (soLuongDxmtt > soLuongConLai) {
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
        +this.formData.get('soLuongDxmtt').value *
        +this.formData.get('donGiaVat').value * 1000,
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
        prev += cur.soLuongDxmtt;
        return prev;
      }, 0);
      this.formData.get('soLuongDxmtt').setValue(sum);
      this.calculatorThanhTien();
      return sum;
    }
  }
}
