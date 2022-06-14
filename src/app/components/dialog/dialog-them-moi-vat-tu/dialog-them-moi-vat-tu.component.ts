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

@Component({
  selector: 'dialog-them-moi-vat-tu',
  templateUrl: './dialog-them-moi-vat-tu.component.html',
  styleUrls: ['./dialog-them-moi-vat-tu.component.scss'],
})
export class DialogThemMoiVatTuComponent implements OnInit {
  formData: FormGroup;
  thongtinDauThau: DanhSachGoiThau
  loaiVthh: any;
  dataChiTieu: any;
  donGia: any;
  errorInputRequired: string = 'Dữ liệu không được để trống.';
  listOfData: any[] = [];
  tableExist: boolean = false;
  selectedChiCuc: boolean = false;
  constructor(
    private _modalRef: NzModalRef,
    private fb: FormBuilder,
    public globals: Globals,
    private userService: UserService,
    private donViService: DonviService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private helperService: HelperService
  ) {
    this.formData = this.fb.group({
      id: [null],
      maDvi: [null, [Validators.required]],
      goiThau: [null, [Validators.required]],
      tenCcuc: [null],
      donGia: [null, [Validators.required]],
      soLuong: [null, [Validators.required]],
      thanhTien: [null],
      bangChu: [null],
      children: [null]
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
    this.formData.patchValue({
      children: this.listOfData
    })
    this._modalRef.close(this.formData);
  }

  onCancel() {
    this._modalRef.destroy();
  }
  initForm() {
    this.formData.get('donGia').setValue(this.donGia);
    this.thongtinDauThau = new DanhSachGoiThau();
    this.loadDonVi();
  }

  async loadDonVi() {
    this.listChiCuc = [];
    if (this.loaiVthh === LOAI_HANG_DTQG.GAO || this.loaiVthh === LOAI_HANG_DTQG.THOC) {
      this.listChiCuc = this.dataChiTieu.khLuongThucList.filter(item => item.maVatTu == this.loaiVthh);
    }
    if (this.loaiVthh === LOAI_HANG_DTQG.MUOI) {
      this.listChiCuc = this.dataChiTieu.khMuoiList.filter(item => item.maVatTu == this.loaiVthh);
    }

  }

  async changeChiCuc(event) {
    const res = await this.tinhTrangKhoHienThoiService.getChiCucByMaTongCuc(event)
    this.listDiemKho = [];
    if (res.msg == MESSAGE.SUCCESS) {
      for (let i = 0; i < res.data?.child.length; i++) {
        const item = {
          'value': res.data.child[i].maDiemkho,
          'text': res.data.child[i].tenDiemkho,
          'diaDiemNhap': res.data.child[i].diaChi,
        };
        this.listDiemKho.push(item);
        this.filterData();
      }
    }
  }

  filterData() {
    this.listOfData.forEach(data => {
      this.listDiemKho = this.listDiemKho.filter(item => item.value !== data.maDiemKho);
    })
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
        this.thongtinDauThau.diaDiemNhap = diemKho[0].diaDiemNhap;
      }
    }
  }

  addDiemKho() {
    if (this.thongtinDauThau.maDiemKho && this.thongtinDauThau.soLuong) {
      this.thongtinDauThau.donGia = this.formData.get('donGia').value;
      this.thongtinDauThau.goiThau = this.formData.get('goiThau').value;
      this.listOfData = [...this.listOfData, this.thongtinDauThau];
      this.updateEditCache;
      this.thongtinDauThau = new DanhSachGoiThau();
      this.disableChiCuc();
      this.filterData();
    }
  }

  clearDiemKho() {

  }

  reduceRowData(
    indexTable: number,
    indexCell: number,
    indexRow: number,
    stringReplace: string,
    idTable: string,
  ): number {
    let sumVal = 0;
    const listTable = document
      .getElementById(idTable)
      ?.getElementsByTagName('table');
    if (listTable && listTable.length >= indexTable) {
      const table = listTable[indexTable];
      for (let i = indexRow; i < table.rows.length - 1; i++) {
        if (
          table.rows[i]?.cells[indexCell]?.innerHTML &&
          table.rows[i]?.cells[indexCell]?.innerHTML != ''
        ) {
          sumVal =
            sumVal +
            parseFloat(this.helperService.replaceAll(table.rows[i].cells[indexCell].innerHTML, stringReplace, ''));
          this.formData.get('soLuong').setValue(sumVal);
        }
      }
    }
    return sumVal;
  }

  calculatorThanhTien() {
    this.formData.patchValue({
      thanhTien:
        +this.formData.get('soLuong').value *
        1000 *
        +this.formData.get('donGia').value,
    });
    this.formData.patchValue({
      bangChu: VNnum2words(+this.formData.get('thanhTien').value),
    });
  }

  editCache: { [key: string]: { edit: boolean; data: any } } = {};

  startEdit(index: number): void {
    this.editCache[index].edit = true;
  }

  cancelEdit(index: number): void {
    this.editCache[index].edit = false;
  }

  saveEdit(index: number): void {
    Object.assign(
      this.listOfData[index],
      this.editCache[index].data,
    );
    this.editCache[index].edit = false;
  }

  deleteRow(i: number): void {
    this.listOfData = this.listOfData.filter((d, index) => index !== i);
    this.disableChiCuc();
  }

  ngAfterViewChecked(): void {
    const table = document.getElementsByTagName('table');
    this.tableExist = table && table.length > 0 ? true : false;
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
}
