import { Component, OnInit } from '@angular/core';
import {Globals} from "../../../shared/globals";
import {MESSAGE} from "../../../constants/message";
import {DonviService} from "../../../services/donvi.service";
import {ThongTinDiaDiemNhap} from "../../../models/QuyetDinhNhapXuat";
import {NzModalRef} from "ng-zorro-antd/modal";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-dialog-them-chi-cuc',
  templateUrl: './dialog-them-chi-cuc.component.html',
  styleUrls: ['./dialog-them-chi-cuc.component.scss']
})
export class DialogThemChiCucComponent implements OnInit {

  dataTable : any[] = []
  rowItem : any = {};
  listChiCuc: any[] = [];
  data : any
  formData: FormGroup

  constructor(
      public globals : Globals,
      private donViService : DonviService,
      private _modalRef: NzModalRef,
      private fb : FormBuilder
  ) {
    this.formData = this.fb.group({

    })
  }

  ngOnInit(): void {
    console.log(this.data);
    this.loadDiemKho();
  }

  async loadDiemKho() {
    let body = {
      maDviCha: this.data.maDvi,
      trangThai: '01',
    }
    const res = await this.donViService.getTreeAll(body);
    if (res.msg == MESSAGE.SUCCESS) {
        res.data.forEach(element => {
            this.listChiCuc = [
              ...this.listChiCuc,
              ...element.children
            ]
        });
    }
  }

  changeChiCuc() {
    let chiCuc = this.listChiCuc.filter(x => x.key == this.rowItem.maDvi);
    if (chiCuc && chiCuc.length > 0) {
      this.rowItem.tenDvi = chiCuc[0].tenDvi
    }
  }


  themChiCuc() {
    this.dataTable = [...this.dataTable, this.rowItem];
    this.rowItem = {}
  }

  clearDiaDiemNhap() {
    this.rowItem = {};
  }

  handleOk() {
    this._modalRef.close(this.dataTable);
  }

  handleCancel() {
    this._modalRef.destroy();
  }

}
