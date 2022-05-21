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
import { I } from '@angular/cdk/keycodes';

@Component({
  selector: 'dialog-them-moi-vat-tu',
  templateUrl: './dialog-them-moi-vat-tu.component.html',
  styleUrls: ['./dialog-them-moi-vat-tu.component.scss'],
})
export class DialogThemMoiVatTuComponent implements OnInit {
  formData: FormGroup;
  thongtinDauThau: DanhSachGoiThau;
  errorInputRequired: string = 'Dữ liệu không được để trống.';
  constructor(
    private _modalRef: NzModalRef,
    private fb: FormBuilder,
    public globals: Globals,
    private userService: UserService,
    private donViService: DonviService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
  ) {}

  listChiCuc: any[] = [];
  listDiemKho: any[] = [];

  ngOnInit(): void {
    this.initForm();
  }

  save() {
    this._modalRef.close(this.formData);
  }

  onCancel() {
    this._modalRef.destroy();
  }
  initForm() {
    this.formData = this.fb.group({
      diaDiemNhap: [
        this.thongtinDauThau ? this.thongtinDauThau.diaDiemNhap : null,[Validators.required]
      ],
      maCcuc: [
        this.thongtinDauThau ? this.thongtinDauThau.maCcuc : null,[Validators.required]
      ],
      tenCcuc:[null],
      maDiemKho: [
        this.thongtinDauThau ? this.thongtinDauThau.maDiemKho : null,[Validators.required]
      ],
      tenDiemKho:[null],
      donGia: [this.thongtinDauThau ? this.thongtinDauThau.donGia : null,[Validators.required]],
      goiThau: [
        this.thongtinDauThau ? this.thongtinDauThau.goiThau : null,
        [Validators.required],
      ],
      id: [this.thongtinDauThau ? this.thongtinDauThau.id : null],
      soLuong: [
        this.thongtinDauThau ? this.thongtinDauThau.soLuong : null,
        [Validators.required],
      ],
      thanhTien: [this.thongtinDauThau ? this.thongtinDauThau.thanhTien : null],
      bangChu: [this.thongtinDauThau ? this.thongtinDauThau.bangChu : null]
    });
    this.loadDonVi();
  }

  async loadDonVi(){
    const res = await this.donViService.layDonViCon();
    this.listChiCuc = [];
    if (res.msg == MESSAGE.SUCCESS) {
      for (let i = 0; i < res.data.length; i++) {
        const item = {
            'value' : res.data[i].maDvi,
            'text' : res.data[i].tenDvi
        };
        this.listChiCuc.push(item);
      }
    }
  }

  async changeChiCuc(event){
    // console.log(event);
    const res = await this.tinhTrangKhoHienThoiService.getChiCucByMaTongCuc(event)
    this.listDiemKho = [];
    this.formData.get('maDiemKho').setValue(null);
    this.formData.get('diaDiemNhap').setValue(null);
    if (res.msg == MESSAGE.SUCCESS) {
      for (let i = 0; i < res.data?.child.length; i++) {
        const item = {
            'value' : res.data.child[i].maDiemkho,
            'text' : res.data.child[i].tenDiemkho
        };
        this.listDiemKho.push(item);
      }
    }
  }

  changeDiemKho(){
      let chiCuc = this.listChiCuc.filter(item => item.value == this.formData.get('maCcuc').value);
      let diemKho = this.listDiemKho.filter(item => item.value == this.formData.get('maDiemKho').value);
      if(chiCuc.length>0 && diemKho.length>0){
        this.formData.get('tenCcuc').setValue(chiCuc[0].text);
        this.formData.get('tenDiemKho').setValue(diemKho[0].text);
        this.formData.get('diaDiemNhap').setValue(diemKho[0]?.text +" - " + chiCuc[0]?.text);
      }
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
}
