import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { uniqBy } from 'lodash';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { DanhSachGoiThau } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';

@Component({
  selector: 'dialog-them-moi-goi-thau',
  templateUrl: './dialog-them-moi-goi-thau.component.html',
  styleUrls: ['./dialog-them-moi-goi-thau.component.scss'],
})
export class DialogThemMoiGoiThauComponent implements OnInit {
  formGoiThau: FormGroup;
  data?: any;
  listVatTu?= [];
  vatTuChaId?: any;
  listChungLoai = [];
  listDonVi = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  thongtinDauThau: DanhSachGoiThau = new DanhSachGoiThau();

  constructor(
    private _modalRef: NzModalRef,
    private fb: FormBuilder
  ) {
    this.formGoiThau = this.fb.group({
      tenGThau: [null],
      tenVthh: [null],
      loaiVthh: [null],
      cloaiVthh: [null],
      tenCloaiVthh: [null],
      dvTinh: [null],
      soLuong: [null],
      donGia: [null],
      thanhTien: [null],
      hThuc: [null],
      pThucLCNT: [null],
      tgianBatDau: [null],
      loaiHdong: [null],
      tgianThienHd: [null]
    });
  }

  ngOnInit(): void {
    this.listChungLoai = uniqBy(this.listVatTu.filter(item => item.maVatTuCha == this.vatTuChaId), 'maVatTu', 'tenVatTu');
    console.log(this.listChungLoai);
    this.formGoiThau.patchValue({
      loaiVthh: this.listChungLoai[0].maVatTuCha,
      tenVthh: this.listChungLoai[0].tenVatTuCha
    })
  }

  handleOk() {
    const body = this.formGoiThau.value;
    console.log("🚀 ~ file: dialog-them-moi-goi-thau.component.ts ~ line 44 ~ DialogThemMoiGoiThauComponent ~ handleOk ~ body", body)
    this._modalRef.close(body);
  }

  handleCancel() {
    this._modalRef.close();
  }

  changeChungLoai(event) {
    this.listDonVi = uniqBy(this.listChungLoai.filter(item => item.maVatTu == event), 'maDvi', 'tenDonVi');
  }

  addDiemKho() {
    if (this.thongtinDauThau.maDvi && this.thongtinDauThau.soLuong) {
      let dataDvi = this.listDonVi.filter(d => d.maDvi == this.thongtinDauThau.maDvi)
      this.thongtinDauThau.tenDvi = dataDvi[0].tenDonVi;
      this.dataTable = [...this.dataTable, this.thongtinDauThau];
      this.thongtinDauThau = new DanhSachGoiThau();
    }
  }

  clearDiemKho() {

  }

}
