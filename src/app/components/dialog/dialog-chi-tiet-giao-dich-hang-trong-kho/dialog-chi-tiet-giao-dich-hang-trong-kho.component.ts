import { Component, OnInit } from '@angular/core';
import { QuanLyHangTrongKhoService } from 'src/app/services/quanLyHangTrongKho.service';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import * as dayjs from 'dayjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'dialog-chi-tiet-giao-dich-hang-trong-kho',
  templateUrl: './dialog-chi-tiet-giao-dich-hang-trong-kho.component.html',
  styleUrls: ['./dialog-chi-tiet-giao-dich-hang-trong-kho.component.scss']
})
export class DialogChiTietGiaoDichHangTrongKhoComponent implements OnInit {


  pageSize = PAGE_SIZE_DEFAULT
  page: 0

  formData: FormGroup
  dataView: any;
  isView: boolean
  constructor(

    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private quanLyHangTrongKhoService: QuanLyHangTrongKhoService) {
    // this.formData = this.fb.group(

    // )
  }

  async ngOnInit() {
    this.spinner.show()
    await this.loadData()
  }
  onCancel() { }

  dataInTable: any = []
  async loadData() {
    let body = {
      "denNgay": "",
      "tuNgay": "",
      "maLokho": "0101020101010102",
      "maVatTu": "021101",
      "paggingReq": {
        "limit": 10,
        "orderBy": "",
        "orderType": "",
        "page": this.page - 1
      }
    }

    let res = await this.quanLyHangTrongKhoService.searchDetail(body)
    console.log(res);

  }
}
