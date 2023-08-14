import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import dayjs from "dayjs";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {MESSAGE} from "../../../../../../constants/message";
import {Globals} from "../../../../../../shared/globals";
import {AMOUNT, AMOUNT_ONE_DECIMAL} from "../../../../../../Utility/utils";
import {NzModalRef} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-pop-up-chi-tiet-quy-hoach-kho',
  templateUrl: './pop-up-chi-tiet-quy-hoach-kho.component.html',
  styleUrls: ['./pop-up-chi-tiet-quy-hoach-kho.component.scss']
})
export class PopUpChiTietQuyHoachKhoComponent implements OnInit {
  formData: FormGroup;
  fb: FormBuilder = new FormBuilder();
  listVungMien : any[] = [];
  amount = AMOUNT;
  constructor(
    private danhMucService : DanhMucService,
    public globals: Globals,
    public  nzModal : NzModalRef
  ) {
    this.formData = this.fb.group(
      {
        id : [null],
        vungMien : [null],
        diaDiemKho : [null],
        slKhoTuyenI : [null],
        slKhoTuyenII : [null],
        slKhoDaDuyet : [null],
        dienTichDk : [null],
        tichLuong : [null],
        dtKhoTuyenI : [null],
        dtKhoTuyenII : [null],
        ghiChu : [null],
        idHdr : [null],
      })
  }

  ngOnInit(): void {
    this.loadDsVungMien();
  }

  async loadDsVungMien() {
    let res = await this.danhMucService.danhMucChungGetAll('VUNG_MIEN');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listVungMien = res.data;
    }
  }

  protected readonly AMOUNT_ONE_DECIMAL = AMOUNT_ONE_DECIMAL;

  handleOk() {
    this.nzModal.close(this.formData.value);
  }

  onCancel() {
    this.nzModal.close();
  }
}
